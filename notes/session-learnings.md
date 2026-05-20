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

## Pending experiments

- A/B test r3fScene vs babylonHero vs p5Sketch on reels 01-cartier, 03-guilty-mind, 11-relats-periflex
- Add theatreScene renderer (Theatre.js keyframe Three.js)
- Add rapierPhysicsHero renderer (Rapier WASM physics + Three.js)
- Higgsfield → first/last WebP frames for BG suite 6-chapter film
- Hunyuan 3D → GLB for archetype 08 cliff-house hero
