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

### Design / asset side

- **Figma Dev-Mode MCP** — install if you want to turn real Figma comps
  into code automatically. Worth it once you have client comps.
- **Canva MCP** — already connected; useful for social/ads off the same
  brand kit.

### Reference research

- **Claude for Chrome** (browser extension, **your** computer) — the only
  realistic way to "watch reels / scrape live brand sites" in your
  account.
- **Firecrawl / Fetch MCPs** — would let *this* session scrape live
  sites, but they're useless until the env's network policy is opened.

### "$50k site" backend (if you take the library into real-business builds)

- **Supabase** (DB/auth), **Stripe** (payments), **Resend** (transactional
  email), **Sentry** (error monitoring). All have official MCPs. Add
  these to `refsites-media` or a 4th `refsites-backend` only when you
  start shipping real client sites.

### "barbroni ai"

Honestly — I don't recognise that name and I won't guess at what to
analyse. Did you mean **Bardeen.ai** (no-code automation), or is it
something else? Drop the link or a screenshot and I'll add it here.

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
