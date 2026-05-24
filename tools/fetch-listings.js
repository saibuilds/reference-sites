#!/usr/bin/env node
// Build-time RESO Web API listings fetch.
// Runs in the Cloudflare build (where RESO_* env vars live) BEFORE build.js,
// writes data/listings.json, which build.js bakes into the static pages.
// The token never reaches the browser — it stays a Cloudflare env var.
//
// Cloudflare build command:
//   node tools/fetch-listings.js && node build.js && node build-index.js
//
// Env vars (set these in Cloudflare → your env → Variables):
//   RESO_BASE        service root, e.g. https://api.bridgedataoutput.com/api/v2/OData/<dataset>
//   RESO_TOKEN       static bearer token (simplest)   — OR the OAuth2 trio below:
//   RESO_TOKEN_URL   OAuth2 token endpoint (client-credentials)
//   RESO_CLIENT_ID   OAuth2 client id
//   RESO_CLIENT_SECRET
//   RESO_SCOPE       (optional) OAuth2 scope
//   RESO_TOP         how many listings (default 12)
//   RESO_FILTER      OData $filter (default: StandardStatus eq 'Active')
//
// If nothing is configured (e.g. local dev with no token), it writes an empty
// list and exits 0 — the build still succeeds and pages show the placeholder.

const fs = require('fs');
const path = require('path');
const https = require('https');

const OUT = path.join(__dirname, '..', 'data');
fs.mkdirSync(OUT, { recursive: true });
const OUT_FILE = path.join(OUT, 'listings.json');

const BASE = process.env.RESO_BASE;
const TOP = process.env.RESO_TOP || '12';
const FILTER = process.env.RESO_FILTER || "StandardStatus eq 'Active'";

function writeOut(arr) {
  fs.writeFileSync(OUT_FILE, JSON.stringify(arr, null, 1));
  console.log(`fetch-listings: wrote ${arr.length} listing(s) → data/listings.json`);
}

function req(method, url, { headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const r = https.request(
      { method, hostname: u.hostname, path: u.pathname + u.search, headers, timeout: 30000 },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf8') }));
      }
    );
    r.on('timeout', () => r.destroy(new Error('timeout')));
    r.on('error', reject);
    if (body) r.write(body);
    r.end();
  });
}

async function getToken() {
  if (process.env.RESO_TOKEN) return process.env.RESO_TOKEN;
  const { RESO_TOKEN_URL, RESO_CLIENT_ID, RESO_CLIENT_SECRET, RESO_SCOPE } = process.env;
  if (!RESO_TOKEN_URL || !RESO_CLIENT_ID || !RESO_CLIENT_SECRET) return null;
  const form = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: RESO_CLIENT_ID,
    client_secret: RESO_CLIENT_SECRET,
  });
  if (RESO_SCOPE) form.set('scope', RESO_SCOPE);
  const res = await req('POST', RESO_TOKEN_URL, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(form.toString()) },
    body: form.toString(),
  });
  if (res.status !== 200) throw new Error(`OAuth token HTTP ${res.status}: ${res.body.slice(0, 200)}`);
  return JSON.parse(res.body).access_token;
}

// Map standard RESO Data Dictionary fields → simple card shape.
function normalize(rec) {
  const media = Array.isArray(rec.Media) ? rec.Media : [];
  const img = media.map((m) => m.MediaURL || m.Url).find(Boolean) || '';
  const n = (v) => (v === 0 || v ? String(v) : '');
  const price = rec.ListPrice != null ? '$' + Number(rec.ListPrice).toLocaleString() : '';
  const addr = rec.UnparsedAddress || [rec.StreetNumber, rec.StreetName].filter(Boolean).join(' ') || '';
  return {
    key: rec.ListingKey || rec.ListingId || '',
    price,
    address: addr,
    city: rec.City || '',
    region: rec.StateOrProvince || '',
    beds: n(rec.BedroomsTotal),
    baths: n(rec.BathroomsTotalInteger ?? rec.BathroomsTotal),
    sqft: rec.LivingArea ? Number(rec.LivingArea).toLocaleString() : '',
    type: rec.PropertyType || rec.PropertySubType || '',
    status: rec.StandardStatus || '',
    url: rec.ListingURL || '',
    image: img,
  };
}

async function fetchListings(token) {
  const sel = 'ListingKey,ListPrice,UnparsedAddress,StreetNumber,StreetName,City,StateOrProvince,BedroomsTotal,BathroomsTotalInteger,LivingArea,PropertyType,PropertySubType,StandardStatus,ListingURL';
  const base = BASE.replace(/\/$/, '');
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json' };
  const qs = (expand) =>
    `${base}/Property?$top=${encodeURIComponent(TOP)}&$filter=${encodeURIComponent(FILTER)}&$select=${encodeURIComponent(sel)}${expand ? '&$expand=' + encodeURIComponent('Media($top=1)') : ''}`;
  // Try with media expand; if the provider rejects it, retry without.
  let res = await req('GET', qs(true), { headers });
  if (res.status !== 200) res = await req('GET', qs(false), { headers });
  if (res.status !== 200) throw new Error(`OData HTTP ${res.status}: ${res.body.slice(0, 240)}`);
  const data = JSON.parse(res.body);
  return (data.value || []).map(normalize);
}

(async () => {
  try {
    if (!BASE) {
      console.log('fetch-listings: RESO_BASE not set — writing empty list (pages show placeholder).');
      return writeOut([]);
    }
    const token = await getToken();
    if (!token) {
      console.log('fetch-listings: no token (set RESO_TOKEN or the OAuth2 trio) — writing empty list.');
      return writeOut([]);
    }
    const listings = await fetchListings(token);
    writeOut(listings);
  } catch (e) {
    // Never break the build over a feed hiccup — ship placeholder instead.
    console.error('fetch-listings: failed —', e.message, '— writing empty list.');
    writeOut([]);
  }
})();
