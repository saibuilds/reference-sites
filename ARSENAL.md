# Arsenal & Sessions — reference-sites project

Last updated by the code session; status is empirical (tested), not guessed.

---

## 1. Name your sessions by role

Spin up (or relabel) **three** Claude sessions, each in an environment
sized to its job. Don't share — each one's strength is its env policy.

| # | Suggested name | Job | Env it needs |
|---|---|---|---|
| 1 | **`refsites-code`** | Source of truth. Edits `build.js`, archetypes, layout, copy, prompts, PRs, merges. | Default Code on the web. Network is locked-down (only npm + GitHub + googleapis). That's *fine* for code; it's a feature, not a bug. |
| 2 | **`refsites-media`** | Generates all imagery + video (Higgsfield, Flux, Seedance, Pollinations). Commits `assets/<id>-hero.jpg` / `.mp4` back to the same branch. | Web env with **outbound network** allowed (or allowlist `image.pollinations.ai`, `*.fal.ai`, `platform.higgsfield.ai`) + `HIGGSFIELD_API_KEY`/`HIGGSFIELD_API_SECRET` + `FAL_KEY` in **Settings → Environment**. |
| 3 | **`refsites-research`** | Pulls actual brand sites (e.g. `coco-veda.vercel.app`), reads Instagram reels via Claude-for-Chrome, screenshots references. | Run **Claude for Chrome** on your laptop with your logged-in browser; OR a web env that allowlists `*.vercel.app` / `instagram.com` / `drive.google.com`. |

Optional 4th: `refsites-review` — a tiny session just to triage CI / review
PRs / approve merges, no edits. Keeps the merge decision deliberate.

Each session reads the same repo (`saibuilds/reference-sites`, branch
`claude/setup-mcp-api-keys-t4GTr`) and the `HANDOFF.md` already in there.

---

## 2. Every tool/service you've mentioned — analysed

Tested from `refsites-code` (this session) — every gen host is blocked
here. Status applies to *this* env; `refsites-media` will see different
results.

### Image / video generation

| Service | What it actually is | Status from this env | Best for |
|---|---|---|---|
| **Higgsfield** (`higgsfield-mcp`) | Their unified API: Soul image, Kling/Seedance/DoP video, Reve, Seedream. Needs `HF_API_KEY` + `HF_SECRET`. | 403 — host blocked | Premium cinematic hero stills + 5-sec brand reels. **Best overall single picker** if you want one service. |
| **fal.ai** (`fal-ai` MCP) | Umbrella host: nano-banana (Gemini 2.5 Flash Image), Flux, Seedance, Recraft, Veo, hundreds more. One `FAL_KEY`. | 403 — host blocked | Cheapest, broadest. Where nano-banana actually lives. |
| **nano-banana** (`@nanana-ai/mcp-server-nano-banana`) | Misleading name — it's a **`nanana.app` reseller**, not Google. Reads `NANANA_API_TOKEN`. | 403 — host blocked | Skip. Use fal-ai instead for real Gemini 2.5 Flash Image. |
| **Replicate** (`replicate-mcp`) | Run almost any open model. Token `r8_…`. | 403 — host blocked | Open-source models (SDXL, Flux schnell, etc.) and obscure custom finetunes. |
| **Pollinations** (`image.pollinations.ai`) | Free, no auth. Plain GET URL → image. Models: `sana`, `flux`, `turbo`. | 403 from here; **reachable from your other session** (it generated all 15 heroes there). | Free baseline. What you used to ship the current hero set. |
| **Stability / BFL / Runway / Luma / Kling / Hunyuan** | Other premium gen APIs. | All 403. | Only worth wiring if you want a specific look the others can't hit. |
| **OpenAI Images / DALL·E** | OpenAI image API. | 403. | Generic; weaker than Flux/nano-banana now. |
| **Hunyuan (Tencent)** | Chinese-language gen API. | 403. | Only if you specifically want that aesthetic; needs Tencent Cloud creds. |
| **Spline** | **Not** a generation API — a 3D scene editor. You export a Spline scene URL and embed it in the hero (we already wire this on `04-3d-spline-webgl`). | n/a | Your 3D hero objects (orb, device). Exports a scene URL the page loads. |
| **Vertex AI Imagen** (Google) | Google's hosted Imagen 3 via `aiplatform.googleapis.com`. | Host **reachable** but needs Vertex-scoped OAuth (Gemini API key won't work). | Fallback if everything else is throttled and you have GCP. |

### Site builders (the "$50k website" video)

| Tool | Reality check | Best for |
|---|---|---|
| **Lovable** | Generates a full Next.js/Tailwind app from a prompt; live preview; one-click Vercel deploy. Best out-of-box quality right now. | Fastest path from `PROMPTS.md` prompt → live site for a single business. |
| **Bolt.new** | Similar; in-browser editor, faster iteration; slightly less polished output. | Quick A/B against Lovable. |
| **v0 (Vercel)** | Shadcn-style components, very clean, less "complete site". | Component-grade UI you assemble yourself. |
| **Framer** | Visual, not prompt-first; superb animations; not code you own. | Marketing pages where you want pixel control without coding. |
| **Webflow** | Mature visual builder; CMS; not AI-prompted. | Long-term content sites with multiple editors. |

**My pick for "spin up a site for each business in PROMPTS.md":** **Lovable**.
Paste the archetype's prompt block from `PROMPTS.md` → iterate → deploy on
Vercel. If output is shaky, run the same prompt on Bolt for comparison.

### Voice / video

- **ElevenLabs MCP** — TTS / voice clone. **Skip** for this project unless
  you want AI voiceover on a brand video. Static sites don't use it.

### 3D asset generation (different category — Higgsfield does NOT do this)

Higgsfield / fal / Pollinations output 2D images + short video. For real
3D meshes or Spline scenes you need a different stack.

| Tool | Output | Best for |
|---|---|---|
| **Omma by Spline** (`omma.build`) | Interactive web experiences combining **3D + motion + UI + code**, generated from natural language. Outputs publishable scenes (web / mobile / XR). Paid ($29/mo Pro). | The most ambitious option: a full hero *experience*, not just a model. Launched March 2026; integrates with the Spline ecosystem. Try this *before* hand-wiring Three.js if a client wants a "wow" hero. |
| **Spline AI** (inside Spline.design) | Spline scene URL or `.splinecode` — embed via `<spline-viewer>` or load with the Spline runtime | The `04-3d-spline-webgl` archetype directly. Hero *scenes* / abstract objects / device mocks. No new pipeline needed. **Default pick** if Omma is overkill. |
| **Unicorn Studio** (`unicorn.studio`) | No-code WebGL **2D + motion** scene editor; exports embeddable JS scenes (parallax, mouse-reactive, scroll-linked). | A different category from Spline (Unicorn is 2D-WebGL-interactive, not full 3D). Use when the hero needs a flat-but-interactive scene (mouse-reactive gradients, scroll-linked layered illustration) and a full 3D scene would be overkill. Sits cleanly alongside Spline AI — pick by whether the hero is 2D-flat or 3D-deep. |
| **Meshy.ai** | `.glb` / `.fbx` / `.obj` (text-to-3D and image-to-3D) | A specific *object* (watch, bottle, jet, coconut, chair) loaded directly by Three.js. Free tier + REST API (`api.meshy.ai`). |
| **Tripo3D** (Tripo AI) | `.glb` / `.usdz` (text-to-3D and image-to-3D) | A/B against Meshy — often stronger on organic / asymmetric shapes. Has API. |
| **Luma Genie** | `.glb` from web app | Manual exports; no real API yet. Use when Spline AI can't get the look. |
| **Rodin** (Hyper3D) | High-quality `.glb` | Premium tier; narrower availability. |
| **Womp / Vectary** | Hosted 3D scenes — *editors*, not generators | Replace Spline as the editor if you ever leave Spline. Not relevant to AI generation. |

**Pipeline (same shape as image gen):**

```
refsites-media (open network)  →
  Spline AI scene URL  OR  Meshy/Tripo .glb
→ commit to assets/3d/<id>.glb  or  paste scene URL into the archetype
→ Three.js in shared/lib.js (or <spline-viewer>) renders it
→ refsites-code rebuilds and pushes
```

**Try first:** Spline AI for the `04-3d-spline-webgl` archetype (zero new
infra). Add Meshy.ai when a specific archetype needs a real product
object — e.g. a watch movement glb for `01-luxury-dark`, a jet glb for
`09-aviation-luxury`, a halved coconut for `13-wellness-botanical`.

### Animation libs (already wired in the library)

| Lib | Used | Notes |
|---|---|---|
| **GSAP + ScrollTrigger** | yes | Drives reveals + scroll-pin. |
| **Lenis** | yes | Smooth scroll. Always include — instant polish. |
| **Three.js** | on `04-3d-spline-webgl`, `04-3d` | For 3D hero backgrounds. |
| **Vanta.js** | optional | Cheap animated backgrounds (waves, fog, net). |
| **Lottie** | optional | Micro-interactions (icons, checkmarks). |
| **Framer Motion** | only if you go React | Component animations in Lovable/Bolt output. See expanded note below. |

### Framer Motion — expanded

A production-grade React animation library by the Framer team (despite
the name, you do not need the Framer builder to use it). Declarative
`<motion.div animate=… />` API, layout animations, gesture handling,
spring physics, scroll-linked animations via `useScroll`/`useTransform`.

- **Where it fits:** as soon as you take a prompt out of `PROMPTS.md`
  into Lovable / Bolt / v0, the output is React + Tailwind — that's the
  ideal home for Framer Motion. The current static reference library is
  HTML + GSAP + Lenis; Framer Motion isn't used there and shouldn't be
  retrofitted.
- **GSAP vs Framer Motion in this project:** GSAP wins for scroll-pin,
  horizontal scroll, scrubbed timelines, SVG path morphs. Framer Motion
  wins for component-level enter/exit + gesture + layout transitions in
  React. Use both: GSAP for the page choreography, Framer Motion for
  the components inside it.
- **Add to a prompt as:** `ANIMATION: GSAP + ScrollTrigger for scroll
  choreography; Lenis for smooth scroll; Framer Motion for component
  enter/exit, layout transitions, and hover/gesture states; springs
  (stiffness 200, damping 24) for natural feel.`

### Component libraries & generated-UI sources

| Source | What it is | Status from this env | Best for |
|---|---|---|---|
| **21st.dev** | A registry / marketplace of high-quality shadcn-style React components (heroes, marquees, bento grids, animated cards, etc.). Also ships a **`@21st-dev/magic` MCP server** that lets the editor (Cursor / Claude / Windsurf) pull a chosen component into your project via a single tool call. | MCP not installed here; their site itself isn't allowlisted, but the MCP can be added to any session that has outbound. | **Single fastest way to make builder output look polished.** Wire the Magic MCP into `refsites-media` (or `refsites-code` once network is opened). Then for any prompt: "use the 21st.dev hero `<name>` and animated cards `<name>`" — the MCP drops them in. Tier: free for solo, paid for teams. |
| **UI Pro Max** | I'm not certain which one you mean. Plausible matches: (a) **Nuxt UI Pro** (Vue, paid premium components by NuxtLabs), (b) **Tailwind UI** (paid, by Tailwind Labs — the "Plus / Pro" tier), (c) **Aceternity UI / Magic UI / Origin UI** (popular animated shadcn-style kits often described as "pro max"), or (d) a Claude Code **skill** by that name. Send the link or screenshot and I'll add a proper write-up. | — | — |

If "UI Pro Max" turns out to be one of the shadcn-style premium kits,
the recommendation is the same shape as 21st.dev: install once, then
reference component names directly in your `PROMPTS.md` blocks for any
business build.

### Other registries / kits worth knowing

These don't fit the spectacle layer (one curated single-author set per
animation use-case) but cover adjacent needs.

| Tool | What it is | When to reach for it |
|---|---|---|
| **HeroUI** (`heroui.com`, formerly NextUI) | Modern React component library with its own design system + theming engine. Not copy-paste — installed as a package. Strong defaults, animated by default. | If you'd rather adopt a *whole design system* than wire shadcn + spectacle registries yourself. Faster v0; less control. |
| **Tailwind UI / Plus** (`tailwindcss.com/plus`) | Paid premium components and templates from the Tailwind team. The original "agency-grade" copy-paste set. | When the client is willing to pay for the most stable, well-engineered marketing components. Worth it for a single team license. |
| **Tremor** (`tremor.so`, by Vercel) | React + Tailwind components specifically for **dashboards and charts** (KPI cards, area/bar/donut charts, tables). Built on Recharts under the hood. | Any internal admin / metrics page. *Not* for marketing pages. |
| **Uiverse.io** | Huge **community marketplace of pure CSS/HTML** snippets — buttons, cards, inputs, loaders, checkboxes. Not React. | Grabbing one-off styled inputs/buttons when you don't want to drag a whole registry in. Convert the CSS to a Tailwind+React component yourself. |
| **Nextra** (`nextra.site`) | **Docs-site framework** for Next.js (MDX, theme, search). Used by shadcn's own docs. Not a component library. | When you need a polished docs site (e.g. a public API docs page for the future Starry Labs / dm-ck-core kernel). |

### Video rendering: Remotion (scaffold included in this repo)

A Node + React library that renders React components into **MP4 video**.
Code-only, no API/network, deterministic.

A working scaffold lives at **`tools/remotion/`** in this repo:

```bash
cd tools/remotion
npm install
node render.js                       # render all archetypes -> ../../assets/<id>-hero.mp4
node render.js 13-wellness-botanical # render one
npm run studio                       # open Remotion's live preview at localhost:3000
```

It reads `STYLES[]` from `build.js`, passes each archetype's palette /
fonts / brand copy as `inputProps` into a single composition
(`src/HeroReel.tsx`), and writes per-archetype MP4s into `assets/`.
Skips files that already exist. Restyle the reel itself by editing
`src/HeroReel.tsx`; change archetype content in `build.js` and the next
render reflects it. See `tools/remotion/README.md` for details.

This is `motion`'s sibling, not its replacement — Remotion is for *video
files*, Motion is for *on-page animation*. Both can coexist in a real
client build.

### Design / asset side

- **Figma Dev-Mode MCP** — install if you want to turn real Figma comps
  into code automatically. Worth it once you have client comps.
- **Canva MCP** — already connected; useful for social/ads off the same
  brand kit.

### Reference research — how to feed me real sites without network access

This is the practical answer to the recurring "I can't fetch
`coco-veda.vercel.app` / Instagram reels / Vercel previews" loop:

- **`getdesign.md`** (`getdesign.md`) — a curated library of
  **DESIGN.md** analyses for top sites (Apple, Figma, Airbnb, Meta, BMW,
  IBM, Cursor, Webflow, Replicate, MiniMax, Composio, etc.). Each
  DESIGN.md is a structured breakdown of that site's design system —
  tokens, type, spacing, components, motion — in a format meant to be
  read by an AI coding agent. **Drop one into the repo and I can
  reproduce its aesthetic with high fidelity, no live fetch needed.**
  This is the closest substitute to "Claude can see the site." Most
  useful pages: the per-company DESIGN.md pages (`getdesign.md/<company>/design-md`).
- **DESIGN.md Generator Chrome extension** — pairs with the above. Open
  any site (e.g. `coco-veda.vercel.app`) on your laptop, run the
  extension, and it generates a DESIGN.md from the live page's styles.
  Save that file → drop it in the repo (`notes/coco-veda.design.md` or
  similar) → I read it and tune the matching archetype against the
  *actual* tokens/patterns instead of guessing. This finally closes the
  loop on sites I can't reach.
- **Claude for Chrome** (extension, your machine) — still the right tool
  when you need *behaviour* not just styles (scroll-linked animations,
  interactive states, video). Pair it with the DESIGN.md Generator for
  full coverage. **Full project playbook (setup + copy-paste task
  prompts + reliability/security tips) is in [BROWSER.md](BROWSER.md)** —
  it's how to make the extension do the gaps this cloud session can't
  (analyze reference sites, generate imagery, set Cloudflare vars, QA).
- **Firecrawl / Fetch MCPs** — would let *this* session scrape live
  sites, but they're useless until the env's network policy is opened.
  If you ever open `refsites-research`'s policy, install these there.
- **Awwwards "Sites of the Year"** (`awwwards.com/websites/sites_of_the_year/`)
  — the highest-signal *inspiration index*. Skim the year's winners on
  your laptop, pick the 3–4 nearest in feel to whatever client work is
  next, run **DESIGN.md Generator** on each, drop the resulting .md
  files into `notes/`. That gives me a structured token/pattern read of
  what's actually winning in the field, without me ever needing to
  reach the network.

**The workflow that actually works now:**

```
1. You open the target site on your laptop (e.g. coco-veda.vercel.app)
2. Run DESIGN.md Generator → saves coco-veda.design.md
3. Drop it into notes/ in this repo (or paste contents in chat)
4. I refine the matching archetype from its actual tokens/patterns
5. Push, deploy, compare
```

That's the unlock — no more guessing-from-research for sites I'm asked
to match.

### "$50k site" backend (if you take the library into real-business builds)

- **Supabase** (DB/auth), **Stripe** (payments), **Resend** (transactional
  email), **Sentry** (error monitoring). All have official MCPs. Add
  these to `refsites-media` or a 4th `refsites-backend` only when you
  start shipping real client sites.

### Pending — items you mentioned that I couldn't pin down

These are tracked, not forgotten. I won't guess at what to analyse —
drop a **link, screenshot, or one-line description** and I'll write
them up properly alongside the rest of the arsenal.

- **Barbni AI / Barbroni AI** — not recognised under either spelling.
  Possible matches I can confirm or rule out with a link: **Bardeen.ai**
  (no-code automation), **Barbara AI** (industrial edge computing), or
  something more recent that hasn't surfaced in search yet. Where did
  you come across it — Instagram reel, X thread, product hunt, somewhere
  in the chat someone screenshotted?
- **UI Pro Max** — also unclear which one. Four plausible matches
  (covered in the components-and-registries table above): **Nuxt UI Pro**
  (Vue, NuxtLabs paid), **Tailwind UI / Plus** (Tailwind Labs paid),
  one of the shadcn-style premium animation kits (**Aceternity UI**,
  **Magic UI**, **Origin UI**), or a **Claude Code skill** by that name.
  Link pins it.
- **Vengene UI** — couldn't find any product matching this name in a
  web search. Likely a misspelling. Could be **Vengeance UI**? Or
  something you saw in a niche post. Drop the link.
- **Neurobus** — searched and found two real products with this name,
  but neither is a UI/web-dev tool: **Neurobus.ai** (deeptech edge AI
  for defense/aerospace — drones, satellites) and **Cognizant's
  Neuro-SAN** (multi-agent AI orchestration framework). Neither fits
  the pattern of the other tools in this list. Did you mean one of
  those, or a different "Neuro-" project?
- **Atomize Design** — could be **Atomize React** (a smaller React UI
  kit / Bootstrap-style component library), or you may be referring to
  **atomic design** (Brad Frost's methodology — atoms → molecules →
  organisms — which is a *principle* rather than a tool). Confirm
  which.

Anything else you've mentioned in passing that I haven't covered — give
me one line per item and I'll either write it up or flag it here.

---

## 3. What's best — short recommendation

For *this* project (a generated library of reference sites + a prompt
system to spin sites for real businesses):

1. Sessions: **`refsites-code`** (this one) + **`refsites-media`** (the
   one already shipping hero JPGs). Add `refsites-research` only if you
   need real-site analysis on demand.
2. Imagery: **Higgsfield** for premium cinematic stills/video, **fal.ai**
   as the cheaper everyday workhorse for nano-banana / Flux / Seedance,
   **Pollinations** as a free fallback (already used). Skip
   `@nanana-ai/mcp-server-nano-banana` — it's not Google, it's a reseller.
3. Builder for client sites from `PROMPTS.md`: **Lovable**, with **Bolt**
   for A/B.
4. Browser/research: **Claude for Chrome** on your laptop. Not solvable
   from the cloud env.
5. Don't add: ElevenLabs, Figma MCP (yet), backend MCPs (yet) — scope
   creep until you have a real client commitment.

---

## 4. Copy-paste prompts (per session)

### `refsites-media` — generate every hero and 5-sec brand reel

> Continue the `saibuilds/reference-sites` project on branch
> `claude/setup-mcp-api-keys-t4GTr`. Read `HANDOFF.md`, `NETWORK.md`,
> `build.js`. For each `id` in `GEN_PROMPT{}` from `build.js`: (1) call
> Higgsfield `generate_image` with the prompt at 1080p; if that 403s,
> fall back to fal.ai (`fal-ai/flux/dev` then `fal-ai/nano-banana`); if
> both fail, fall back to `image.pollinations.ai/prompt/<encoded>?model=flux&width=1600&height=1000&nologo=true`.
> Save each result as `assets/<id>-hero.jpg`. Then run `node build.js && node build-index.js`.
> Separately, for each archetype produce a 5-sec brand reel via
> Higgsfield Kling/Seedance using the same prompt, save as
> `assets/<id>-hero.mp4`. Commit and push to the same branch. Report
> which path each archetype landed on.

### `refsites-research` — analyse a live brand site and refine archetype 13

> On branch `claude/setup-mcp-api-keys-t4GTr` of `saibuilds/reference-sites`,
> open `https://coco-veda.vercel.app/`. Extract its real palette (hex),
> typography, exact section order, copy tone, and any signature
> interactions. In `build.js` STYLES, refine archetype
> `13-wellness-botanical` to match the live site's *structure and feel*
> using the existing section system — but keep the displayed brand and
> copy original (i.e. use `refs:'Coco Veda'` as the inspiration label
> only; the actual `g.brand` on the rendered page should be an invented
> name, the way the Cartier-style archetype uses `MAISON HORLOGÈRE`).
> Then run the build and push.

### `refsites-code` — what this session keeps owning

> Source of truth for `build.js`, archetypes, layout, `PROMPTS.md`,
> `HANDOFF.md`. No image generation (env blocks it). Reviews PRs, runs
> `node build.js && node build-index.js`, fixes deploy/CI issues, merges
> only with explicit user approval.

---

## 5. Modern frontend stack — opinionated picks

Beyond the MCPs already in `.mcp.json`, these are the tools worth wiring
once you take a `PROMPTS.md` prompt into a real React/Next.js client
build (Lovable / Bolt / v0 / hand-coded).

### Sub-agent callable from `refsites-code` right now — Gemini 2.5 Flash

This is the only AI generation API actually reachable from this session
(verified: `generativelanguage.googleapis.com` is in the egress
allowlist; valid `GEMINI_API_KEY` is in `.mcp.env`). Wrapper lives at
**`tools/gemini.js`** — confirmed working.

```bash
set -a && source .mcp.env && set +a
node tools/gemini.js "Reply with one word: WORKS"             # quick test
echo "Summarise this file:" "$(cat build.js)" | node tools/gemini.js
node tools/gemini.js --model gemini-2.5-flash-lite "Cheap quick draft"
```

What it's actually good for here:

- **Long-context summarisation** (1M-token input window) — read the
  whole repo, an entire DESIGN.md, a transcript dump, and return a
  compact answer without burning Claude's context.
- **Cheap structured extraction** — pipe a DESIGN.md or HTML page into
  it, ask for "palette as JSON," get clean output.
- **Multimodal** — Gemini Flash sees images via base64; useful when you
  drop a screenshot into the repo.
- **Backup for the rate-limited path** — retries 5x on 503/429 with
  exponential backoff (Gemini Flash gets overloaded sporadically).

What it's *not* for: this is a peer LLM, not the orchestrator. I (Claude
in `refsites-code`) keep driving — I delegate narrow text tasks to
Gemini when long context or cheap throughput matters.

### MCPs to add at user scope (so they're available in every project)

| MCP | What it actually does | Add command |
|---|---|---|
| **Context7** (Upstash) | Pulls live, current docs for libraries (React, Next, Motion, Three, GSAP, Spline, shadcn, Tailwind, etc.) into the prompt — eliminates "Claude wrote outdated API code." Just say *"use context7"* in a prompt. No key needed. | `claude mcp add --scope user context7 -- npx -y @upstash/context7-mcp` |
| **Playwright MCP** (Microsoft) | Headless browser automation: navigate, screenshot, click, fill forms. The right pick out of the three things sometimes called "browser MCP" — Microsoft maintains it; it's headless so it doesn't fight your real Chrome. | `claude mcp add --scope user playwright -- npx -y @playwright/mcp@latest` |
| **21st.dev Magic** | Generates production-grade React + Tailwind components on demand from a description ("make me a pricing card with annual toggle"). Pulls from a curated component registry. Free tier exists. | `claude mcp add --scope user magic -- npx -y @21st-dev/magic@latest --api-key=YOUR_21ST_KEY` |

Other "browser MCP" variants to be aware of: `@browsermcp/mcp` drives
your **logged-in Chrome** via an extension (use this if you need
authenticated session access — e.g. to actually open Instagram reels
under your account); Puppeteer-based ones are older and unmaintained —
skip.

### The animation library question (one right answer in 2026)

The library you may know as **Framer Motion** split from Framer in late
2024 and is now distributed as **Motion** (`motion.dev`). For React:

```bash
npm install motion
```
```js
import { motion } from "motion/react"
```

Do not install `framer-motion` for new projects — it still publishes
for back-compat, but the canonical name is now `motion` and the React
entry point is `motion/react`. Don't install both.

**Motion is not Remotion.** `remotion` is an unrelated library that
renders React components into MP4 video files (CLI: `@remotion/cli`).
Only install it if you actually need video output from code — e.g. to
auto-generate the brand reel videos for the reference library. For
on-page animation, `motion` is what you want.

**Motion vs GSAP in this project:** keep GSAP + ScrollTrigger as the
"page choreographer" (scroll-pin, horizontal scroll, scrubbed timelines)
and add Motion for component-level transitions when you go React. Don't
duplicate the role.

### Component libraries — layered, not stacked at random

| Layer | Library | Role |
|---|---|---|
| **Foundation** | `shadcn/ui` (Radix + Tailwind, copy-paste — you own the code) | Buttons, dialogs, forms, tables, dropdowns. Use for the *structure* of dashboards/admin UIs and every interactive primitive. |
| **Spectacle** | `Skiper UI` · `Magic UI` · `React Bits` (animation-heavy, all copy-paste via the shadcn CLI; all depend on Motion) | Marquees, image trails, scroll stacks, 3D blocks, big animated CTAs. Use for marketing/landing sections. |
| **On-demand** | 21st.dev Magic (MCP, above) | Generated bespoke components when the design isn't in any registry. |
| **Alt registries** | Aceternity UI, Origin UI | Pick at most one *more* alongside Skiper / Magic UI / React Bits — don't sprawl across five. |

**Spectacle-layer registries side-by-side** (all free, all
copy-paste on top of shadcn + Motion):

| Registry | Site | Strengths | Use when |
|---|---|---|---|
| **Skiper UI** | `skiper-ui.com` | Image trails, scroll stacks, 3D scroll, hover-distortion. The richest "wow"-factor effects in the lot. | Hero blocks and signature scroll moments. |
| **Magic UI** | `magicui.design` | Marquees, animated beams, blur-fade, shimmer button, dock, globe, retro grid. Cleanest "modern SaaS landing" components — overlaps heavily with what big AI startup sites use. | The body sections — proof, features, social-band. |
| **React Bits** | `reactbits.dev` | Strong text animations (split-text, decrypted-text, blur-text, shiny-text) and lightweight backgrounds (waves, dots, particles). | Headline reveals, type-led sections, simple animated backdrops. |
| **Animate UI** | `animate-ui.com` | Open-source animated React components built on **shadcn CLI + Motion + Tailwind**. Closest in spirit to Magic UI; slightly broader interaction palette (hover-card animations, animated tabs, badges). | Use as a Magic-UI alternative or alongside it for non-overlapping pieces. |
| **ForgeUI** | `forgeui.in` | Shadcn-style React components emphasising **Framer-Motion-driven** animations (hover effects, scroll reveals, loaders, animated form). Free, copy-paste. | Drop-in for animated forms and on-scroll reveals when the curated set above is missing the exact pattern. |
| **Aceternity UI** | `ui.aceternity.com` | Heavy effects (background beams, lamp, world map, sparkles). Some overlap with Magic UI. | Premium-feel hero accents — pick *one* registry per project, ideally not both Aceternity and Magic UI together. |
| **Origin UI** | `originui.com` | shadcn-faithful primitives with small tasteful animations and a wider component count (date pickers, command bars, tooltips). | Reach for it when shadcn's own set is missing a primitive you need. |

**Default mix for marketing-page client builds:** shadcn (foundation) +
**Magic UI** (body sections, marquees, animated beams) + **Skiper UI**
(hero spectacle) + **React Bits** (text/headline animation) + Motion +
21st.dev Magic on demand. Don't load all of these for a dashboard build
— stay on shadcn there.

### Why 21st.dev is structurally different from the other registries

Worth pinning down because it gets lumped in with Skiper / Magic UI /
React Bits / Aceternity and it isn't really the same thing.

| | Authorship | Visual coherence | Breadth | AI-driven |
|---|---|---|---|---|
| Skiper / Magic UI / React Bits / Aceternity | Single author per registry | High (one taste) | Narrow but deep on their specialty | No (you pick manually) |
| **21st.dev** | Community (many authors) | Variable | Wide — niche components others lack | **Yes** (Magic MCP picks/generates for you) |

So 21st.dev is **two things in one**: a community marketplace of
shadcn-compatible components (`21st.dev/<author>/<component>`) *and* the
Magic MCP that lets Claude/Cursor fetch the right one by description.
The single-author registries above are *just* the components.

Practical positioning in this project: use single-author registries
(Magic UI / Skiper / React Bits) as the *coherent* core for any client
build, and the 21st.dev Magic MCP as a **gap-filler** — when you need a
niche component nobody else ships (kanban, calendar, dashboard widget),
or when you want Claude itself to pull a component on demand mid-build.
Always check what a chosen 21st.dev component drags in dependency-wise
before adding it; community contributions vary.

Install order in any new client project:

```bash
npx create-next-app@latest        # or vite-react
npm install motion clsx tailwind-merge
npx shadcn@latest init
npx shadcn@latest add button card dialog form input table
# add Skiper components individually as needed:
npx shadcn@latest add https://skiper-ui.com/registry/<component>.json
# optional 3D:
npm install three @react-three/fiber @react-three/drei
```

Skiper is **not** an npm package — it's a registry. The shadcn CLI
copies a component into your `components/ui/` folder where you own it.
Same model as shadcn.

### Where Stitch fits

Google **Stitch** (`stitch.design`, Google Labs, beta) is a design-to-code
generator — describe a UI in natural language, it produces a screen you
can export to Figma or as HTML/CSS. Treat its output as a **starting
layout**, not final code. The realistic workflow is:

```
idea → Stitch screen → export → reimplement with shadcn primitives +
Skiper sections + Motion + 21st.dev Magic for the gaps → polish in code
```

We have `stitch` wired in `.mcp.json` already, but functionally it's
upstream of `refsites-code` — useful when you're mocking a new client
site, not when you're refining an existing one.

### Frontend best practices we're already following (or should)

These are the rules `build.js` and the new archetypes lean toward; keep
them when client builds move to React.

1. **Design tokens before components.** Define `--bg`, `--surface`,
   `--fg`, `--accent`, `--card`, `--card-bd` in CSS variables (we do this
   in `vars{}` on every archetype). Change the brand by changing tokens,
   not 50 components.
2. **One animation library per project.** Motion *or* GSAP — not both
   doing the same job. We use GSAP for page choreography on the static
   library; React client builds use Motion.
3. **Scroll-driven via `useScroll` / `useTransform`** (Motion) replaces
   most of what dedicated scroll libs used to do.
4. **shadcn for structure, Skiper for spectacle.** Don't hand-roll a
   marquee or an image-trail — pull the registry version.
5. **`cn()` everywhere** for composing Tailwind classes — never raw
   string concatenation.
6. **No arbitrary pixel values** in Tailwind — `p-[17px]` is a tell that
   the spacing scale is wrong, not the component.
7. **Dark mode via CSS variables**, not duplicate `dark:` classes on
   every utility.
8. **Mobile-first + container queries** (`@container`) for component-
   level responsiveness.
9. **Accessibility is non-negotiable** — Radix gives this free via
   shadcn; don't replace primitives with raw `<div>`s.
10. **Forms = react-hook-form + zod.** shadcn's form is built on this
    pair. No `useState` form soup, no Formik.
11. **Icons = `lucide-react`.** One icon library. Don't import Heroicons
    + Lucide + react-icons in the same project.
12. **Fonts = `next/font`** (or `@fontsource/<font>`). Don't use
    `<link>`-tag Google Fonts — it kills LCP.
13. **Loading = Suspense + `<Skeleton>`,** not the string "Loading…".
14. **Never invent business content.** Real brand, real services, real
    contact — or `[placeholder]`. Inventing copy is how a site grows
    "polish pass 7" before v1 is content-accurate.
15. **Verify in a real browser at every step.** Type-checks prove
    correctness, not "this looks right." Open the page, click around.

---

## 6. What we actually learned in this chat (project-specific)

Concrete, hard-won lessons from this thread. Read these before the next
session.

- **The network allowlist is the dominant constraint of `refsites-code`.**
  Every external AI host (Higgsfield, fal, Replicate, Pollinations, even
  most brand sites and Drive/YouTube/Instagram) returns
  `403 Host not in allowlist` from this environment. Only `npm`,
  `github`, and `googleapis` are reachable. Sessions running in
  different policies see different worlds — your `refsites-media`
  session had Pollinations open and used it to ship all 15 hero JPGs.
  Stop trying to fix it from inside the container; the only fix is
  reconfiguring the env's network policy in the Claude web UI.
- **MCP env-vars matter and are easy to get wrong.** The original
  `.mcp.json` named the higgsfield secrets `HIGGSFIELD_API_KEY` /
  `_SECRET`; the actual package reads `HF_API_KEY` / `HF_SECRET`. It
  silently auth-failed in *every* session until the names were mapped.
  Similarly `@nanana-ai/mcp-server-nano-banana` reads `NANANA_API_TOKEN`,
  not `GEMINI_API_KEY` — it's a reseller, not a Google wrapper.
- **`resolveAsset()` is the seam.** It auto-prefers
  `assets/<id>-hero.{jpg,png,webp}` over the procedural SVG. That means
  generation can happen in *any* session, drop files into `assets/`,
  push — and every build picks them up with **zero code change**. This
  decoupling is what made the multi-session pattern work.
- **Deterministic procedural art = clean diffs.** The `cosmos` motif
  uses a seeded sin-hash for its starfield so rebuilds produce
  byte-identical SVGs. Any randomness in the art engine creates noisy
  history.
- **Don't homogenize the library to fix one bad page.** When AMARA felt
  "off vs Coco," the temptation was to make everything light/soft.
  Instead the real fix was generalising the *quality lesson*: the
  cinematic depth/light-leak/vignette upgrade to `artSVG` improved every
  photo-driven archetype while preserving each one's distinct identity.
  Diversity is the point of a reference library.
- **Cloudflare Workers ≠ Cloudflare Pages.** A `_redirects` file with a
  404 status code is valid Pages syntax but Workers Static Assets
  rejects it (only 3xx redirects allowed). This silently killed three
  consecutive deploys. Per-brand 404 routing on Workers needs either a
  thin Worker or `assets.not_found_handling` in `wrangler.jsonc`.
- **Sitemap/robots/SEO files live at the brand level, not the repo
  root.** A root `sitemap.xml` pointing to `*.pages.dev` while the
  service deploys to `*.workers.dev` confuses everyone. If sub-brand
  sites have their own sitemaps, the root sitemap should be a
  *sitemapindex* that points to them at the correct origin.
- **Public deploys = brand-identity care.** Adopting a real brand's
  exact palette + literal brand name + retail price on a Cloudflare
  Workers domain under your own account crosses from "inspired by"
  into "presenting as." The cleaner pattern (which most archetypes
  already follow): keep the real brand in `refs:` as the inspiration
  label, but use an invented name in `g.brand` for the actual rendered
  page — e.g. Cartier-style archetype displays "MAISON HORLOGÈRE."
- **Multi-agent coordination needs a written handoff.** `HANDOFF.md`
  exists exactly so a new session can resume without re-reading this
  whole thread. When two sessions push to the same branch (you have at
  least two active), `git fetch + rebase` before pushing is mandatory;
  treat non-fast-forward errors as a sync prompt, not a problem.
- **Don't add features the project doesn't need yet.** ElevenLabs voice,
  Figma MCP, Supabase/Stripe/Resend/Sentry — all useful, none belong in
  a static reference-site library. Add them only when a real client
  build pulls them in.
- **`PROMPTS.md` is the product.** The 15 archetype prompts (populated
  from real palette/fonts/sections/refs) are the reusable engine for
  spinning sites for any business. Builder choice (Lovable / Bolt / v0)
  matters less than the prompt quality.

---

## 7. The relay (paste into another chat to align it)

> Bring me up to speed on the project state:
>
> We're running 3 Claude sessions in different network policies:
> `refsites-code` (this one's job is `build.js` / archetypes / PRs;
> outbound blocked except npm + github + googleapis), `refsites-media`
> (image/video generation via Higgsfield + fal + Pollinations;
> outbound open), `refsites-research` (live-site analysis;
> Claude-for-Chrome on the laptop or a web env that allowlists Vercel /
> Instagram).
>
> Shared MCPs to install user-scoped (run once):
> `claude mcp add --scope user context7 -- npx -y @upstash/context7-mcp`
> `claude mcp add --scope user playwright -- npx -y @playwright/mcp@latest`
> `claude mcp add --scope user magic -- npx -y @21st-dev/magic@latest --api-key=YOUR_KEY`
>
> When we move a `PROMPTS.md` prompt into a real React build, the stack
> is: Next.js + Tailwind + `motion` (imported from `motion/react`, the
> renamed Framer Motion) for component animation, **GSAP + ScrollTrigger
> + Lenis** for scroll choreography, **shadcn/ui** for primitives,
> **Skiper UI** (registry on top of shadcn + Motion) for animated
> marketing sections, **21st.dev Magic** MCP for generated bespoke
> components, **Google Stitch** for design-to-code mockups upstream.
> Do not install `framer-motion`; install `motion`. Do not confuse
> `motion` with `remotion` — remotion renders MP4s from React, only
> install if we need video file output.
>
> Conventions: design tokens in CSS variables before any components;
> one animation library per project; `cn()` for class composition; no
> arbitrary pixel values; mobile-first + container queries; forms via
> `react-hook-form` + `zod`; icons via `lucide-react`; fonts via
> `next/font`; accessibility via Radix (don't replace primitives with
> raw `<div>`); never invent business content — placeholder until real
> content arrives; verify in a real browser, not just type-checks.
>
> Project-specific lessons that must survive across sessions: the
> network allowlist gates everything for `refsites-code`; MCP env-var
> names are mapped in `.mcp.json` (`HIGGSFIELD_API_KEY → HF_API_KEY`,
> `HIGGSFIELD_API_SECRET → HF_SECRET`, `NANANA_API_TOKEN` not Gemini);
> `resolveAsset()` auto-prefers `assets/<id>-hero.{jpg,png,webp}` over
> the procedural SVG so generation can happen in any session and just
> drop files in; deterministic procedural art = clean diffs; don't
> homogenize the library to fix one bad page; Cloudflare Workers
> rejects Pages-style `_redirects` with non-3xx status codes; public
> deploys require care with real brand names and prices; multi-agent
> coordination = `git fetch && rebase` before every push; `PROMPTS.md`
> is the reusable engine.

---

## 8. Top 3 picks — what to actually use, and how they fit together

After all the comparison, the opinionated answer:

### Pick 1 — Media: Higgsfield + Pollinations (free fallback)

- **Higgsfield** handles cinematic stills *and* 5-sec brand reels
  through one MCP — premium quality, premium price.
- **Pollinations** is the free safety net (already used by
  `refsites-media` to ship the 15 hero JPGs).
- Together: Higgsfield for the showcase shots, Pollinations for
  everything else. Skip nanana / Replicate unless you have a specific
  model only they host. `fal.ai` becomes worthwhile only when you want
  a specific *fal-exclusive* model (Flux Pro Ultra, Seedance 2.0).

### Pick 2 — 3D: Spline AI + Meshy.ai

- **Spline AI** for hero *scenes* — slots into `04-3d-spline-webgl`
  with zero plumbing. Just paste the exported scene URL.
- **Meshy.ai** for product *objects* (`.glb`) — when an archetype
  needs an actual model (watch movement for `01-luxury-dark`, jet for
  `09-aviation-luxury`, halved coconut for `13-wellness-botanical`).
  Three.js in `shared/lib.js` loads it.
- Together: Spline = scenes, Meshy = objects. Skip Tripo / Luma / Rodin
  unless you need a specific look these two can't produce.

### Pick 3 — Frontend for client React builds: shadcn + Magic UI + Motion (with 21st.dev Magic MCP as on-demand gap-filler)

- **shadcn/ui** = the primitive foundation (buttons, dialogs, forms,
  tables, dropdowns). You own the code.
- **Magic UI** = the coherent spectacle layer (marquees, animated
  beams, blur fades, shimmer button, dock, globe). Most opinionated
  "modern SaaS landing" set; drops cleanly onto shadcn via the same
  CLI.
- **Motion** = the animation library. Install as `motion`, import from
  `motion/react`. **Not** `framer-motion` — that's the legacy name of
  the same library; new projects install `motion`.
- **21st.dev Magic MCP** = on-demand gap-filler — Claude pulls a
  bespoke component from the community registry when nothing in your
  curated set fits.
- Skip the rest (Skiper / React Bits / Aceternity / Origin) unless a
  specific archetype needs an effect those three cover better. Pick at
  most one *additional* spectacle registry per project.

### Wrapper enablers (install once, not optional)

These don't "complete" anything by themselves — they make every other
pick effective. Install user-scoped in `refsites-media`:

```bash
claude mcp add --scope user context7  -- npx -y @upstash/context7-mcp
claude mcp add --scope user playwright -- npx -y @playwright/mcp@latest
claude mcp add --scope user magic      -- npx -y @21st-dev/magic@latest --api-key=YOUR_21ST_KEY
```

- **Context7** = live docs for Motion / shadcn / Next / Three / GSAP /
  Spline. Eliminates "Claude wrote an outdated API."
- **Playwright** = headless browser; screenshots, navigation, visual
  QA of the rendered pages.
- **21st.dev Magic** = the MCP form of Pick 3's gap-filler.

### How the three picks integrate end-to-end

```
refsites-media (open network)
  └─ Higgsfield / Pollinations  →  assets/<id>-hero.jpg
  └─ Higgsfield video           →  assets/<id>-hero.mp4
  └─ Spline AI scene URL        →  pasted into 04-3d-spline-webgl
  └─ Meshy.ai                   →  assets/3d/<id>.glb
  └─ Context7 / Playwright / Magic MCPs installed user-scope

refsites-code (this session)
  └─ build.js + resolveAsset() picks up everything above automatically
  └─ node build.js && node build-index.js  →  70 pages, all assets wired

first real client React build (e.g. apps/sathideals/)
  └─ Next.js + Tailwind + shadcn primitives
  └─ Magic UI for spectacle sections (marquee, beams, animated proof)
  └─ Motion for component animation + scroll-linked transitions
  └─ 21st.dev Magic MCP fills any component gaps on demand
  └─ Playwright MCP screenshots pages for QA before deploy
  └─ Cloudflare / Vercel deploy
```

That's the whole pipeline — every "extra" tool (Skiper, React Bits,
Aceternity, ElevenLabs, Figma MCP, Supabase, Stripe, Resend) lives
outside this loop and stays optional until a real project demands it.

---

## 9. Premium design — attention control (the refine checklist)

The throughline of every "make it feel high-end" reference: premium sites
**control where the eye goes; they don't decorate.** This is the missing
half of `PROMPTS.md` — the prompts get a fast first pass; this is how you
refine it into something intentional. Run this before building and again
while trimming any archetype.

**Draw the attention map first:**
- **Land** — the one focal element the hero resolves to.
- **Travel** — where weight / contrast / motion pulls the eye next.
- **Rest** — the CTA or the single strongest proof point.
- **Exit** — final CTA → footer.

**One job per section** (no section does two things):
- Hero → emotion + promise · Trust → logos / awards / years ·
  Proof → the work · Process → how it works ·
  Social proof → testimonials · Close → one CTA, no competing buttons.

**Rules of thumb:**
- One focal point per screen — kill competing elements.
- Whitespace is the luxury signal — default to ~2× what feels necessary.
- Motion must *guide the eye*, never just decorate. (This is exactly why
  the minimal-scroll trim + Ken-Burns hero motion we shipped on `02` fit:
  the motion has a job — it draws the eye to the headline.)
- Scroll pacing: slow at story moments, fast through lists.
- Hierarchy via contrast: combine **size + weight + colour — pick two,
  not three.**

**The workflow these principles sit inside:** reference (a site that
already feels premium) → deconstruct its layout / motion / spacing /
scroll → generate a fast first pass (Lovable/Bolt + `PROMPTS.md`) →
refine against the checklist above until nothing feels accidental. Taste
in the refine step is the whole difference between "looks good" and
award-level. Map onto our repo: steps 1–3 = `PROMPTS.md`; step 4 = this
checklist.

### Signature hero pattern: scroll-scrubbed video

A high-end hero worth keeping in the toolkit: a tall (~300vh) sticky
container holds a full-viewport `<video>`; scroll progress maps to
`video.currentTime`, **lerped** (~0.22 smoothing) so the playhead glides
instead of snapping — the footage feels driven by the scroll.

Use it sparingly and know the trade-offs:
- iOS Safari throttles `currentTime` scrubbing → janky on phones. Real
  fix: extract the clip to an image sequence + draw to `<canvas>`, or use
  `requestVideoFrameCallback`.
- 300vh = three screens before the next section — that runs *against* the
  minimal-scroll goal, so reserve it for one signature moment, not every
  page.
- Needs a real MP4 — which can't be produced from this session (Remotion
  chromium + every gen host are allowlist-blocked); render it in a
  networked session.
- Via Higgsfield it costs real credits (Seedance 1080p/8s isn't
  free-tier) — always preview the rewritten cinematic prompt before
  generating; never run "generate, no questions."

Tie-in: `heroVideoGSAP` already accepts an MP4 via `resolveVideo()`; the
scroll-scrub version is a richer variant to add once a real video exists.
A ready, hardened implementation is saved at **`snippets/ScrollHero.tsx`**
(React/Next.js) with a mobile-jank fallback + reduced-motion guard — see
`snippets/README.md` for the end-to-end recipe.

### Free-LLM backups (from the free-llm-api-resources list)

For high-volume / automation / sub-agent work without spending: **Groq**
(fast Llama/Mixtral), **Google Gemini free tier**, **OpenRouter** free
models. Caveat for this project: only `generativelanguage.googleapis.com`
(Gemini) is reachable from `refsites-code` — Groq/OpenRouter are
allowlist-blocked here, so they're options for a networked session only.
