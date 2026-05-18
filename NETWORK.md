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
