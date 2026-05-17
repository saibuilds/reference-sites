/* Builds index.html — the gallery linking every reference site,
   with reel-comparison notes, from manifest.json. Run: node build-index.js */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const m = JSON.parse(fs.readFileSync(path.join(ROOT,'manifest.json'),'utf8'));

const styleCards = m.styles.map((s,i)=>`
    <article class="card" style="--ac:${s.accent}">
      <div class="sw" style="background:${s.accent}"></div>
      <div class="cbody">
        <div class="num">STYLE ${String(i+1).padStart(2,'0')}</div>
        <h3>${s.name}</h3>
        <p class="refs">${s.refs}</p>
        <p class="tag">${s.tag}</p>
        <div class="links">
          <a href="styles/${s.id}.html">Generic — ${s.g}</a>
          <a href="styles-realestate/${s.id}.html">Real estate — ${s.re}</a>
        </div>
      </div>
    </article>`).join('');

const reelRows = m.reels.map(r=>`
      <tr>
        <td class="rn"><span style="background:${r.accent}"></span>${String(r.n).padStart(2,'0')}</td>
        <td class="rs">${r.site}</td>
        <td class="rt">${r.tech}</td>
        <td class="rst">${r.styleName}</td>
        <td class="ra"><a href="reels/${r.slug}.html">Generic</a> · <a href="reels-realestate/${r.slug}.html">Real estate</a></td>
      </tr>`).join('');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Reference Sites — AI Website Library</title>
<meta name="description" content="64 reference builds: 12 style archetypes + 20 reel-specific sites, generic and real-estate themed, faithful to the research library.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Playfair+Display:wght@500;600&display=swap">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#07080C;color:#EDEFF5;font-family:'Space Grotesk',system-ui,sans-serif;line-height:1.6;-webkit-font-smoothing:antialiased}
  a{color:inherit}
  .wrap{max-width:1280px;margin:0 auto;padding:0 clamp(1.2rem,4vw,3rem)}
  header{padding:clamp(4rem,12vh,8rem) 0 3rem;border-bottom:1px solid rgba(255,255,255,.08);
    background:radial-gradient(60% 80% at 80% 0,rgba(123,97,255,.16),transparent 60%)}
  .eyebrow{font-size:.74rem;letter-spacing:.32em;text-transform:uppercase;color:#7B61FF}
  h1{font-family:'Playfair Display',serif;font-size:clamp(2.4rem,6vw,4.6rem);margin:.8rem 0 1rem;line-height:1.05}
  .sub{max-width:62ch;opacity:.72;font-size:clamp(1rem,1.4vw,1.15rem)}
  .meta{display:flex;gap:2.4rem;flex-wrap:wrap;margin-top:2.4rem;font-size:.82rem;opacity:.7}
  .meta b{font-family:'Playfair Display',serif;font-size:1.6rem;color:#fff;display:block}
  section{padding:clamp(3.5rem,9vh,6rem) 0}
  h2{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,4vw,3rem);margin-bottom:.5rem}
  .lead{opacity:.66;margin-bottom:2.6rem;max-width:60ch}
  .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.4rem}
  @media(max-width:980px){.grid{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:640px){.grid{grid-template-columns:1fr}}
  .card{border:1px solid rgba(255,255,255,.09);border-radius:16px;overflow:hidden;background:rgba(255,255,255,.025);
    transition:transform .4s cubic-bezier(.16,1,.3,1),border-color .4s}
  .card:hover{transform:translateY(-6px);border-color:var(--ac)}
  .sw{height:6px}
  .cbody{padding:1.6rem}
  .card .num{font-size:.7rem;letter-spacing:.2em;color:var(--ac);opacity:.9}
  .card h3{font-family:'Playfair Display',serif;font-size:1.25rem;margin:.5rem 0}
  .card .refs{font-size:.78rem;opacity:.55;margin-bottom:.7rem}
  .card .tag{font-size:.84rem;opacity:.72;min-height:5.5em}
  .card .links{display:flex;flex-direction:column;gap:.5rem;margin-top:1.2rem}
  .card .links a{font-size:.82rem;padding:.6rem .9rem;border:1px solid rgba(255,255,255,.12);border-radius:8px;
    text-align:center;transition:background .3s,border-color .3s}
  .card .links a:hover{background:var(--ac);color:#000;border-color:var(--ac)}
  table{width:100%;border-collapse:collapse;font-size:.88rem}
  th,td{text-align:left;padding:.9rem 1rem;border-bottom:1px solid rgba(255,255,255,.07);vertical-align:top}
  th{font-size:.7rem;letter-spacing:.16em;text-transform:uppercase;opacity:.55;font-weight:600}
  .rn{white-space:nowrap;font-variant-numeric:tabular-nums}
  .rn span{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:.6rem;vertical-align:middle}
  .rs{font-weight:600}
  .rt{opacity:.66;max-width:30ch}
  .rst{opacity:.66}
  .ra{white-space:nowrap}
  .ra a{color:#9D86FF}
  .note{margin-top:2.4rem;padding:1.4rem 1.6rem;border:1px solid rgba(255,255,255,.09);border-radius:12px;
    background:rgba(123,97,255,.06);font-size:.86rem;opacity:.85;max-width:74ch}
  footer{padding:4rem 0;border-top:1px solid rgba(255,255,255,.08);opacity:.5;font-size:.82rem}
</style>
</head>
<body>
<header>
  <div class="wrap">
    <div class="eyebrow">AI Website Library · Reference Builds</div>
    <h1>Every site from the research library, built to compare.</h1>
    <p class="sub">Self-contained recreations of all 12 design-style archetypes and all 20 reference reels — each in a generic version (true to the original brand) and a real-estate / reno-business variant. Open a build, then play the matching reel video to compare.</p>
    <div class="meta">
      <div><b>12</b> style archetypes</div>
      <div><b>20</b> reference reels</div>
      <div><b>64</b> total builds</div>
      <div><b>0</b> frameworks · pure HTML/CSS/JS</div>
    </div>
  </div>
</header>

<section>
  <div class="wrap">
    <h2>The 12 Style Archetypes</h2>
    <p class="lead">Each archetype recreates the palette, type pairing, section rhythm and signature motion described in <code>02-REEL-FINDINGS.md</code>.</p>
    <div class="grid">${styleCards}
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <h2>The 20 Reels — 1:1 Reference Builds</h2>
    <p class="lead">Each reel mapped to its closest archetype system. Open the build alongside the reel video to verify it matches.</p>
    <div style="overflow-x:auto">
      <table>
        <thead><tr><th>#</th><th>Reference Site</th><th>Key Technique</th><th>Style System</th><th>Open Build</th></tr></thead>
        <tbody>${reelRows}
        </tbody>
      </table>
    </div>
    <div class="note"><strong>How to compare:</strong> reel video links live in <code>00-REEL-LINKS.md</code>. Open the matching build here, watch the reel, and check: hero treatment, palette, type pairing, scroll/motion signature, and section pacing. Builds are intentionally faithful to the <em>system</em> (not pixel-copies of proprietary footage).</div>
  </div>
</section>

<footer>
  <div class="wrap">Reference site library · part of the SathiDeals / reno AI website builder framework · regenerate with <code>node build.js &amp;&amp; node build-index.js</code></div>
</footer>
</body>
</html>`;

fs.writeFileSync(path.join(ROOT,'index.html'), html);
console.log('index.html written —', m.styles.length,'styles,', m.reels.length,'reels.');
