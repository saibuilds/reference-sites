# Project handoff — reference-sites

Paste the prompt at the bottom into a fresh Claude session (Cowork / Code /
browser) that has **network access + generation credentials**. This file is
the full context so the new session can continue without this chat.

## ⮕ CURRENT FINISH LINE (read this first)

State as of this update: **16 archetypes, 72 pages, deployed and green on
Cloudflare.** Almost everything is done. What remains can ONLY be done in
a session/computer with outbound network (the `refsites-code` cloud
session has its egress allowlist blocking every image host — verified
exhaustively: Higgsfield, fal, Replicate, Pollinations, Hunyuan all
`403 Host not in allowlist`; Gemini image models are reachable but the
key is on a free plan → `429 / Imagen paid-only`).

**The one remaining gap:** `assets/16-terminal-industrial-hero.jpg` does
not exist — it's the only archetype of 16 without a real hero raster
(it currently falls back to its SVG). Its `GEN_PROMPT` is already wired
in `build.js`.

**To finish, on your computer or the media chat (which has Pollinations
working):**

```bash
git pull
node tools/gen-heroes.js          # generates ONLY missing heroes (skips the 15 that exist)
                                  # → writes assets/16-terminal-industrial-hero.jpg via Pollinations
node build.js && node build-index.js
git add assets/16-terminal-industrial-hero.jpg styles* reels* index.html manifest.json
git commit -m "Add 16-terminal-industrial hero" && git push
```

That closes the project. Optional next-phase extras (only if wanted):
- Higher-quality re-gen of all heroes via Imagen 4 — requires enabling
  billing on the `GEMINI_API_KEY` (then `generativelanguage.googleapis.com`
  image models work; pipeline already proven from `refsites-code`).
- Brand-reel MP4s via `tools/remotion/` (`cd tools/remotion && npm install
  && node render.js`).
- Real React client builds per `STACK.md` (shadcn + Magic UI + Motion).

---


## What this project is

A generator for a **reference-site library**. `node build.js` emits **70
static pages** (15 design archetypes × generic + real-estate variants, plus
20 brand "reels" that reuse those archetypes). `node build-index.js` builds
`index.html` (the gallery). Cloudflare Workers Builds auto-deploys on push.

- Repo: `saibuilds/reference-sites`
- Working branch: `claude/setup-mcp-api-keys-t4GTr` (HEAD `1e946a4`, 14
  commits ahead of `main`; open draft PR **#5**)
- Live branch preview (latest): `https://claude-setup-mcp-api-keys-t4gtr-reference-sites.rajsharma2234567.workers.dev`
- Production = `main` (behind; merge PR #5 to promote)

## Architecture (everything is in `build.js`, ~800 lines)

- `STYLES[]` — the 15 archetypes: `id, name, refs, vars{--bg/--surface/
  --fg/--accent/--card/--card-bd}, disp, body, light, threeD, layout[],
  extra{}, g{}, re{}`. `g` = generic brand content, `re` = real-estate
  variant. `extra` = shared texture content (mosaic/ritual/journal/tiers…).
- `MOTIF{}` — per-archetype art motif key.
- `GEN_PROMPT{}` — the exact image prompt per archetype (use these for
  real image generation).
- `SECTIONS{}` — ~50 bespoke section renderers; `layout[]` lists section
  keys in order. Reuse these; only add a renderer if a layout truly needs
  a new one.
- `artSVG()` — deterministic procedural SVG art engine (cinematic: base
  gradient + atmosphere + per-motif subject + light-leak + vignette +
  grain). Output is the fallback hero art.
- `resolveAsset(s)` — **auto-prefers a real raster** at
  `assets/<id>-hero.{jpg,png,webp}`; else uses `assets/<id>.svg`. So real
  imagery needs **no code change** — just drop the files in and rebuild.
- Other: `build-index.js`, `shared/lib.css`, `shared/lib.js`,
  `manifest.json`, `PROMPTS.md` (per-archetype copy-paste build prompts),
  `NETWORK.md` (the network blocker + fixes), `MCP-SETUP.md`,
  `wrangler.jsonc` (Cloudflare static-assets binding).

Conventions: never hotlink external media (0 hotlinks library-wide);
SVGs must be `xmllint`-clean; `artSVG` must stay deterministic (stable
rebuilds). Build with `node build.js && node build-index.js`, verify, then
commit + push to the working branch and open/refresh a PR.

## The blocker this chat could NOT solve (environment, not code)

This chat ran in a sandbox whose **network egress allowlist blocks every
external host**. Verified repeatedly — all return HTTP 403
`Host not in allowlist`:

- Image/video MCPs: `platform.higgsfield.ai`, `mcp.fal.ai`,
  `api.replicate.com`, `nanana.app` (the MCP tools connect but every
  generate call 403s; higgsfield creds also arrive unexpanded as the
  literal `${HIGGSFIELD_API_KEY}`).
- Reference sources: `coco-veda.vercel.app`, `instagram.com`,
  `drive.google.com`, `youtube.com`.

Only `registry.npmjs.org`, `github.com`, and `www.googleapis.com` are
reachable. There is **no browser/Playwright tool** here, and "Claude for
Chrome" runs on the user's own machine, not in this sandbox. Hence the
library ships with owned procedural art and reference sites are built
from research, not DOM scrapes. `.mcp.json` env-var names were fixed
(higgsfield reads `HF_API_KEY`/`HF_SECRET`; nano-banana reads
`NANANA_API_TOKEN`, not a Gemini key).

## What the new (Cowork) environment must have

1. **Network**: outbound allowed (or allowlist `platform.higgsfield.ai`,
   `*.fal.ai`, `fal.run`, `api.replicate.com`, `nanana.app`,
   `coco-veda.vercel.app`, `*.instagram.com`).
2. **Credentials** in Settings → Environment: `HIGGSFIELD_API_KEY`,
   `HIGGSFIELD_API_SECRET` (and `FAL_KEY` for Seedance via fal). Values
   are in the gitignored local `.mcp.env`; the user must set them in the
   environment UI.
3. Fresh session after the above (MCP servers read env at launch).

## Tasks for the new session (in order)

1. **Confirm access**: `curl -s -o /dev/null -w '%{http_code}'
   https://platform.higgsfield.ai` → expect not-403. Check
   `mcp__higgsfield__debug_credentials` shows real key (not
   `${HIGGSF...}`).
2. **Generate real hero art** for all 15 archetypes: for each `id`, call
   the higgsfield (or fal/Seedance) image tool with `GEN_PROMPT[id]` from
   `build.js`; save the result to `assets/<id>-hero.jpg`. Then
   `node build.js && node build-index.js` — every page auto-switches to
   real imagery via `resolveAsset`.
3. **Coco Veda fidelity**: open `https://coco-veda.vercel.app/`, study its
   structure/palette/type, and refine archetype **13 `wellness-botanical`**
   to match the real site's layout and feel (faithful original using the
   existing section system — not a verbatim clone).
4. **Instagram reels / new businesses**: for any reels or briefs the user
   provides, build new archetypes the same way (palette+fonts+layout in
   `STYLES`, motif in `MOTIF`, prompt in `GEN_PROMPT`, generic + `re`
   variants), or output filled prompts from `PROMPTS.md`.
5. Verify (70+ pages, SVGs valid, 0 hotlinks, deterministic), commit, push
   to `claude/setup-mcp-api-keys-t4GTr`, refresh PR #5; merge to `main`
   only with explicit user approval.

## State / decisions already made

- 15 archetypes; #13 Coco Veda (strengthened: impact stats + shoppable
  range), #14 Starry Labs (cosmic), #15 AMARA Resort & Residences
  (reworked light/soft after feedback it was too dark).
- Do **not** homogenize all archetypes into one look — diversity is the
  point. The real cross-cutting fix already applied: cinematic `artSVG`
  so photo heroes aren't flat placeholders.
- `PROMPTS.md` = the reusable engine for spinning sites for real
  businesses (swap PROJECT/AUDIENCE/GOAL + copy, keep BRAND/SECTIONS/
  ANIMATION).
- Key rotation declined by user; keys treated as compromised regardless.

---

## COPY-PASTE PROMPT FOR THE NEW SESSION

> You are continuing the `saibuilds/reference-sites` project. First read
> `HANDOFF.md`, `NETWORK.md`, `PROMPTS.md`, and `build.js` in the repo on
> branch `claude/setup-mcp-api-keys-t4GTr`. This is a generator that emits
> 70 static reference-site pages from `build.js` (15 archetypes × generic
> + real-estate, 20 reels). Your environment should have network access
> and Higgsfield/fal credentials — verify first by curling
> `https://platform.higgsfield.ai` and checking
> `mcp__higgsfield__debug_credentials`. Then: (1) generate a real hero
> image for every archetype using `GEN_PROMPT[id]` from `build.js`, save
> each as `assets/<id>-hero.jpg`, and run `node build.js && node
> build-index.js` so `resolveAsset` swaps them in automatically; (2) open
> `https://coco-veda.vercel.app/` and refine archetype
> `13-wellness-botanical` to faithfully match its real layout/palette/type
> using the existing section system (original, not a verbatim clone); (3)
> build any new reference sites the user asks for the same way (extend
> `STYLES`/`MOTIF`/`GEN_PROMPT`, generic + `re` variants). Keep 0 external
> hotlinks, SVGs xmllint-clean, `artSVG` deterministic. Commit and push to
> `claude/setup-mcp-api-keys-t4GTr`, refresh PR #5, and only merge to
> `main` with explicit approval. Report what generated vs. what's still
> blocked.
