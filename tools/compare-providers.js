#!/usr/bin/env node
// Side-by-side image generator: same prompt -> Higgsfield + fal.ai + Pollinations.
// Saves to assets/comparison/<archetype>-<provider>.jpg so you can pick a winner.
//
// Usage:
//   node tools/compare-providers.js                 # all 15 archetypes
//   node tools/compare-providers.js 13-wellness-botanical   # one archetype
//
// Required env (use whichever you have; missing = that provider is skipped):
//   HIGGSFIELD_API_KEY + HIGGSFIELD_API_SECRET    (Higgsfield)
//   FAL_KEY                                        (fal.ai)
//   (Pollinations needs no key)
//
// Network: the host running this needs outbound to platform.higgsfield.ai,
// fal.run / queue.fal.run, and image.pollinations.ai.

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'assets', 'comparison');
fs.mkdirSync(OUT, { recursive: true });

const src = fs.readFileSync(path.join(ROOT, 'build.js'), 'utf8');
const m = src.match(/const GEN_PROMPT\s*=\s*(\{[\s\S]*?\})\s*;\s*\nfunction\s+artSVG/);
if (!m) { console.error('GEN_PROMPT not found in build.js'); process.exit(1); }
const PROMPTS = eval('(' + m[1] + ')');

const W = 1600, H = 1000;
const target = process.argv[2];
const ids = target ? [target] : Object.keys(PROMPTS);
if (target && !PROMPTS[target]) { console.error('unknown archetype:', target); process.exit(1); }

const HF_KEY = process.env.HIGGSFIELD_API_KEY || process.env.HF_API_KEY;
const HF_SECRET = process.env.HIGGSFIELD_API_SECRET || process.env.HF_SECRET;
const FAL = process.env.FAL_KEY;
const FAL_MODEL = process.env.FAL_MODEL || 'fal-ai/nano-banana';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const json = (body) => Buffer.from(JSON.stringify(body));

function request(method, url, { headers = {}, body, timeout = 120000 } = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = { method, hostname: u.hostname, path: u.pathname + u.search, headers, timeout };
    const req = https.request(opts, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
    });
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

function saveBuffer(file, buf) { fs.writeFileSync(file, buf); }

async function fetchToFile(url, file) {
  const r = await request('GET', url);
  if (r.status !== 200) throw new Error(`download ${url} -> HTTP ${r.status}`);
  saveBuffer(file, r.body);
}

// ─── Higgsfield ─────────────────────────────────────────────────────────────
async function gen_higgsfield(prompt, outFile) {
  if (!HF_KEY || !HF_SECRET) throw new Error('missing HIGGSFIELD_API_KEY / HIGGSFIELD_API_SECRET');
  const auth = { 'hf-api-key': HF_KEY, 'hf-secret': HF_SECRET, 'Authorization': `Key ${HF_KEY}:${HF_SECRET}`, 'Content-Type': 'application/json' };
  const submit = await request('POST', 'https://platform.higgsfield.ai/v1/text2image/soul', {
    headers: auth,
    body: json({ params: { prompt, width_and_height: `${W}x${H}`, quality: '1080p', batch_size: 1, enhance_prompt: false } })
  });
  if (submit.status !== 200) throw new Error(`HF submit HTTP ${submit.status}: ${submit.body.toString().slice(0,180)}`);
  const jobSetId = JSON.parse(submit.body).id || JSON.parse(submit.body).job_set_id;
  // poll
  for (let i = 0; i < 60; i++) {
    await sleep(3000);
    const s = await request('GET', `https://platform.higgsfield.ai/v1/job-sets/${jobSetId}`, { headers: auth });
    if (s.status !== 200) throw new Error(`HF poll HTTP ${s.status}`);
    const data = JSON.parse(s.body);
    const jobs = data.jobs || data.job_set || data;
    const job = (Array.isArray(jobs) ? jobs[0] : (jobs.jobs ? jobs.jobs[0] : jobs));
    const status = (job && job.status) || data.status;
    if (status === 'completed') {
      const url = job?.results?.[0]?.url || job?.result?.url || job?.url;
      if (!url) throw new Error('HF completed but no url in response');
      return fetchToFile(url, outFile);
    }
    if (status === 'failed' || status === 'nsfw') throw new Error(`HF status ${status}`);
  }
  throw new Error('HF timed out');
}

// ─── fal.ai ─────────────────────────────────────────────────────────────────
async function gen_fal(prompt, outFile) {
  if (!FAL) throw new Error('missing FAL_KEY');
  const headers = { 'Authorization': `Key ${FAL}`, 'Content-Type': 'application/json' };
  const submit = await request('POST', `https://queue.fal.run/${FAL_MODEL}`, {
    headers,
    body: json({ prompt, image_size: { width: W, height: H } })
  });
  if (submit.status >= 400) throw new Error(`fal submit HTTP ${submit.status}: ${submit.body.toString().slice(0,180)}`);
  const queued = JSON.parse(submit.body);
  const statusUrl = queued.status_url || `https://queue.fal.run/${FAL_MODEL}/requests/${queued.request_id}/status`;
  const resultUrl = queued.response_url || `https://queue.fal.run/${FAL_MODEL}/requests/${queued.request_id}`;
  for (let i = 0; i < 60; i++) {
    await sleep(3000);
    const s = await request('GET', statusUrl, { headers });
    if (s.status !== 200) throw new Error(`fal status HTTP ${s.status}`);
    const sd = JSON.parse(s.body);
    if (sd.status === 'COMPLETED' || sd.status === 'OK') {
      const r = await request('GET', resultUrl, { headers });
      const rd = JSON.parse(r.body);
      const img = rd.images?.[0]?.url || rd.image?.url || rd.url;
      if (!img) throw new Error('fal completed but no image url');
      return fetchToFile(img, outFile);
    }
    if (sd.status === 'FAILED' || sd.status === 'ERROR') throw new Error(`fal status ${sd.status}`);
  }
  throw new Error('fal timed out');
}

// ─── Pollinations (free) ────────────────────────────────────────────────────
async function gen_pollinations(prompt, outFile) {
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=flux&width=${W}&height=${H}&nologo=true`;
  return fetchToFile(url, outFile);
}

const providers = [
  { name: 'higgsfield', fn: gen_higgsfield },
  { name: 'fal',        fn: gen_fal },
  { name: 'pollinations', fn: gen_pollinations },
];

(async () => {
  const results = [];
  for (const id of ids) {
    const prompt = PROMPTS[id];
    if (!prompt) { console.error('skip (no prompt):', id); continue; }
    for (const p of providers) {
      const out = path.join(OUT, `${id}-${p.name}.jpg`);
      if (fs.existsSync(out)) { console.log('skip exists:', path.relative(ROOT, out)); results.push({ id, provider: p.name, ok: true, skipped: true }); continue; }
      process.stdout.write(`gen ${id} via ${p.name} … `);
      try {
        const t0 = Date.now();
        await p.fn(prompt, out);
        const ms = Date.now() - t0;
        const size = fs.statSync(out).size;
        console.log(`ok ${ms}ms ${(size/1024).toFixed(0)}kB`);
        results.push({ id, provider: p.name, ok: true, ms, size });
      } catch (e) {
        console.log('FAIL', e.message);
        results.push({ id, provider: p.name, ok: false, err: e.message });
      }
      await sleep(1500);
    }
  }
  console.log('\n— summary —');
  for (const r of results) {
    console.log(r.ok ? `OK   ${r.id} ${r.provider}${r.skipped ? ' (cached)' : ''}` : `FAIL ${r.id} ${r.provider} — ${r.err}`);
  }
  console.log(`\nFiles in ${path.relative(ROOT, OUT)}/. Pick the winner per archetype, copy to assets/<id>-hero.jpg, then run: node build.js && node build-index.js`);
})();
