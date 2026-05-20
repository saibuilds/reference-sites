#!/usr/bin/env node
// Generate hero rasters via pollinations.ai sana model (free tier).
// SERIAL — free tier allows only 1 concurrent req per IP. Skips existing.

const fs = require('fs');
const path = require('path');
const https = require('https');

const src = fs.readFileSync(path.join(__dirname, '..', 'build.js'), 'utf8');
const m = src.match(/const GEN_PROMPT\s*=\s*(\{[\s\S]*?\})\s*;\s*\nfunction\s+artSVG/);
if (!m) { console.error('GEN_PROMPT not found in build.js'); process.exit(1); }
const GEN_PROMPT = eval('(' + m[1] + ')');

const ASSETS = path.join(__dirname, '..', 'assets');
fs.mkdirSync(ASSETS, { recursive: true });

const WIDTH = 1280, HEIGHT = 800;
const MODEL = process.env.MODEL || 'sana';
const PER_REQ_TIMEOUT = 120000;
const GAP_MS = 4000;

function fetchImage(prompt, seed) {
  const url = 'https://image.pollinations.ai/prompt/' +
    encodeURIComponent(prompt) +
    `?width=${WIDTH}&height=${HEIGHT}&model=${MODEL}&seed=${seed}&nologo=true&enhance=true`;
  return new Promise((resolve, reject) => {
    const opts = { timeout: PER_REQ_TIMEOUT, headers: { Referer: 'https://saibuilds.dev', 'User-Agent': 'saibuilds-reference-sites/1.0' } };
    const req = https.get(url, opts, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, opts, (r2) => collect(r2, resolve, reject)).on('error', reject);
        return;
      }
      collect(res, resolve, reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(new Error('timeout')); });
  });
}

function collect(res, resolve, reject) {
  if (res.statusCode !== 200) { reject(new Error('HTTP ' + res.statusCode)); return; }
  const chunks = [];
  res.on('data', c => chunks.push(c));
  res.on('end', () => resolve(Buffer.concat(chunks)));
  res.on('error', reject);
}

async function genOne(id, prompt, attempt = 0) {
  const out = path.join(ASSETS, `${id}-hero.jpg`);
  if (fs.existsSync(out) && fs.statSync(out).size > 8000) {
    console.log(`SKIP ${id} (already ${(fs.statSync(out).size/1024).toFixed(0)} kB)`);
    return true;
  }
  const seed = id.split('').reduce((a, c) => a + c.charCodeAt(0), 1000);
  try {
    const buf = await fetchImage(prompt, seed + attempt * 17);
    if (buf.length < 8000) {
      const head = buf.slice(0, 200).toString('utf8');
      throw new Error('too small ' + buf.length + ' — ' + head.slice(0, 120));
    }
    fs.writeFileSync(out, buf);
    console.log(`OK   ${id} (${(buf.length / 1024).toFixed(0)} kB)`);
    return true;
  } catch (e) {
    if (attempt < 3) {
      const wait = 5000 * (attempt + 1);
      console.log(`...retry ${id} after ${wait}ms (${e.message.slice(0,80)})`);
      await new Promise(r => setTimeout(r, wait));
      return genOne(id, prompt, attempt + 1);
    }
    console.error(`FAIL ${id} -- ${e.message.slice(0,120)}`);
    return false;
  }
}

(async () => {
  const ids = Object.keys(GEN_PROMPT);
  console.log(`Heroes: ${ids.length} (${MODEL} ${WIDTH}x${HEIGHT}, serial, ${GAP_MS}ms gap)`);
  let ok = 0, fail = 0;
  for (const id of ids) {
    const success = await genOne(id, GEN_PROMPT[id]);
    success ? ok++ : fail++;
    await new Promise(r => setTimeout(r, GAP_MS));
  }
  console.log(`\nDone: ${ok} ok, ${fail} failed`);
  process.exit(fail > 0 ? 1 : 0);
})();
