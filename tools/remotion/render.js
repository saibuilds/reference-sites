#!/usr/bin/env node
// Render a 5-second cinematic brand reel per archetype to
// assets/<id>-hero.mp4. Reads STYLES from ../../build.js.
//
// Usage:
//   node tools/remotion/render.js                       # all archetypes
//   node tools/remotion/render.js 13-wellness-botanical # one archetype

const fs = require('fs');
const path = require('path');
const { bundle } = require('@remotion/bundler');
const { selectComposition, renderMedia } = require('@remotion/renderer');

const ROOT = path.resolve(__dirname, '..', '..');
const ASSETS = path.join(ROOT, 'assets');
fs.mkdirSync(ASSETS, { recursive: true });

// Extract STYLES[] from build.js without requiring the script (it has side
// effects). The array is pure data, so eval is safe here.
const src = fs.readFileSync(path.join(ROOT, 'build.js'), 'utf8');
const m = src.match(/const STYLES\s*=\s*(\[[\s\S]*?\n\]);/);
if (!m) { console.error('Could not extract STYLES from build.js'); process.exit(1); }
const STYLES = eval('(' + m[1] + ')');

const target = process.argv[2];
const ids = target ? [target] : STYLES.map((s) => s.id);
if (target && !STYLES.find((s) => s.id === target)) {
  console.error('Unknown archetype:', target);
  process.exit(1);
}

(async () => {
  console.log(`Bundling Remotion project (${ids.length} archetype${ids.length === 1 ? '' : 's'} to render)...`);
  const serveUrl = await bundle({ entryPoint: path.resolve(__dirname, 'src/index.ts') });

  for (const id of ids) {
    const s = STYLES.find((x) => x.id === id);
    if (!s) continue;
    const out = path.join(ASSETS, `${id}-hero.mp4`);
    if (fs.existsSync(out)) {
      console.log('skip exists:', path.relative(ROOT, out));
      continue;
    }
    const inputProps = {
      styleId: s.id,
      vars: s.vars,
      disp: s.disp,
      body: s.body,
      light: !!s.light,
      brand: s.g.brand,
      kicker: s.g.kicker,
      h1: s.g.h1,
    };
    process.stdout.write(`render ${id} → ${path.relative(ROOT, out)} ... `);
    const composition = await selectComposition({ serveUrl, id: 'HeroReel', inputProps });
    await renderMedia({
      composition,
      serveUrl,
      codec: 'h264',
      outputLocation: out,
      inputProps,
    });
    const size = fs.statSync(out).size;
    console.log(`ok ${(size / 1024 / 1024).toFixed(1)}MB`);
  }

  console.log('\ndone.');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
