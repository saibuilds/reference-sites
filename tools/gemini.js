#!/usr/bin/env node
// Direct CLI wrapper around Gemini 2.5 Flash via REST.
// Works from refsites-code because generativelanguage.googleapis.com is in
// this environment's egress allowlist (verified). Use this as a fast,
// long-context sub-agent for tasks Claude shouldn't burn its own context on:
// summarising large files, drafting copy, extracting structured info from
// pasted docs / DESIGN.md notes, image analysis (multimodal).
//
// Usage:
//   echo "Summarize this file:" "$(cat build.js)" | node tools/gemini.js
//   node tools/gemini.js "Reply with one word: WORKS"
//   node tools/gemini.js --model gemini-2.5-flash-lite "Cheap quick draft"
//   node tools/gemini.js --json '{"contents":[...]}'         # raw passthrough
//
// Requires GEMINI_API_KEY in env. Source .mcp.env first if running locally:
//   set -a && source .mcp.env && set +a

const https = require('https');

const args = process.argv.slice(2);
let model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
let rawJson = null;
const promptParts = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--model') { model = args[++i]; continue; }
  if (args[i] === '--json')  { rawJson = args[++i]; continue; }
  promptParts.push(args[i]);
}

async function readStdin() {
  if (process.stdin.isTTY) return '';
  return new Promise((resolve) => {
    let data = '';
    process.stdin.on('data', (c) => { data += c; });
    process.stdin.on('end', () => resolve(data));
  });
}

(async () => {
  const KEY = process.env.GEMINI_API_KEY;
  if (!KEY) {
    console.error('GEMINI_API_KEY not set. Try: set -a && source .mcp.env && set +a');
    process.exit(1);
  }

  let body;
  if (rawJson) {
    body = rawJson;
  } else {
    let prompt = promptParts.join(' ').trim();
    const stdin = await readStdin();
    if (stdin) prompt = (prompt ? prompt + '\n\n' : '') + stdin.trim();
    if (!prompt) {
      console.error('Usage: gemini.js [--model ID] "<prompt>"   OR pipe via stdin   OR --json \'<payload>\'');
      process.exit(1);
    }
    body = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] });
  }

  const u = new URL(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${KEY}`);

  for (let attempt = 1; attempt <= 5; attempt++) {
    const res = await new Promise((resolve, reject) => {
      const req = https.request({
        method: 'POST',
        hostname: u.hostname,
        path: u.pathname + u.search,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      }, (r) => {
        const chunks = [];
        r.on('data', (c) => chunks.push(c));
        r.on('end', () => resolve({ status: r.statusCode, body: Buffer.concat(chunks).toString('utf8') }));
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    });

    if (res.status === 200) {
      const data = JSON.parse(res.body);
      const text = (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('');
      process.stdout.write(text);
      if (!text.endsWith('\n')) process.stdout.write('\n');
      return;
    }
    if (res.status === 503 || res.status === 429) {
      const wait = 1500 * Math.pow(2, attempt - 1);
      console.error(`gemini.js: HTTP ${res.status} (transient) — retry ${attempt}/5 in ${wait}ms`);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }
    console.error(`gemini.js: HTTP ${res.status}`);
    console.error(res.body.slice(0, 800));
    process.exit(1);
  }
  console.error('gemini.js: out of retries (Gemini service overloaded)');
  process.exit(1);
})();
