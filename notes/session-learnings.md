# Session learnings — reference-sites

Append-only log of decisions, patterns, and safety calls made while building the reference-sites SSG. Read this before adding new renderers / dependencies / external services.

## 2026-05 — Skill-pack + screenshot workflow

Switched from heavy browser-harvest (Spline / Hunyuan / Webflow scraping) to a lightweight workflow:
- 4 skill files in `~/.claude/skills/`: `reference-sites-{brand,stack,components,copy}.md`
- 5th skill: `reference-sites-safety.md` — safe vs unsafe tools triage
- Pattern sources: 21st.dev, Aceternity UI, MagicUI, Hover.dev (snippet copy-paste, React/Tailwind → vanilla)
- Inspiration: godly.website, awwwards, siteinspire (screenshot → mimic)
- Drop screenshot → identify dominant motion pattern → check existing renderer → reuse or grab new snippet
- Convert React `className=` → `class=`, Tailwind utilities → inline `<style>` block per renderer, `useState` → IIFE addEventListener

## 2026-05 — Safety triage

Definition of "safe" in this repo:
1. No user/business data leaves Machine 1
2. No 3rd-party tracking in output HTML
3. OSS-compatible license (MIT / Apache-2.0 / LGPL / BSD)
4. No runtime hotlink that can be revoked or used for fingerprinting

**Safe (CDN load OK)**: Three.js, Babylon.js, p5.js, Theatre.js, Rapier (WASM), GSAP+ScrollTrigger, Lenis, VANTA, OGL, Pixi.js

**Safe (asset generators, output downloaded locally)**: Hunyuan 3D (GLB), Higgsfield (WebP first/last frames), Kling (extract first+last frames via ffmpeg), ChatGPT image gen, Nano Banana (Google Gemini image), Blender, Spline (GLB export only — never iframe), Google Stitch (inspo only — never ship Stitch's exported code, it pulls Google fonts + telemetry)

**Unsafe / SKIP at runtime**: Unicorn Studio embed, Spline iframe, Webflow embed, Framer embed, Vimeo/YouTube iframe, Google Fonts via `<link>`, external image hotlinks (Unsplash CDN), analytics snippets (GA / Hotjar / Mixpanel), Tailwind CDN, splinetool/runtime npm import on output

**Data hygiene rules**:
- Never commit `.env` / API keys / PIT tokens / OAuth tokens
- Strip Spline GLB exports of user-ID metadata: `gltf-pipeline -i in.glb -o out.glb -d`
- No analytics in reference sites (they're inspiration sites, not lead-gen)
- No login flows, no form POSTs (mailto only)
- GHL / lead data NEVER referenced in this repo
- Push only to `claude/setup-mcp-api-keys-t4GTr`. Never to `main`.

## 2026-05 — Renderer additions

- `relatsKinetic`: 360vh sticky kinetic-typography stage with per-char `--tx/--ty/--tr` scroll-driven transforms, italic 'relats' wordmark underlay, grid backdrop
- `kanjiMarquee`: 38s linear infinite marquee with 15 kanji glyphs (盃蔵儀円和静道匠侘寂間縁禅器炎), amber gradient mask
- `galleryHorizontalScroll`: GSAP+ScrollTrigger sticky horizontal scroll panels
- `r3fScene`: procedural Three.js scene (icosahedron + post-processing) as React-Three-Fiber-style hero alternative
- `scrollDepth`: parallax layered images, 21st.dev/shadcn aesthetic — KEEP this, user wants more parallax
- `heroBuildSequence`: animated brand-logo build sequence (Three.js)
- `carouselClassic` (new this session): self-contained carousel with auto-advance, dots, prev/next, touch swipe (40px threshold), keyboard arrows, pause on hover/focus, progress bar, prefers-reduced-motion compliant

## 2026-05 — Layout wiring rules

- Each STYLES entry has `layout: ['heroX', 'sectionY', ...]` — first slot is the hero
- Renderers must work standalone (no dependency on sibling section)
- Body sections should read from `c.svc[]` + `c.svcd[]` so they work for both generic + RE variants
- Use `esc()` for any content interpolated into HTML
- All animations respect `prefers-reduced-motion: reduce`
- `extra` per-archetype config can carry: `materials`, `mosaic`, `ritual`, `shelf`, `tiers`, `routes`, `carousel`, `carouselTitle`, `chapters`, etc.

## 2026-05 — User feedback decisions

- "make sure not add parllax scroll as well" → INITIAL READ: remove scrollDepth. CORRECTED by next message: "no i sayd add parallax as well" → KEEP and ADD MORE scrollDepth. Parallax now in 12 of 16 styles pages.
- "we gotta try eveyrhting and see whats best but whatevers not safe we got to find safe way to implement or not impelemnt at all by safe i mean data. security breach etc" → triggered the safety MD
- "also for the reference sites build this as well https://terminal-industries.com/" → added STYLES[15] = 16-terminal-industrial archetype (Space Grotesk + IBM Plex Mono, FF5C00 industrial orange + 1AFF8C status green, NOC-style monospace meta, route grid, full-bleed video hero)

## 2026-05 — Carousel pattern

User asked for carousels without parallax. Reinterpreted as carousels IN ADDITION TO parallax. Standard pattern:
- Track-based (translateX percentage), not stacked-card
- One slide visible at a time (full width)
- Auto-advance 5s, pause on hover/focus
- Progress bar (2px, animates over duration)
- Dots that elongate when active (8px → 32px)
- Touch swipe 40px threshold
- Keyboard arrow nav
- Reads from `ex.carousel` (preferred), falls back to `ex.materials` / `ex.mosaic` / `ex.ritual`, finally to `c.svc[]+c.svcd[]`

Wired carousel into: 01-luxury-dark, 06-soft-editorial, 10-food-beauty-dtc, 13-wellness-botanical, 15-resort-residences, 16-terminal-industrial.

## 2026-05 — Build verification rhythm

After every STYLES/SECTIONS edit:
1. `node build.js` → expect "Generated N pages"
2. Marker grep: `Grep cx-track styles` for carousel, `Grep sd-stage styles` for parallax
3. Stage explicit files (never `git add -A` blind)
4. Conventional commit message
5. Push to `claude/setup-mcp-api-keys-t4GTr` only

## 2026-05 — Four new renderers landed (Babylon / p5 / Theatre / Rapier)

All four are self-contained, CDN-loaded, prefers-reduced-motion compliant, fall back to a static gradient when motion is disabled:

- **babylonHero** — Babylon.js 6 ArcRotateCamera + PBR sphere using CSS `--accent` for albedo. Loaded via `cdn.babylonjs.com/babylon.js`. Wired into archetype 07 SaaS Glass as mid-page showcase.
- **p5Sketch** — p5.js 1.9 flow-field with perlin noise drift. 480 particles, fade-trail via `background(0,0,0,18)`. Loaded via `cdn.jsdelivr.net/npm/p5@1.9.0`. Wired into archetype 14 Cosmic Engine.
- **theatreScene** — Three.js icosahedron driven by a 4-keyframe timeline I authored manually (lieu of Theatre.js Studio runtime — keeps payload thin). Uses Three.js importmap from unpkg. Smoothstep easing between KFs based on section scroll progress. Wired into archetype 04 3D-WebGL.
- **rapierPhysicsHero** — Rapier 0.12 WASM physics + Three.js. Floor + dynamic cubes, "Drop one" button to spawn more (cap 40, GC oldest). Loaded via `cdn.jsdelivr.net/npm/@dimforge/rapier3d-compat@0.12.0/rapier.es.js`. Wired into archetype 12 Experimental Dev.

All registered in SECTIONS. Output verified: bh-canvas / p5-holder / th-canvas / rp-canvas markers present in 4 styles pages (04, 07, 12, 14).

## 2026-05 — Importmap pattern for module-script renderers

`theatreScene` and `rapierPhysicsHero` are ES-module scripts. Each section emits its own `<script type="importmap">` BEFORE the `<script type="module">`. Multiple importmaps per page work in modern Chromium / Firefox / Safari, but each must come BEFORE the first module script that uses its mappings. Since renderers are appended in layout order, this works as long as the importmap-using renderer doesn't precede another module that needs the same import.

## 2026-05 — Carouseling rendering safety

Each carouselClassic IIFE binds via `document.currentScript.closest('.cx-sec')` — guarantees each instance binds to its own section. No global namespace pollution. Same pattern used in all new renderers (`document.getElementById('bh-c')` etc., where ID is unique per renderer-emit). Could collide if same renderer is wired twice in one page — currently not the case, but flagged for future awareness.

## 2026-05 — Pending experiments

- A/B test r3fScene vs babylonHero vs p5Sketch vs theatreScene vs rapierPhysicsHero on reels 01-cartier, 03-guilty-mind, 11-relats-periflex — visit each page in Chrome MCP, screenshot, score on (load weight, visual impact, scroll-feel, motion-reduce fallback quality)
- Higgsfield → first/last WebP frames for BG suite 6-chapter film
- Hunyuan 3D → GLB for archetype 08 cliff-house hero, archetype 15 resort villa
- Open Instagram reels in Chrome MCP, screenshot side-by-side vs our outputs (each archetype vs the IG reel it references)
- Nano Banana / Google Stitch — generate texture maps for Three.js MeshStandardMaterial.map, save to assets/textures/

## 2026-05 — User correction log (CRITICAL)

- "make sure not add parllax scroll as well" → INITIAL READ: remove parallax. CORRECTED IMMEDIATELY by next user message "no i sayd add parallax as well" → KEEP and ADD parallax. **Lesson**: when user message has typos that could swing meaning either direction ("add" vs "not add"), wait one more confirmation before destructive edits. Building MORE is reversible; deleting and re-adding wastes a cycle.
- "use codex or other claude subagents to get done dont use local ai for now" → never delegate to ollama / local-general-worker on this repo until further notice.
- "find ways and get this done make sure the sites are exactly the same as the ones shown in the insta reels" → primary success metric is visual parity with the IG reel each archetype was named after.
- "Never merge to main. Push only to claude/setup-mcp-api-keys-t4GTr" → branch discipline is hard rule.

## 2026-05 — Visual verification (Chrome MCP DOM check)

Ran live verification against `python -m http.server 8765` from repo root over Chrome MCP (no static screenshots — used DOM probes + console error checks since `screenshot` is not a Chrome MCP tool, only `javascript_tool` + `read_console_messages`).

Pages probed and outcome:
- `styles/16-terminal-industrial.html` → title=`TERMINAL — Industrial AI · NOC-25.04`, bg=`rgb(5,5,5)`, --accent=`#FF5C00`, 8 sections, .cx-track present, .sd-stage present, .routes present (3 cards). 0 console errors.
- `styles/04-3d-spline-webgl.html` → `#th-c` + `.th-canvas` + 1 importmap + 1 module + `.sd-stage` all present. theatreScene wired.
- `styles/07-saas-glass.html` → `#bh-c` + `.bh-canvas` + babylon.js script tag present. babylonHero wired.
- `styles/12-experimental-dev.html` → `#rp-c` + `.rp-canvas` + `.rp-drop` button + `.sd-stage` + 1 importmap present. rapierPhysicsHero wired.
- `styles/14-cosmic-platform.html` → `.p5-holder` + p5.js script present. p5Sketch wired (note: holder is .class not #id).

**Selector gotcha logged**: routesGrid uses `.routes` (plural class), NOT `.tg-routes`. theatreScene uses canvas `#th-c` with class `.th-canvas` (id is short form). p5Sketch uses `.p5-holder` div, not an id. When probing always grep build.js for the actual selector emitted — do not assume from renderer name.

**Chrome MCP capability note**: there is no `mcp__Claude_in_Chrome__screenshot` tool. To inspect a built page visually we have: `navigate`, `javascript_tool` (DOM probe via evaluated expression), `read_console_messages`, `read_page`, `get_page_text`, `find` (natural-language element search). Pixel-level comparison requires `mcp__computer-use__screenshot` on the desktop (after `request_access` for Chrome).

**CRITICAL gotcha — verification machine has prefers-reduced-motion:reduce ON**. Every motion-gated renderer (p5Sketch, theatreScene, Rapier physics, scrollDepth GSAP) correctly takes the static-fallback path. So `document.querySelectorAll('canvas')` will NOT count canvases that only mount inside a motion-IIFE. False-positive "missing canvas" reports on this machine. Two fixes:
1. To validate motion on this machine: use Chrome DevTools `Rendering` panel → `Emulate CSS media feature prefers-reduced-motion → no-preference`. JS patch of `matchMedia` does NOT defeat the CSS-level `@media (prefers-reduced-motion: reduce)` rule because CSS evaluates against OS pref directly.
2. To validate motion in code: code-review the IIFE guard + CSS fallback exist and look correct.

Verified motion-gated correctness by code review for: p5Sketch (line 1477), theatreScene (line 1527 CSS), rapierPhysicsHero (line 1604), babylonHero (line 1430), r3fScene (existing). All correctly guard + fall back to static gradient.

## 2026-05 — A/B perf scores (cold load, lab-served via `python -m http.server 8765`)

| Page | Headline renderer | DCL ms | Loaded ms | Scripts | Notes |
|---|---|---|---|---|---|
| 01 luxury-dark | scrollDepth + carouselClassic | 159 | 193 | 5 | Lightest fully-loaded reel page |
| 04 3D-WebGL | r3fScene + theatreScene | 367 | 411 | 8 | **Loads three.min.js + ESM Three twice** (lib.js + importmap) — wasteful |
| 07 SaaS Glass | babylonHero + r3fScene | 346 | 512 | 9 | **Three + Babylon both loaded** — heaviest, intentional showcase |
| 12 Experimental Dev | rapierPhysicsHero | 92 | 102 | 5 | Fastest 3D page — Rapier WASM lazy-loads |
| 14 Cosmic Platform | p5Sketch | 99 | 135 | 5 | Fastest creative-coding page |

**Winners by archetype (preliminary, perf-only)**:
- 01-cartier feel → keep current (scrollDepth + carousel)
- 03-guilty-mind / brutalist → r3fScene (already wired)
- 04 / 07 / 11 → theatreScene wins on weight, babylonHero wins on PBR quality
- 12 experimental → rapierPhysicsHero (uniquely interactive)
- 14 cosmic / generative → p5Sketch (perfect-fit)

**Tech-debt finding**: Three.js loaded twice on pages 04/07. Should consolidate to single import — either drop the global `three.min.js` from lib.js when archetype uses ESM Three, or drop the importmap when global is enough. Tracked as separate task.

## 2026-05 — Browser_batch is mandatory

System reminded after single-call navigate: "Prefer browser_batch — significantly faster." Batched the 4-page renderer audit in one call (5 actions) instead of 8 separate calls. ~5x speedup. Use `browser_batch` whenever ≥2 chained browser actions are predictable.
