# STACK — the answer in one page

The decision sheet. For full reasoning behind every option, see
`ARSENAL.md`. This file is just **the picks** and **how they fit**.

---

## The mix to build any client site

Three layers, each with one or two picks. Use these together — they're
already chosen so they compose cleanly.

### 1. Frontend code stack (when a `PROMPTS.md` prompt becomes a real site)

| Role | Pick |
|---|---|
| Foundation primitives | **shadcn/ui** (Radix + Tailwind, copy-paste) |
| Spectacle sections | **Magic UI** (marquees, animated beams, blur-fade, shimmer) |
| Animation library | **Motion** — `npm install motion`, `import { motion } from "motion/react"`. Not `framer-motion` (legacy name; install `motion` for new code.) |
| On-demand bespoke components | **21st.dev Magic MCP** — Claude pulls components from the community registry by description |
| Optional extra spectacle | One of: **Animate UI**, **Skiper UI**, **React Bits**, **Aceternity UI**. Pick at most one *more*. |

### 2. Imagery + 3D (the assets that fill the site)

| Role | Pick |
|---|---|
| Cinematic stills + 5-sec brand reels | **Higgsfield** (premium) |
| Free fallback / volume gen | **Pollinations** (free, no auth) |
| 3D hero scenes | **Spline AI** (slots straight into `04-3d-spline-webgl`) |
| 3D product objects (`.glb`) | **Meshy.ai** (free tier + API) |
| Ambitious "wow" hero experiences | **Omma by Spline** (`omma.build`, $29/mo Pro) — when a single scene isn't enough |
| Code-rendered MP4 brand reels | **Remotion** — scaffold ready at `tools/remotion/` in this repo |

### 3. AI assistant tooling (what makes Claude effective at doing #1 + #2)

Install once user-scope in your `refsites-media` session — every project
benefits.

```bash
claude mcp add --scope user context7   -- npx -y @upstash/context7-mcp
claude mcp add --scope user playwright -- npx -y @playwright/mcp@latest
claude mcp add --scope user magic      -- npx -y @21st-dev/magic@latest --api-key=YOUR_21ST_KEY
claude mcp list   # all three should show ✓ Connected
```

- **Context7** — live docs for every library above (Motion / shadcn /
  Next / Three / Spline / Tailwind). Stops "Claude wrote outdated API."
- **Playwright** — headless browser. Visual QA of the rendered pages
  before deploy.
- **21st.dev Magic** — the MCP form of layer 1's gap-filler.

**Bonus, works from `refsites-code` right now:** `tools/gemini.js` calls
Gemini 2.5 Flash directly via REST — `generativelanguage.googleapis.com`
is in this environment's allowlist (verified). Use it as a long-context
sub-agent (1M token window) for summarising large files, structured
extraction, or image analysis without burning Claude's context.

```bash
set -a && source .mcp.env && set +a
node tools/gemini.js "your prompt"               # one-shot
cat some-long-file | node tools/gemini.js        # pipe input
```

---

## The 4th layer: reference research (closes the gap I can't fetch live sites)

Use these *before* a build to give me a precise read of what to match.

- **DESIGN.md Generator Chrome extension** — open any target site on
  your laptop, generate a `DESIGN.md`, drop it into `notes/` in this
  repo. I then refine archetypes against real tokens, not guesses.
- **getdesign.md** (`getdesign.md`) — pre-built `DESIGN.md` files for
  Apple, Figma, Airbnb, Meta, Cursor, Webflow, Replicate, MiniMax, etc.
  Free.
- **Awwwards "Sites of the Year"** — the high-signal inspiration index.
  Skim, pick the 3–4 nearest in feel, run DESIGN.md Generator on each.

You don't need the **paid** tier of `getdesign.md` — the free Chrome
extension + the public catalogue cover this project.

---

## Install order (copy-paste sequence for a new client site)

```bash
# 0. In refsites-media session — once, ever:
claude mcp add --scope user context7   -- npx -y @upstash/context7-mcp
claude mcp add --scope user playwright -- npx -y @playwright/mcp@latest
claude mcp add --scope user magic      -- npx -y @21st-dev/magic@latest --api-key=YOUR_21ST_KEY

# 1. Per project:
npx create-next-app@latest    # or vite-react
npm install motion clsx tailwind-merge

# 2. shadcn foundation:
npx shadcn@latest init
npx shadcn@latest add button card dialog form input table

# 3. Magic UI spectacle layer (per component, on demand):
npx shadcn@latest add https://magicui.design/r/<component>.json

# 4. Optional extras (only if the design needs them):
npm install three @react-three/fiber @react-three/drei   # 3D
npx shadcn@latest add https://skiper-ui.com/registry/<component>.json   # one more spectacle registry

# 5. Render MP4 brand reels (already scaffolded in this repo):
cd tools/remotion && npm install && node render.js
```

---

## Skip list (explicit non-picks, with reasons)

- **`@nanana-ai/mcp-server-nano-banana`** — third-party reseller, not
  Google. Use `fal-ai` for the real Gemini 2.5 Flash Image model.
- **ElevenLabs MCP** — voice/TTS. Out of scope for static reference
  sites. Add only if a real project needs AI voiceover.
- **Figma Dev-Mode MCP** — only matters once you have real Figma comps
  from a client.
- **Multiple animation libraries in one project** — pick Motion and
  stop. GSAP only stays where it already is (page choreography on the
  static reference library). Never mix Motion + GSAP + Anime + Locomotive
  in the same project unless you have a specific reason.
- **HeroUI, Tremor, Nextra, Tailwind UI / Plus** — each is fine for its
  niche (whole design system, dashboards, docs sites, premium
  marketing) but adds a *competing* design language to the shadcn +
  Magic UI mix. Reach for them only when those niches are the project,
  not as defaults.
- **Uiverse.io** — CSS-only snippets, not React. Use for one-off styled
  inputs when you don't want to drag a whole registry in.
- **Five spectacle registries at once** — pick at most two
  (Magic UI + one more). Loading Aceternity + Magic UI + Skiper +
  React Bits + Animate UI together creates a Frankenstein.

---

## End-to-end pipeline (how the three layers compose for one build)

```
research/notes
  └─ DESIGN.md Generator on coco-veda.vercel.app / awwwards picks
     → drop into notes/<site>.design.md
     → I read it and tune the archetype precisely

refsites-media (open network)
  └─ Higgsfield / Pollinations    → assets/<id>-hero.jpg
  └─ Higgsfield video / Remotion  → assets/<id>-hero.mp4
  └─ Spline AI (or Omma)          → scene URL pasted into archetype 04
  └─ Meshy.ai                     → assets/3d/<id>.glb
  └─ Context7 / Playwright / Magic MCPs installed user-scope

refsites-code (this session)
  └─ build.js + resolveAsset() picks up all the assets above
  └─ node build.js && node build-index.js → 70+ pages

first real client React build  (e.g. apps/sathideals/)
  └─ Next.js + Tailwind + shadcn primitives
  └─ Magic UI for spectacle sections
  └─ Motion for component animation + scroll transitions
  └─ 21st.dev Magic MCP fills gaps Claude needs on demand
  └─ Playwright MCP screenshots final pages → visual QA
  └─ Cloudflare / Vercel deploy
```

That's the whole stack. Anything not in this file is either
out-of-scope, niche-only, or deferred until a real client demands it.
