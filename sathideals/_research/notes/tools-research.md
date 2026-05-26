# Tools Research — MCP availability, prompts, and integration into this repo

Status: **research only.** Nothing is wired into `.mcp.json` yet — this
doc tells you what's real, what's vapor, and what's worth your time. Cite
the linked source against any claim before you act on it. Where an MCP
does **not** exist, the answer is "use the prompt approach" — i.e. drive
the tool with Claude Code by hand and commit the output to `assets/`,
just like the Runable workflow.

Style: same opinionated lens as `ARSENAL.md`. Free-tier first; we don't
need 10 redundant 3D tools.

---

## 1. Tool-by-tool research

Legend for the **MCP?** column:
- **Yes (official)** — vendor-published server
- **Yes (community)** — third-party, but maintained and verifiable
- **No** — none found at time of research; use the prompt approach
- **N/A** — JS library, no MCP needed; documented separately at §1.6

### 1.1 3D scene / web-3D tools

| Tool | What it is | MCP? | Install / endpoint | Source |
|---|---|---|---|---|
| **Spline** (`spline.design`) | Browser 3D editor; exports `.glb`, React component, or hosted scene URL. The dominant pick for in-page 3D heroes. | **Community only — and the only one is archived.** `aydinfer/spline-mcp-server` exists but its README states *"Spline.design does not provide a public REST API, making most of this server's functionality non-operational."* Treat as not real. | `git clone github.com/aydinfer/spline-mcp-server` (don't bother) | [GitHub – aydinfer/spline-mcp-server](https://github.com/aydinfer/spline-mcp-server), [PulseMCP listing](https://www.pulsemcp.com/servers/aydinfer-spline-3d-design) |
| **Omma** (`omma.build`) | Spline's new AI canvas, launched March 24 2026. Prompt → interactive 3D + UI + code, WebGPU-capable, deploys to web. $29/mo Pro. We already list it in `STACK.md` as the "ambitious wow hero" option. | **No.** No MCP exposed; sole interface is the canvas at omma.build. | n/a | [Spline changelog – Meet Omma](https://updates.spline.design/changelog/meet-omma-create-3d-websites-and-apps-with-ai-agents.), [Omma.build](https://omma.build/) |
| **Womp** (`womp.com`) | Browser-based friendly 3D modeller + AI text/image-to-3D, full-color/multi-material print pipeline. Free tier + Pro $9.99/mo. Output is `.glb`/STL. | **No MCP found as of search.** | n/a | [womp.com](https://www.womp.com/), [3DPI launch coverage](https://3dprintingindustry.com/news/womp-launches-ai-platform-for-accessible-3d-model-creation-and-printing-245898/) |
| **Endless Tools** (`endlesstools.io`) | "Design multitool" — Type, Cover, Object, Shape tools for instant 3D typography + objects. AI image→3D and prompt→3D. Exports up to 8K image, video, USDZ, GLB, web embed (alpha supported). | **No MCP found.** Use the web UI; download GLB. | n/a | [endlesstools.io](https://endlesstools.io/), [Brand Identity feature](https://the-brandidentity.com/insight/meet-endless-tools-an-online-3d-design-tool-that-skips-the-setup-and-gets-straight-to-the-good-part) |
| **ContentCore** (`contentcore.xyz`) | Browser 3D **video mockup** generator — turns a static screenshot into a 4K `.mp4`/`.webm` (device-mockup-style camera motion). Free tier is non-commercial; "Creative Pass" unlocks pro use. Awwwards Honorable Mention site. | **No MCP found.** | n/a | [contentcore.xyz](https://contentcore.xyz/), [Awwwards feature](https://www.awwwards.com/inspiration/contentcore-a-radical-new-way-to-create-videos-contentcore-xyz) |
| **Unicorn Studio** (`unicorn.studio`) | No-code WebGL editor → 38 KB embed for Framer/Webflow/anywhere. Stacking layered shaders/3D/text scenes. Exports image, video, or embed. | **No MCP found.** Embeds via SDK script tag. | n/a | [unicorn.studio](https://www.unicorn.studio/), [Embed guide](https://www.unicorn.studio/docs/embed/) |
| **Blender** | Desktop 3D suite. Free. | **Yes (community + official partnership).** `ahujasid/blender-mcp` is the original; Anthropic + Blender announced an **official** Claude Blender connector on April 28 2026 (Anthropic also joined Blender Dev Fund as a Corporate Patron). | Local socket; install per repo: `uvx blender-mcp` or follow `github.com/ahujasid/blender-mcp` — server connects to a running Blender instance via Python API. | [GitHub – ahujasid/blender-mcp](https://github.com/ahujasid/blender-mcp), [Blender.org MCP page](https://www.blender.org/lab/mcp-server/), [MindStudio writeup](https://www.mindstudio.ai/blog/claude-blender-mcp-real-world-performance) |
| **Nomad Sculpt** | iPad/Apple-Pencil sculpting app, $14.99 one-time, exports `.glb`/OBJ/STL/PLY. | **No MCP** — it's an iPad app with no public API. | n/a | [nomadsculpt.com](https://nomadsculpt.com/) |
| **Adobe Substance 3D** | Desktop material/texture authoring + sampler. Adobe ID required. | **Yes (community + Adobe API).** Community: `matthieuhuguet/substance-designer-mcp` — controls Substance Designer 15.x via Python 3.12+/`uv`; lets Claude create graphs, wire nodes, generate full PBR materials. Adobe also publishes a hosted Substance 3D API under Firefly Services for backend use. | `uvx substance-designer-mcp` (per repo); Adobe API at `s3d.adobe.io/docs`. | [LobeHub – substance-designer-mcp](https://lobehub.com/mcp/matthieuhuguet-substance-designer-mcp), [Adobe Substance 3D API docs](https://s3d.adobe.io/docs) |
| **Free3D** (`free3d.com` / `free3d.io`) | Library of 100k+ free models in `.gsm/.obj/.3ds`. License varies per model — must check each. | **No MCP.** Manual download. | n/a | [free3d.com](https://free3d.com/) |
| **3DModels.org** | Commercial 3D library since 2005; the largest collection of car models (9k+ vehicles, 700+ brands). Paid; includes conversion/printing services. | **No MCP.** | n/a | [3dmodels.org](https://3dmodels.org/about/) |
| **1MIBA** (`1miba.com`) | English-language Chinese platform (Hefei Yimiba Tech Co., founded 2017). Free 3ds Max / SketchUp / material library + online 3D model converter + AI image search that drops directly into 3ds Max. Useful for the **converter**, less so for the library quality. | **No MCP.** | n/a | [1miba.com about](https://1miba.com/about?type=about), [1miba converter](https://1miba.com/convert.html) |
| **Sketchfab** (`sketchfab.com`) | The big public 3D library. Filterable free + paid, downloadable in `gltf/glb/usdz/source`; Viewer API to embed. | **Yes (community).** `gregkop/sketchfab-mcp-server` — search, view details, download via Claude. Active Jan 2026. Needs `SKETCHFAB_API_KEY`. | `npx -y sketchfab-mcp-server` (per repo) with `SKETCHFAB_API_KEY` env | [GitHub – gregkop/sketchfab-mcp-server](https://github.com/gregkop/sketchfab-mcp-server), [Sketchfab Data API v2](https://sketchfab.com/developers/data-api/v2) |

#### "Spawn" — disambiguation
You said "Spawn" with no context. Five live products in 2026 use that name:
1. **spawn.co** — AI game builder, launched Feb 2026 (text → full Unity-ish game) — [spawn.co](https://www.spawn.co/), [Adam Holter review](https://adam.holter.com/spawn-co-review-the-fast-app-builder-with-hidden-costs/)
2. **spawning.ai** — AI training-data consent / Source.Plus marketplace — [spawning.ai](https://spawning.ai/)
3. **spawn by Sonic Labs** — Web3-app generator (smart contracts from prompt), unveiled at ETHDenver 2026 — [Sonic Labs blog](https://blog.soniclabs.com/sonic-labs-debuts-spawn/)
4. **spawntools.ai** — AI 3D agents/characters — [spawntools.ai](https://www.spawntools.ai/)
5. **Spawn by Lemonaide** — royalty-free MIDI generator — [lemonaide.ai/spawn](https://www.lemonaide.ai/spawn)

**Best guess for our context (real-estate / business landing pages + 3D heroes):** `spawntools.ai` — generates "3D agents and characters" which is the only one that intersects with our asset-factory workflow. None has an MCP. **Flag for clarification — tell us which Spawn you actually meant.**

#### "side spline editor" — disambiguation
No tool sells itself under that exact name. Best guess: you mean **Spline's own browser editor** (the side-panel/scene-graph editor at `spline.design/editor`) — the side panel is where you build the scene graph and edit interactions. The second-best guess is `viewer.spline.design` (Spline Viewer, the public embed page). There is no notable third-party fork of Spline. **Flag for clarification if it was something else.**

### 1.2 Design / color / icons

| Tool | What it is | MCP? | Source |
|---|---|---|---|
| **UIColors.app** | Generates Tailwind 50–950 shades from one hex; export tokens, OKLCH/HEX/HSL, shadcn theme generator, public API (`uicolors.app/api`). | **No MCP.** But has a plain HTTPS API — can be called from Claude Code via `WebFetch`/`curl` with no key. | [uicolors.app/api](https://uicolors.app/api) |
| **Realtime Colors** (`realtimecolors.com`) | Live-preview a color/typography system on a real fake-site layout. Generates text/bg/primary/secondary/accent and shows AA/AAA contrast in green. 100% free, commercial OK. | **No MCP.** Manual web UI. URL params encode the palette → shareable. | [realtimecolors.com](https://www.realtimecolors.com/), [GitHub source](https://github.com/juxtopposed/realtimecolors) |
| **Icons8** | 368k+ SVG icons in 116 styles. | **Yes (official).** Endpoint: `https://mcp.icons8.com/mcp/`. PNG previews free; SVG downloads require paid API key (~$15/mo). | [icons8.com/mcp](https://icons8.com/mcp), [GitHub – icons8/icons8-mcp](https://github.com/icons8/icons8-mcp) |

### 1.3 SEO / research / business

| Tool | What it is | MCP? | Source |
|---|---|---|---|
| **Semrush** | The SEO research platform. Backlinks, keyword volume, KD score, competitor traffic, ad copy. | **Yes (official).** HTTP MCP at `https://mcp.semrush.com/v1/mcp`. Needs a Semrush subscription. Also a community variant `mrkooblu/semrush-mcp`. | [developer.semrush.com – Semrush MCP](https://developer.semrush.com/api/introduction/semrush-mcp/), [Semrush KB](https://www.semrush.com/kb/1618-mcp) |

### 1.4 Site builders / CMS

| Tool | What it is | MCP? | Source |
|---|---|---|---|
| **Webflow** | Visual builder + CMS. | **Yes (official).** Launched Feb 9 2026 with Anthropic. Covers both Data API (CMS, pages, assets) and Designer API (canvas elements / styles / variables — less mature; works alongside the Webflow MCP Bridge App that must be open in the Designer). | [Webflow MCP docs](https://developers.webflow.com/mcp/reference/overview), [GitHub – webflow/mcp-server](https://github.com/webflow/mcp-server) |
| **Trello** | Kanban boards. | **Community only — no official Atlassian one.** Best community option: `delorenj/mcp-server-trello` (46 tools, multi-board). `agrath/Trello-Desktop-MCP` is also active (updated April 2026). | [GitHub – delorenj/mcp-server-trello](https://github.com/delorenj/mcp-server-trello), [PulseMCP listing](https://www.pulsemcp.com/servers/trello) |

### 1.5 The CodeCrafters question

You wrote `codecraters-io`. That GitHub org does not appear to exist. **You meant `codecrafters-io`** — the coding-challenge company that runs "build your own Redis / Git / Shell / Kafka / interpreter / SQLite from scratch". 135 repos.

The org's flagship value for this repo is **`codecrafters-io/build-your-own-x`** — a giant curated index of "build X from scratch" tutorials. Useful when Claude Code needs reference implementations for low-level systems, *not* useful for web/landing-page work directly. Pin it as a reference, not a dependency.

- [github.com/codecrafters-io](https://github.com/codecrafters-io)
- [github.com/codecrafters-io/build-your-own-x](https://github.com/codecrafters-io/build-your-own-x)

If you actually meant a different org, flag it.

### 1.6 JS animation libraries — no MCP needed, prompt patterns instead

These are NPM libraries. Don't wire MCPs for them — Context7 (already in
`STACK.md`) gives Claude live docs for any of them. The pattern below is
what you paste at Claude Code when adding a new effect to one of our
landing pages.

| Lib | When to reach for it | Where it lives in this repo |
|---|---|---|
| **GSAP** | Anything timeline-driven or scroll-driven. ScrollTrigger, ScrollSmoother, SplitText, Flip are all free as of 2024. | `shared/lib.js` — declare a `gsapInit()` helper that registers ScrollTrigger; per-page modules import it. |
| **Lenis** | Smooth scroll. Drop into the `<body>` lifecycle. Plays nicely with GSAP ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`. | `shared/lib.js` boot block. |
| **Three.js** | When `<spline-viewer>` is too heavy or we need code-level control of the scene. | `archetypes/04-3d-spline-webgl/` already wires Spline; a sister `04b-threejs/` archetype if we ever need code-rendered. |
| **Anime.js** | Lightweight UI micro-animations where GSAP is overkill (count-up, simple stagger). | Per-page only — don't load it when GSAP is already on the page. |
| **Barba.js** | Page-to-page transitions in multi-page sites without a SPA rebuild. | `shared/lib.js` — opt-in flag per archetype; only DJ Reno-style multi-page projects need it. |

**One-shot prompt template (paste into Claude Code) for any animation work:**

```
We're on archetype <id> in /home/user/reference-sites. The hero section
needs <describe motion>. Stack rule: GSAP for timeline + scroll, Lenis
for smooth scroll, Anime.js only if GSAP isn't already loaded on this
page. Three.js only if @splinetool/viewer can't do it. Use Context7 to
fetch current API before writing code (don't guess GSAP v3 vs v2).
Implement in <page file>, wire the boot via shared/lib.js, and confirm
no double-init across archetypes.
```

There is a community **GSAP MCP** (`mojo-solo/gsap-mcp-server`, also
`vinhnguyen-gsap-mcp`) that bundles preset timelines + ScrollTrigger
recipes. Not necessary if Context7 is already wired — Context7 covers
GSAP docs and the prompt approach above is fine. ([LobeHub listing](https://lobehub.com/mcp/mojo-solo-gsap-mcp-server))

There is a community **Three.js MCP** (`baryhuang/mcp-threejs`,
`locchung/three-js-mcp`) — same verdict: skip until needed; Context7 +
the Sketchfab MCP cover the same ground better. ([GitHub – baryhuang/mcp-threejs](https://github.com/baryhuang/mcp-threejs))

---

## 2. How to add a custom MCP connector (copy-pasteable)

### 2.1 The CLI: `claude mcp add`

Two transports cover ~everything:

**HTTP (remote, vendor-hosted):**
```bash
claude mcp add --transport http --scope project semrush https://mcp.semrush.com/v1/mcp
```

**stdio (local process, usually `npx` or `uvx`):**
```bash
claude mcp add --transport stdio --scope project sketchfab \
  -e SKETCHFAB_API_KEY=<key> \
  -- npx -y sketchfab-mcp-server
```

Rules ([Claude Code MCP docs](https://code.claude.com/docs/en/mcp), [MCPBundles quick ref](https://www.mcpbundles.com/blog/claude-code-mcp-tools)):
- All flags (`--transport`, `--scope`, `-e`, `--header`) go **before** the server name.
- Everything after `--` is the literal stdio command + args.
- `--scope project` writes to `.mcp.json` (committable). `--scope user` and the default (local) write to `~/.claude.json` and don't sync across machines.

### 2.2 The matching `.mcp.json` schema

Already in use at the repo root. The pattern:

```jsonc
{
  "mcpServers": {
    // stdio example
    "sketchfab": {
      "command": "npx",
      "args": ["-y", "sketchfab-mcp-server"],
      "env": {
        "SKETCHFAB_API_KEY": "${SKETCHFAB_API_KEY}"
      }
    },

    // HTTP example
    "semrush": {
      "type": "http",
      "url": "https://mcp.semrush.com/v1/mcp",
      "headers": {
        "Authorization": "Bearer ${SEMRUSH_API_KEY}"
      }
    }
  }
}
```

### 2.3 Env-var substitution

`${VAR}` is the only placeholder syntax `.mcp.json` understands. Our
convention (matches the repo today — see `.mcp.env.example`):

1. Add `<VAR>=` to `.mcp.env.example` with a one-line comment on how to obtain it.
2. Fill the real value in `.mcp.env` (gitignored) **and** in Settings → Environment for the Claude Code web app (the web env does *not* read the local file).
3. Reference it in `.mcp.json` via `${VAR}`.
4. Rotate the key after the session that first used it — this is `MCP-SETUP.md`'s posture and it should stay that way.

### 2.4 Where to find community MCP servers

Verified registries:
- [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) — official reference + index of community servers
- [mcp.so](https://mcp.so) — searchable directory
- [pulsemcp.com](https://www.pulsemcp.com/) — weekly-updated, includes vetting + transport metadata
- [glama.ai/mcp/servers](https://glama.ai/mcp/servers) — listing + sandboxed test runs
- [lobehub.com/mcp](https://lobehub.com/mcp) — large mirror, good search
- [github.com/wong2/awesome-mcp-servers](https://github.com/wong2/awesome-mcp-servers) — community curated list

When in doubt: prefer the official one, then PulseMCP's listing, then check that the underlying repo has commits in the last 60 days.

---

## 3. Spline-specific section

Spline is the workhorse for our 3D heroes (`04-3d-spline-webgl` already
embeds Spline). No usable MCP — operate it by hand or via the Spline AI
assistant inside the editor, then export and commit.

### 3.1 Three production-fit prompts to paste

**A. Real-estate hero — subtle floating object (SathiDeals / Mortgages):**
> A single, calm, photoreal "key" object floating in soft chamber light.
> Matte champagne gold key, brushed metal teeth, subtle motion: gentle
> Y-axis bob (4 s loop), and a 2° tilt that follows cursor X with damping.
> Background: warm off-white #F6F1EA → slight vignette at corners.
> Camera: 35mm equivalent, slight 3° down-tilt, no orbit. Render: GGX
> rough 0.35, soft area light from upper-left, ground bounce. Performance:
> aggressively decimate to under 60k tris, single 1k texture set; target
> mobile-OK at 60fps. Export both the Spline scene URL and `.glb`.

**B. Product showcase — interactive scroll-pinned object (DJ Custom Reno):**
> A miniature isometric kitchen island that rotates 360° tied to page
> scroll position (0–100% scroll → 0–360° Y rotation). Materials:
> brushed walnut counter, matte black faucet, light marble base.
> Interaction: hover any drawer → it slides out 30%. Click → unfolds
> exploded view of cabinetry layers (counter / cabinet / hardware /
> base). Style: clean studio, single soft top light, neutral grey
> ground. Bake AO for mobile. Export to React component (Spline →
> Export → Code → React).

**C. Fully interactive 3D logo (any client landing):**
> Logo wordmark extruded 40px depth in matte black, with a single 20px
> chamfered edge in polished chrome. Idle: slow Y-rotation (12 s/turn).
> On hover: chrome edge brightens (emissive 0.4 → 1.0 over 200 ms) and
> camera dollies in 5%. On click: chrome edge pulses with bloom for one
> beat, then a Spline event fires `cta-click` (we'll listen in JS).
> Background transparent. Performance budget: ≤120k tris,
> single 2k MatCap+normal. Export `.splinecode` + `.glb` fallback.

**Three.js fallback prompt** (when Spline lock-in is undesirable, e.g.
weight or hosting): paste this verbatim into Claude Code:

> Re-implement the scene described in <prompt A/B/C above> as a Three.js
> module under `archetypes/04b-threejs/`. Constraints: r3f + drei + GSAP
> for any tweens, `@react-three/postprocessing` for bloom only. Load the
> `.glb` from `assets/<id>-hero.glb` (we'll commit it). DPR cap 1.5,
> shadow off on mobile, `Suspense` fallback to the static
> `assets/<id>-hero.jpg`. Wire boot via `shared/lib.js`.

### 3.2 Export pipeline (Spline → repo)

Three viable paths, in order of preference for our stack:

1. **Spline-hosted scene + `<spline-viewer>` web component** — simplest.
   ```html
   <script type="module"
     src="https://unpkg.com/@splinetool/viewer@latest/build/spline-viewer.js"></script>
   <spline-viewer url="https://prod.spline.design/<scene-id>/scene.splinecode"></spline-viewer>
   ```
   Pros: real Spline runtime, full interactions, all materials intact.
   Cons: external network dependency, Spline-hosted, larger payload.
   Best for: 04-3d-spline-webgl archetype, where it's already the deal.
   ([@splinetool/viewer on npm](https://www.npmjs.com/package/@splinetool/viewer))

2. **Spline → `.glb` → committed to `assets/<id>-hero.glb`** — owned, but
   GLB export from Spline drops materials and lighting (geometry only —
   you re-apply materials in Three.js / `<model-viewer>`).
   ([Felix Runquist notes on Spline → Three.js](https://felixrunquist.com/posts/creating-3d-models-spline-three-js))
   Best for: when you want zero external dependencies and you're fine
   re-lighting in r3f.

3. **Spline → React component** (`@splinetool/react-spline`) — middle
   ground; ships the scene as a React component pulling from Spline's
   CDN. Best for the Next.js/React lovable-style sites we generate.
   ([GitHub – splinetool/react-spline](https://github.com/splinetool/react-spline))

**Repo convention:** commit one of `assets/<id>-hero.glb` *or*
`assets/<id>-hero.splineurl` (a one-line text file containing the
Spline scene URL). The build's `resolveAsset()` already handles the
fallback chain (svg → jpg → mp4) — extend it to read `.splineurl` and
emit a `<spline-viewer>` tag when present. Until that build extension
lands, hardcode the viewer in the archetype HTML the same way
`04-3d-spline-webgl` does it today.

---

## 4. Recommendation pass

You're on a free-only budget. Three landing-page businesses (SathiDeals
real estate, DJ Custom Reno, Mortgages). Here's the honest cut.

### Wire these — genuinely high leverage

1. **Webflow MCP (official)** — only if you ever take on Webflow
   clients. For owned-code clients we're not touching it. Hold off until
   the first Webflow client appears.
2. **Semrush MCP (official)** — pays for itself on the SEO content for
   SathiDeals (location-keyword research) + Mortgages (rate-related
   keyword volume). Wire once you have a Semrush sub. HTTP transport,
   no local server.
3. **Sketchfab MCP (community)** — drop-in 3D-asset source for the
   3D-hero archetypes. Free key, free models exist. Pairs with the
   Three.js fallback pattern above.
4. **Icons8 MCP (official)** — only if/when icon volume justifies the
   $15/mo. Until then, use Heroicons / Lucide / Phosphor from
   `shared/lib.css` and skip.
5. **Blender MCP** — keep on the shelf. Worth wiring the day you start
   producing custom 3D assets you can't get from Sketchfab/Spline.
   Requires Blender installed locally.

### Skip / redundant

- **Trello MCP** — only if you actually use Trello to manage these
  builds. You're not, today. Skip until you are.
- **Substance 3D MCP** — overkill for landing pages. The PBR material
  problem is already solved by Spline/Sketchfab/Endless Tools materials.
- **Endless Tools / Womp / ContentCore / Unicorn Studio** — these are
  **manual asset factories**, same category as Runable (already
  adopted). Pick **one or two**, not all four. Recommendation:
  - **Keep Runable** (already adopted; phone + cheap) for hero stills + videos.
  - **Add Unicorn Studio** for the one thing Runable can't do —
    embeddable interactive WebGL (38 KB SDK; pairs perfectly with our
    static-HTML deploy).
  - **Try Endless Tools once** for 3D typography in a hero — if it
    earns its keep, keep it; otherwise it duplicates Spline.
  - **Drop ContentCore** unless you specifically need
    device-mockup video. Higgsfield + Pollinations already cover hero
    video.
  - **Drop Womp** — overlaps with Spline + Meshy.ai which we've already picked.
- **Free3D / 3DModels.org / 1MIBA** — only as occasional manual
  fallbacks. License hygiene is per-model; not worth a workflow.
- **All five "Spawn" products** — none fit our pipeline cleanly. Confirm
  which one you meant before we revisit.
- **Spline community MCP (aydinfer)** — explicitly non-operational; ignore.

### Net recommendation

Wire **Semrush + Sketchfab** now (cheapest path to real lift). Add
**Webflow MCP** the day you take a Webflow client. Add **Blender MCP**
the day you need a custom 3D asset. Pick **Unicorn Studio** as the
second asset factory next to Runable. Everything else stays as a
"use the prompt approach, commit the output, no MCP."

---

## Sources (full list)

- Spline MCP (community, archived): https://github.com/aydinfer/spline-mcp-server
- Spline 3D Design MCP listing: https://www.pulsemcp.com/servers/aydinfer-spline-3d-design
- Omma launch: https://updates.spline.design/changelog/meet-omma-create-3d-websites-and-apps-with-ai-agents.
- Omma: https://omma.build/
- Womp: https://www.womp.com/ | https://3dprintingindustry.com/news/womp-launches-ai-platform-for-accessible-3d-model-creation-and-printing-245898/
- Endless Tools: https://endlesstools.io/ | https://the-brandidentity.com/insight/meet-endless-tools-an-online-3d-design-tool-that-skips-the-setup-and-gets-straight-to-the-good-part
- ContentCore: https://contentcore.xyz/ | https://www.awwwards.com/inspiration/contentcore-a-radical-new-way-to-create-videos-contentcore-xyz
- Unicorn Studio: https://www.unicorn.studio/ | https://www.unicorn.studio/docs/embed/
- Blender MCP: https://github.com/ahujasid/blender-mcp | https://www.blender.org/lab/mcp-server/ | https://www.mindstudio.ai/blog/claude-blender-mcp-real-world-performance
- Nomad Sculpt: https://nomadsculpt.com/
- Substance Designer MCP: https://lobehub.com/mcp/matthieuhuguet-substance-designer-mcp
- Substance 3D API: https://s3d.adobe.io/docs
- UIColors.app + API: https://uicolors.app/api
- Realtime Colors: https://www.realtimecolors.com/ | https://github.com/juxtopposed/realtimecolors
- Icons8 MCP: https://icons8.com/mcp | https://github.com/icons8/icons8-mcp
- Semrush MCP: https://developer.semrush.com/api/introduction/semrush-mcp/ | https://www.semrush.com/kb/1618-mcp
- Webflow MCP: https://developers.webflow.com/mcp/reference/overview | https://github.com/webflow/mcp-server
- Trello MCP (community): https://github.com/delorenj/mcp-server-trello | https://www.pulsemcp.com/servers/trello
- Spawn variants: https://www.spawn.co/ | https://spawning.ai/ | https://blog.soniclabs.com/sonic-labs-debuts-spawn/ | https://www.spawntools.ai/ | https://www.lemonaide.ai/spawn
- Free3D: https://free3d.com/
- 3DModels.org: https://3dmodels.org/about/
- 1MIBA: https://1miba.com/about?type=about | https://1miba.com/convert.html
- Sketchfab MCP: https://github.com/gregkop/sketchfab-mcp-server | https://sketchfab.com/developers/data-api/v2
- CodeCrafters: https://github.com/codecrafters-io | https://github.com/codecrafters-io/build-your-own-x
- Claude MCP CLI: https://code.claude.com/docs/en/mcp | https://www.mcpbundles.com/blog/claude-code-mcp-tools
- MCP server directories: https://github.com/modelcontextprotocol/servers | https://mcp.so | https://www.pulsemcp.com/ | https://glama.ai/mcp/servers | https://github.com/wong2/awesome-mcp-servers
- Spline embed (@splinetool/viewer): https://www.npmjs.com/package/@splinetool/viewer | https://github.com/splinetool/react-spline | https://felixrunquist.com/posts/creating-3d-models-spline-three-js
- GSAP MCP: https://lobehub.com/mcp/mojo-solo-gsap-mcp-server
- Three.js MCP: https://github.com/baryhuang/mcp-threejs
- GSAP + Three.js + Barba + Lenis pattern: https://tympanus.net/codrops/2026/03/18/building-seamless-3d-transitions-with-webflow-gsap-and-three-js/ | https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/
