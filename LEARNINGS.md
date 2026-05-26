# LEARNINGS — Reference Sites build system

A portable handoff doc so any Claude on any machine can resume this work
from the GitHub URL alone. Read this **before** editing `build.js`,
`shared/lib.css`, `shared/lib.js`, or any generated page.

Repo: <https://github.com/saibuilds/reference-sites>
Branch: `main`
Key commits at write-time:
- `36e560a` — 18-issue Claude-browser fix pass (this doc's primary subject)
- `ab918f5` — Upstream merge adding archetypes 13–16 (wellness / cosmic / resort / terminal)
- `f2e9f47` — This LEARNINGS.md

**Repo also has companion docs** worth reading after this one:
`README.md`, `HANDOFF.md`, `STACK.md`, `ARSENAL.md`, `NETWORK.md`,
`MCP-SETUP.md`, `PROMPTS.md`. They describe the wider AI-website-builder
context this generator plugs into. LEARNINGS.md (this file) is
specifically the handoff for the 18-issue fix pass and the generator
template.

---

## 0. What this repo is

A generator that emits **72 self-contained reference websites** — 16
style archetypes + 20 reel-specific builds, each in a generic and a
real-estate variant (16×2 + 20×2 = 72). Zero frameworks. GSAP 3.12.5
+ Lenis 1.0.42 + Three.js r128 via CDN. Used as the design reference
set the AI website builder targets when building animated sites for
any business.

> **Historical note + post-merge reality check:** The 18-issue
> Claude-browser fix pass (commit `36e560a`) was authored against a
> 12-archetype / 64-page snapshot of the OLD generator. The upstream
> merge (`ab918f5`) replaced that generator with a v2 "bespoke
> per-archetype layouts, no demo chrome" build (16 archetypes, 72
> pages, `page()` now at ~line 1893 of build.js). What survived the
> merge into the v2 output:
>
> | Fix-pass feature | v2 coverage | Status |
> |---|---|---|
> | Custom cursor `#cur` / `#cur2` | 16/16 | ✓ universal |
> | Preloader `#loader` | 16/16 | ✓ universal |
> | Cinematic `<video>` | style 02 | ✓ |
> | Architecture `proj-list` | style 08 | ✓ |
> | Aviation `#clock` / ticker | style 09 | ✓ |
> | Brutalist `body.brutal` | style 03 | ✓ |
> | Soft-editorial `body.light` (also style 15) | styles 06, 15 | ✓ |
> | Cinematic-style hero on style 16 (terminal) | 16 | ✓ `<video>` |
> | WhatsApp `.wa-fab` markup | 0/16 | ✗ dropped by v2 |
> | Vaporwave `.ripple-wrap` concentric rings | 0/16 | ✗ v2 vaporwave is bespoke |
> | Film grain `body::after` | global via lib.css | ✓ (CSS lives, applies to all) |
>
> **Action for next session:** if WhatsApp FAB and vaporwave rings
> are still wanted, add them inside the v2 `page()` function at the
> top of build.js (line ~1893) — the body injection point moved.
> Section 7 of this doc indexes the OLD generator; for the v2 layout
> read `HANDOFF.md` and search `build.js` for `function page`.

Source of truth for design intent: `../02-REEL-FINDINGS.md` (a 700-line
distillation of the larger
`C:\Users\Admin\Downloads\web automation claude broser to learn rom etc.txt`
which is mostly video-editing workflow). Reel-video URLs live in
`../00-REEL-LINKS.md`.

---

## 1. Architecture — read in this order

1. **`build.js`** — single generator. Holds two tables:
   - `STYLES` — 16 archetypes (01 luxury-dark → 16 terminal-industrial).
     Each has `id, name, refs, vars` (CSS
     custom properties), `disp, body` (font pair), and **boolean
     flags** that drive the page template: `threeD, vanta, light,
     brutal, editorial, ripple, clock, video, heroImg, heroVideo,
     projImgs`.
   - `REELS` — 20 reel-specific builds, each pointing to a `style` id
     via `styleObj(r.style)` so it inherits the style's flags.

   The `page(opts)` function destructures these flags and returns one
   complete HTML document. It also injects shared body chrome
   (`loader`, `cursor`, `fab`, `previewImg`) and a hero block whose
   visual is chosen by a single ternary: `ripple → threeD → (video &&
   heroVideo) → heroImg → gradient`. Every hero has a real visual.

2. **`shared/lib.css`** — every visual primitive used by the
   template. Section order in the file:
   - Base tokens / typography
   - Nav, sitenav switcher, ribbon
   - Hero / wrap / marquee / cards / stats / lists / footer
   - Cursor (`#cur`, `#cur2`, `#cur.hot`) — fine-pointer only
   - Film grain (`body::after` + `@keyframes grain`)
   - Loader (`#loader`, `.lLogo`, `.lTrack`, `.lBar`, `.go`, `.done`)
   - WhatsApp FAB (`.wa-fab`)
   - Hero visuals (`.media`, `.scrim`, `.orb`, `.ripple-wrap` + `.ring
     r1..r5`, `@keyframes rippleOut`)
   - Aviation meta (`.av-clock`, `.av-ticker`, `.av-ticker-wrap`)
   - Architecture project preview (`#preview-img`, `.proj-list`, `.proj-row`)
   - Style corrections (`body.brutal`, `body.light`)
   - `@media (prefers-reduced-motion: reduce)` — final block, kills grain + loader

3. **`shared/lib.js`** — single IIFE, `'use strict'`. `reduce` =
   prefers-reduced-motion guard at the top. Order:
   - Lenis smooth scroll wired to GSAP ticker
   - Vanta backgrounds (if `data-vanta` on body)
   - 3D wireframe orb (`#bg3d` canvas, Three.js)
   - Magnetic buttons, 3D tilt cards
   - **Fail-safe reveal + count-to** — multi-trigger (IO + scroll +
     resize + load + sweep + rAF poll, `inView()` returns true when
     viewport is unknown). DO NOT regress this — Claude-browser runs
     in a 0-viewport webview and will report everything as broken if
     this guard is removed.
   - Marquee, scroll-progress bar, nav.scrolled (sticky shrink)
   - **CLAUDE-BROWSER FIX PASS** block at the bottom:
     - Custom cursor (dot + rAF-lerped ring, fine-pointer only, `.hot`
       on interactive hover)
     - rAF preloader (1250ms minimum, then `.done` + gsap slide-up +
       removeChild; falls back to setTimeout if no gsap)
     - Aviation `#clock` (1s interval, `toLocaleTimeString HH:MM`) +
       `#ticker` rotation (2600ms)
     - Architecture `#preview-img` cursor-following (rAF lerp, `.show`
       class, centered transform)

---

## 2. The 18-issue Claude-browser fix pass (commit `36e560a`)

The user's Claude-in-browser ran every page and dumped an 18-issue
diagnosis into the txt at line 11619 ("# Complete Analysis: What's
Wrong & What to Fix"). What was real vs. false-negative:

### Real gaps (now fixed, all routed through the 3 shared files)

| # | Issue | Fix location |
|---|---|---|
| 1 | No images anywhere | `heroBg` ternary, `heroImg` field on STYLES 02 & 08 |
| 2 | Sidewave missing concentric rings | `.ripple-wrap` + 5 `.ring` (CSS) + `ripple:true` on style 05 |
| 3 | No custom cursor | `#cur` / `#cur2` injected by template, JS rAF lerp |
| 4 | No preloader | `#loader` injected, JS rAF self-removes after 1250ms |
| 5 | No WhatsApp button | `.wa-fab` injected on every page |
| 6 | Film grain missing | `body::after` + `@keyframes grain` (always on, unless reduce) |
| 8 | Cinematic hero has no video | `heroVideo` + `video:true` on style 02, `<video autoplay muted loop>` branch in heroBg |
| 10 | Architecture missing cursor-following preview | `projImgs` on style 08, `.proj-list` section + rAF preview JS |
| 12 | Aviation missing clock + ticker | `clock:true` on style 09, `heroClock` block in template, JS sets time + rotates destinations |
| 13 | Brutalist not brutal enough | `body.brutal` overrides: `border-radius:0`, `transition:none`, `clamp(60px,14vw,200px)` h1 |
| 14 | Soft Editorial wrong (must be cream) | `body.light` applied via `bodyCls`; tokens were already correct (`#FAF0EB` / `#2C1810`) |

### False negatives (the system worked, the viewport didn't)

Issues 15–18 (no animated counter, no GSAP stagger reveals, no sticky
nav shrink, magnetic JS missing) were caused by Claude-browser running
in a 0-viewport webview. The fail-safe reveal/counter system already
fires under that condition — confirmed at runtime on every test page
(14/14 reveals revealed, counters animated `190 / 4h / 24/7`,
`nav.scrolled` toggles on scroll, magnetic JS at `lib.js` lines ~94–100).
**Do not "fix" these by adding new code — the guard is the fix.**

### Issues left as intentionally not-overridden

7, 11 — "all CTAs same pill" and "identical section structure" — the
template intentionally shares chrome across all 64 builds; per-style
divergence happens through the flag-driven hero, body classes, and
section gates (`projImgs`, `clock`, `ripple`). Closing these further
would mean per-style HTML templates, which fights the generator model.

---

## 3. Hard constraints (do not break these)

- **Additive edits only.** Never rewrite `lib.css` / `lib.js` /
  `build.js` wholesale. Every prior session has held this line; the
  fail-safe reveal in particular is the result of multiple iterations
  and the user has lost work to rewrites before.
- **The fail-safe reveal must keep working under a 0-size viewport.**
  Multi-trigger (IO + scroll + resize + load + sweep + rAF poll). If
  `innerWidth` or `innerHeight` is 0, `inView()` returns `true`.
- **No new dependencies** without asking. GSAP, Lenis, Three.js,
  Vanta only — all via CDN.
- **Hotlinked images must use `referrerpolicy="no-referrer"`** (Unsplash
  CDN; Coverr for the cinematic MP4).
- **Reduced-motion respect.** Anything timer-driven (loader, grain,
  cursor ring, ticker) checks `reduce` and is disabled or removed.
- **`prefers-reduced-motion: reduce` block stays last in lib.css.**
  Final media query overrides everything above it.
- **Windows CRLF warnings on `git add` are expected.** Not a failure.

---

## 4. Local dev — how to run the QA preview

Server config lives in `C:\Users\Admin\Desktop\.claude\launch.json`
under name **"Reference Sites QA"** (python `http.server`, port
**4178**). From this machine, via the Claude Preview MCP:

```
preview_start({ name: "Reference Sites QA" })   // returns serverId
preview_eval({ serverId, expression: "..." })   // runtime checks
```

Gallery entry point: <http://localhost:4178/index.html>
Each page also has a fixed bottom switcher: **← Prev · Gallery · N/64 · Next →**.

From another machine, just clone the repo and serve the root with any
static server — there is no build step required to *view* the pages
(`build.js` is only needed to regenerate them after a spec change).

```
git clone https://github.com/saibuilds/reference-sites
cd reference-sites
python -m http.server 4178
```

---

## 5. Regeneration workflow

After any edit to `build.js`, the STYLES/REELS tables, or any field
that's interpolated into the template:

```
node build.js          # emits 64 pages + manifest.json
node build-index.js    # rebuilds gallery index.html from manifest.json
```

Verify with `preview_eval` (see Section 6) before committing.

---

## 6. Verification checklist (runtime, not just file-grep)

Pages to spot-check after any non-trivial change. Expected runtime
state via `preview_eval`:

| Page | Expect |
|---|---|
| `styles/05-vaporwave.html` | `.ripple-wrap .ring` = 5, `#cur` + `#cur2` present, `#loader` removed after ~1.5s, `.wa-fab` present, `[data-reveal]` all revealed |
| `styles/09-aviation-luxury.html` | `#clock` matches `/^\d{2}:\d{2}$/`, `#ticker` rotates, `[data-count]` animated to non-zero values |
| `styles/03-dark-brutalist.html` | `body.className === 'brutal'`, `.card` computed `border-radius: 0px`, `transition-duration: 0s` |
| `styles/06-soft-editorial.html` | `body.className === 'light'`, body bg `rgb(250,240,235)`, color `rgb(44,24,16)` |
| `styles/02-cinematic-video.html` | `video.media` present, autoplay+muted+loop, poster set |
| `styles/08-architecture-editorial.html` | `.proj-list` + `[data-img]` rows present, `#preview-img` follows cursor on hover |

Also confirm **zero JS errors** in the page (`window.__err === null`)
and **14/14 `[data-reveal]` elements revealed** on every page — the
fail-safe.

---

## 7. Where each fix lives — quick file index

```
build.js
  ~L35   STYLES table  (id, vars, fonts, flags, copy)
  ~L250  REELS table   (n, site, style, tech)
  ~L256  page(opts) function
  ~L261  destructure of flags
  ~L265  heroBg ternary  (ripple / threeD / video / heroImg / gradient)
  ~L287  bodyCls, waNum, fab, cursor, loader, previewImg, heroClock
  ~L345  <body> with bodyCls + injected chrome
  ~L355  hero section (heroBg + ribbon + h1 + CTAs + heroClock)
  ~L400  projImgs-gated architecture project list
  ~L452  STYLES.forEach → common object (all flags passed through)
  ~L467  REELS.forEach  → common object (all flags passed through)

shared/lib.css
  ~L129  #cur / #cur2 / .hot
  ~L143  body::after grain + @keyframes
  ~L156  #loader / .lBar / .go / .done
  ~L166  .wa-fab
  ~L173  .hero .orb / .media / .scrim
  ~L187  .ripple-wrap / .ring r1..r5 / @keyframes rippleOut
  ~L200  .av-meta / .av-clock / .av-ticker
  ~L205  #preview-img / .proj-list / .proj-row
  ~L210  body.brutal / body.light overrides
  ~L218  prefers-reduced-motion: reduce  (LAST — keep it last)

shared/lib.js
   L1    'use strict' IIFE start, reduce guard
   ~L10  Lenis + GSAP ticker
   ~L40  reveal multi-trigger (THE fail-safe — do not touch lightly)
   ~L80  count-to multi-trigger
   ~L94  magnetic buttons
   ~L100 3D tilt cards
   ~L140 marquee, scroll-progress, nav.scrolled
   ~L180 CLAUDE-BROWSER FIX PASS block (cursor → loader → clock/ticker → preview-img)
   end   })();
```

(Line numbers approximate — use Grep, do not trust offsets across edits.)

---

## 8. Open follow-ups (not done yet)

- The reel-specific builds (`reels/*`, `reels-realestate/*`) inherit
  their parent style's flags. If any individual reel needs a *different*
  visual treatment than its style (e.g. a reel that wants ripple even
  though its style is cinematic), the REELS row would need its own
  per-row flag overrides — currently the `common` object reads only
  from the style. Add per-reel overrides to `REELS.forEach` if/when
  the reels diverge.
- The cinematic MP4 (`cdn.coverr.co/...cargo-ship-1080p.mp4`) is a
  reasonable stand-in for logistics; if the brand context shifts,
  swap `heroVideo` on style 02.
- `heroImg` URLs use Unsplash CDN with `?w=1920`. Architecture
  `projImgs` use `?w=900`. If Unsplash changes their hotlink policy,
  these will need to be self-hosted.
- Style 04 (`3d-spline-webgl`) already uses Three.js wireframe orb via
  `threeD:true`. Claude-browser's issue 9 ("no 3D") was a false
  negative — `canvasCount` returned 0 because the canvas hadn't
  initialized in the 0-viewport webview. Confirmed via direct eval
  that `document.querySelector('#bg3d')` exists and the renderer
  starts when the page has dimensions.

---

## 9. Why this matters

The user is building an AI website builder that targets these 64
reference sites as its design vocabulary. Every gap between "what the
reel shows" and "what the builder outputs" widens that vocabulary.
This repo is the rubric. Keep the rubric accurate.
