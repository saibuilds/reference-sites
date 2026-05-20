# Overnight Build Queue

Each top-level checkbox is one autonomous work cycle. Work the queue **in order**, mark `[x]` when done. Each cycle ends with `node build.js && git add -A && git commit -m "..." && git push`.

## Cycle goal
Drive every reference-site page to **visual identity** with its Instagram-reel source and `coco-veda.vercel.app`. All 3D/animations/copy/palette must match the video. No demo placeholders.

## Pending

### Hero renderers (build.js)
- [ ] **heroSpline** — Spline 3D viewer hero for archetype `04-3d-spline-webgl`. Use `<spline-viewer url="https://prod.spline.design/{sceneId}/scene.splinecode">` with a curated public scene; fall back to canvas globe if scene URL not set. Per `notes/reel-techniques.json` reel 04, libraries are `gsap 3.12.2`, `three r134`, `@splinetool/viewer 1.0.0`.
- [ ] **heroThreeGlobe** — Three.js r134 cosmic globe for archetype `14-cosmic-platform`. Particle ring + slow orbit. Pin during scroll via ScrollTrigger.
- [ ] **heroVanta** — Vanta WAVES bg for archetype `05-vaporwave` (lavender→cyan gradient over moving wave plane). Init via `VANTA.WAVES({el,color:0x9e8cff,...})`.
- [ ] **heroVideoGSAP** — `<video>` autoplay muted loop + GSAP SplitText title for `02-cinematic-video`. Currently uses generic hero.
- [ ] **galleryHorizontalScroll** — `ScrollTrigger.scrollerProxy` horizontal pinned panel section, register for archetypes `01,03,06,08,12,15`.

### Site builds
- [ ] **BG (garden suites) reference site** at `bg/index.html`. 5 pages: hero, suite catalogue, ROI calculator, financing flow, contact. Use archetype 13 cinematic film hero re-skinned amber→sage green. Hero copy "A suite. / In your backyard." Use Higgsfield Kling-generated suite stills (or pollinations.ai fallback) for 5 chapters: site visit, foundation, frame, finishes, keys.
- [ ] **SathiDeals reference site** at `sathideals/index.html`. 4 pages: hero, marketplace grid, deal-of-the-day timer, agent profiles. Use archetype 15 resort layout but indigo/saffron palette. Hero copy "Toronto real estate, / actually understood." Pull existing IDX feed if reachable; otherwise mock 12 listings.

### Per-archetype reel parity
For each `STYLES[i].id` in `build.js`, the rendered page MUST visually match its associated entry in `notes/reel-techniques.json`. Run codex/gemini subagent to diff and patch:
- [ ] 01-luxury-dark — verify Spline watch hero (depends on heroSpline above)
- [ ] 02-cinematic-video — swap to heroVideoGSAP
- [ ] 03-dark-brutalist — verify SplitText scramble + heavy grunge texture
- [ ] 04-3d-spline-webgl — wire heroSpline
- [ ] 05-vaporwave — wire heroVanta
- [ ] 06-soft-editorial — verify pastel marquee + horizontal scroll body
- [ ] 07-saas-glass — verify mesh gradient + 3D device tilt
- [ ] 08-architecture-editorial — verify italic overlay + horizontal scroll
- [ ] 09-aviation-luxury — verify clock + ticker (already present)
- [ ] 10-food-beauty-dtc — verify product orbit
- [ ] 11-japanese-web3 — verify amber gradient + kanji marquee
- [ ] 12-experimental-dev — verify code-rain canvas
- [ ] 13-wellness-botanical — DONE (coco-veda film)
- [ ] 14-cosmic-platform — wire heroThreeGlobe
- [ ] 15-resort-residences — verify horizontal scroll + cinemagraph

## Rules
- Never merge to `main`. Push only to `claude/setup-mcp-api-keys-t4GTr`.
- 0 external hotlinks for media. All assets local in `assets/` or generated via `artSVG`.
- SVGs must pass `xmllint --noout`.
- Each commit: stage explicit files (never `git add -A` without review), conventional commit msg, push, wait for Cloudflare Pages deploy URL in PR comment before next cycle.
- If a cycle fails: log the failure under `## Blocked`, move on to next item.

## Blocked
(append here)

## Done
(move completed items here with commit SHA)
