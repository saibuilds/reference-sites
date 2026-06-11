# Network policy & enabling real AI imagery

The reference sites build and ship today with **owned, self-contained SVG
art** (one per archetype, palette-matched, zero external hotlinks). Real
generated photography is **optional** and wired to drop in later with no
code change. This file documents exactly what blocks live generation in
the Claude Code on the web environment and the two ways to enable it.

## What is blocked (verified 2026-05-18)

The web container runs a **restrictive egress allowlist**. Calls to AI
backends are rejected by the environment proxy *before* reaching the
service — `HTTP 403`, body `Host not in allowlist`. This is not an auth
failure; the credentials are never even exercised.

| Host | Used by | Result |
|------|---------|--------|
| `platform.higgsfield.ai` | `higgsfield` MCP | ❌ 403 Host not in allowlist |
| `mcp.fal.ai` | `fal-ai` MCP | ❌ 403 Host not in allowlist |
| `api.replicate.com` | `replicate` MCP | ❌ 403 Host not in allowlist |
| `nanana.app` | `nano-banana` MCP | ❌ 403 Host not in allowlist |
| `registry.npmjs.org` | npm | ✅ allowed |
| `github.com` / `api.github.com` | git / harness | ✅ allowed |

Because every generation MCP server runs **inside this same container**,
it inherits this policy — fixing credentials alone cannot get past it.

## Update — full findings & complete allowlist (verified 2026-05-23)

Exhaustive re-test from `refsites-code` (the cloud session). Expanded
results:

| Host | For | Result |
|------|-----|--------|
| `platform.higgsfield.ai` | Higgsfield (image + Seedance video) | ❌ 403 not in allowlist |
| `mcp.fal.ai` · `fal.run` · `queue.fal.run` · `api.fal.ai` | fal (Flux, Seedance, nano-banana) | ❌ 403 |
| `api.replicate.com` · `replicate.delivery` | Replicate (incl. Hunyuan3D) | ❌ 403 |
| `image.pollinations.ai` · `pollinations.ai` | free image gen | ❌ 403 here (✅ works in the *media* session that made the 15 heroes) |
| `hunyuan.tencentcloudapi.com` | Hunyuan | ❌ 403 |
| `remotion.media` / `www.remotion.dev` | Remotion headless-chromium download | ❌ 403 — so **offline MP4 render also fails here** (npm installs fine; the browser binary can't download; no system chromium) |
| `nanana.app` · OpenAI · Stability · BFL · Runway · Luma · Kling | misc gen | ❌ 403 |
| `generativelanguage.googleapis.com` | Google Gemini | ✅ **reachable** — text works (`tools/gemini.js`). Image models (`imagen-4.0*`, `gemini-2.5-flash-image`, `gemini-3.1-flash-image`) and `veo-*` exist but the key is **free-plan**: Imagen → `400 paid only`, flash-image → `429 quota`. So image/video gen needs **billing enabled** on the key, not a network change. |
| `www.googleapis.com` · `registry.npmjs.org` · `github.com` | Drive API / npm / git | ✅ allowed |

**Net:** the only generation API reachable from this session is Gemini,
and only its *text* tier is usable on the current key. Every image/video
host is blocked. So: imagery + video must be produced in a networked
session (or the env allowlist opened), and the scroll-scrub hero
(`heroScrollScrub` in `build.js`, `snippets/ScrollHero.tsx` for React)
auto-consumes `assets/<id>-hero.mp4` the moment one exists.

### Complete allowlist to add (by capability)

- **Image/video gen:** `platform.higgsfield.ai`, `*.fal.ai`, `fal.run`,
  `queue.fal.run`, `*.fal.media`, `api.replicate.com`,
  `*.replicate.delivery`, `image.pollinations.ai`, `pollinations.ai`
- **Offline video render (Remotion):** `remotion.media`,
  `www.remotion.dev`, `storage.googleapis.com` (Chrome-for-Testing binary)
- **3D:** `api.meshy.ai`, `api.tripo3d.ai`
- **Live-site research / DESIGN.md:** `*.vercel.app`, `drive.google.com`,
  `*.instagram.com`
- **Dev tooling (Context7 MCP):** `context7.com`, `api.context7.com`,
  `mcp.context7.com`

### Gemini billing (the one non-network unlock)

`generativelanguage.googleapis.com` is already reachable. Enable billing
on the `GEMINI_API_KEY` project at <https://ai.dev> and Imagen 4 /
nano-banana / Veo become usable *from this session directly* — no host
allowlisting needed for Google. (Text already works without billing.)

### RESO listings run in the Cloudflare BUILD, not this container

`tools/fetch-listings.js` executes during the Cloudflare Workers Build
(which has its own network), so the RESO host does **not** need this
container's allowlist. Set `RESO_BASE` + `RESO_TOKEN` (or the OAuth2
trio) as **Cloudflare build variables/secrets** and prepend the fetch to
the build command. Full detail in `LISTINGS.md`.

## Config already corrected (in `.mcp.json`)

Verified by reading each installed package's source:

- `higgsfield-mcp@0.2.0` reads `HF_API_KEY` / `HF_SECRET`
  (`src/server.js`). `.mcp.json` now maps
  `HIGGSFIELD_API_KEY → HF_API_KEY`, `HIGGSFIELD_API_SECRET → HF_SECRET`.
  The earlier `HIGGSFIELD_*` names were never read by the package — this
  is why it failed to authenticate in *every* session.
- `@nanana-ai/mcp-server-nano-banana` reads `NANANA_API_TOKEN`
  (a nanana.app reseller token), **not** `GEMINI_API_KEY`. Corrected.

So once the network is opened, the only remaining step is supplying the
real values via **Settings → Environment** (the web runtime does not load
the local gitignored `.mcp.env`).

---

## Path A — generate anywhere, commit the files (no env change)

`resolveAsset()` in `build.js` already prefers a real raster:

```
assets/<id>-hero.jpg | .png | .webp   →  used if present
assets/<id>.svg                       →  fallback (today's default)
```

So generate on **any machine/UI with network** (laptop, Higgsfield/fal
web app, etc.), drop the files in, and rebuild:

```bash
# after placing assets/<id>-hero.jpg files:
node build.js && node build-index.js
git add assets/*-hero.* styles* reels* index.html manifest.json && git commit && git push
```

### Prompts and target filenames (13 archetypes)

| Save as | Prompt (`GEN_PROMPT[id]`) |
|---------|---------------------------|
| `assets/01-luxury-dark-hero.jpg` | Cinematic macro of a haute-horlogerie movement, single warm gold key light on near-black, extreme restraint, museum lighting, no text |
| `assets/02-cinematic-video-hero.jpg` | Wide cinematic aerial of a cargo vessel at dawn, deep teal-black water, warm horizon glow, anamorphic, film grain, no text |
| `assets/03-dark-brutalist-hero.jpg` | High-contrast brutalist photographic abstraction, hard black-and-white diagonal light, raw concrete, single red accent, no text |
| `assets/04-3d-spline-webgl-hero.jpg` | Glossy iridescent 3D abstract render, cyan glass and chrome, soft studio gradient, real-time engine look, no text |
| `assets/05-vaporwave-hero.jpg` | Retro synthwave horizon, large gradient sun behind scanline bands, magenta-to-orange, perspective grid, no text |
| `assets/06-soft-editorial-hero.jpg` | Soft editorial fashion still life, warm sand and cream tones, diffuse window light, slow-fashion calm, no text |
| `assets/07-saas-glass-hero.jpg` | Abstract frosted-glass product UI floating on a violet mesh gradient, soft depth blur, premium SaaS, no text |
| `assets/08-architecture-editorial-hero.jpg` | Moody architectural photograph, concrete and timber against landscape, overcast tonal light, large negative space, no text |
| `assets/09-aviation-luxury-hero.jpg` | Private jet on tarmac at golden hour, low horizon, long vapor trail, warm gold-on-charcoal, no text |
| `assets/10-food-beauty-dtc-hero.jpg` | Luxury single-origin product macro on dark slate, dewy texture, warm amber rim light, editorial DTC, no text |
| `assets/11-japanese-web3-hero.jpg` | Minimal Japanese ink-wash on warm dark paper, single ember-orange gesture, ma negative space, no text |
| `assets/12-experimental-dev-hero.jpg` | Generative shader abstraction, raw red-on-black geometry, terminal aesthetic, experimental dev lab, no text |
| `assets/13-wellness-botanical-hero.jpg` | Soft natural still life of a halved coconut and green botanicals on warm cream linen, diffuse daylight, Ayurvedic wellness, editorial DTC, no text |

### Higgsfield REST recipe (if generating via Higgsfield off-box)

```bash
# auth: id + secret from cloud.higgsfield.ai/api-keys
curl -s -X POST https://platform.higgsfield.ai/v1/text2image/soul \
  -H "hf-api-key: $HF_API_KEY" -H "hf-secret: $HF_SECRET" \
  -H "Authorization: Key $HF_API_KEY:$HF_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"params":{"prompt":"<PROMPT>","width_and_height":"2048x1152","quality":"1080p","batch_size":1}}'
# returns a job_set_id; poll:
curl -s https://platform.higgsfield.ai/v1/job-sets/<job_set_id> \
  -H "Authorization: Key $HF_API_KEY:$HF_SECRET"
```

---

## Path B — reconfigure the web environment (end-to-end here)

When creating/editing the Claude Code on the web environment:

1. **Network policy:** choose a policy that permits outbound to the
   generation host(s) you intend to use, or add to the allowlist:
   - Higgsfield: `platform.higgsfield.ai`
   - fal.ai: `mcp.fal.ai`, `fal.run`, `*.fal.ai`
   - Replicate: `api.replicate.com`, `replicate.delivery`
   - nano-banana reseller: `nanana.app`
2. **Settings → Environment:** set the secrets (names `.mcp.json`
   expects): `HIGGSFIELD_API_KEY`, `HIGGSFIELD_API_SECRET`, and/or
   `FAL_KEY`, `REPLICATE_API_TOKEN`, `NANANA_API_TOKEN`.
3. Start a **fresh session** (a running MCP server does not pick up
   corrected config or new env mid-session).
4. Verify auth with the `mcp__higgsfield__debug_credentials` tool —
   expect `api_key_configured: true`.
5. For each archetype: call `mcp__higgsfield__generate_image` with the
   matching `GEN_PROMPT[id]`, poll `get_generation_status`, download to
   `assets/<id>-hero.jpg`, then `node build.js && node build-index.js`
   and commit. All 66 pages switch to real imagery automatically.

Docs: <https://code.claude.com/docs/en/claude-code-on-the-web>

## Security

Every credential pasted in chat is **compromised** — rotate after use:
- Gemini: <https://aistudio.google.com/apikey>
- Stitch: Stitch → Settings → API key
- Higgsfield id + secret: <https://cloud.higgsfield.ai/api-keys>
