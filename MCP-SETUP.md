# MCP Setup — AI generation servers

`.mcp.json` wires five MCP servers. Every secret is referenced via `${VAR}`
expansion — **no key is stored in a tracked file**. Fill credentials in
`.mcp.env` (gitignored) for local use, **and** add them to your Claude Code
on the web environment variables (a local file is not auto-loaded there).

## Status of each service

| Server | What it gives | Key you gave? | State |
|--------|---------------|---------------|-------|
| `nano-banana` | nanana.app reseller ("Gemini nano banana") | ❌ wrong key type | Needs `NANANA_API_TOKEN` (not a Gemini key) — see below |
| `stitch` | Google Stitch — prompt → UI design/code | ⚠️ OAuth token | **Needs real API key** (see below) |
| `fal-ai` | Umbrella host: nano-banana **+ Seedance 2.0** + 1000s | ❌ no `FAL_KEY` | Blocked until `FAL_KEY` set |
| `replicate` | Alt umbrella: Seedance 2.0 = `bytedance/seedance-2.0` | ❌ no token | Blocked until `REPLICATE_API_TOKEN` set |
| `higgsfield` | Higgsfield (Kling 3.0 video/image) | ✅ id + secret | **Fixed** — wrong env-var names corrected; needs a fresh session |

> **Root cause of "still no Higgsfield in any session".** The package
> `higgsfield-mcp@0.2.0` reads `HF_API_KEY` / `HF_SECRET` (verified by
> reading `src/server.js`). `.mcp.json` had been exporting
> `HIGGSFIELD_API_KEY` / `HIGGSFIELD_API_SECRET`, names the package never
> looks at — so it failed to authenticate in **every** session regardless
> of what was set in Settings → Environment. `.mcp.json` now maps
> `HIGGSFIELD_API_KEY → HF_API_KEY` and `HIGGSFIELD_API_SECRET →
> HF_SECRET`. Set the `HIGGSFIELD_*` vars in Settings → Environment and
> start a **new** session (the running server must restart with corrected
> config). The same audit found `nano-banana` reads `NANANA_API_TOKEN`,
> not `GEMINI_API_KEY` — also corrected.

### Nano Banana
The wired `@nanana-ai/mcp-server-nano-banana` package is **not** a Google
Gemini client. Verified from its source (`dist/index.js`): it requires
`NANANA_API_TOKEN` and calls `https://nanana.app` (overridable via
`NANANA_API_URL`) — a third-party reseller that fronts the "nano banana"
model. A Google AI Studio key (`AIzaSy…`) will never authenticate it; the
server hard-exits with *"NANANA_API_TOKEN environment variable is required"*.

Two paths:
1. **Recommended — drop the reseller, use `fal-ai`.** fal.ai hosts the real
   Gemini 2.5 Flash Image ("nano-banana") model. Set `FAL_KEY`; one key
   also unlocks Seedance 2.0. No nanana.app account needed.
2. **Keep this server** — create an account at nanana.app → API Access →
   generate a token → set `NANANA_API_TOKEN`.

For a direct (no-MCP) call the official Google REST path is
`POST generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent`
with header `x-goog-api-key: $GEMINI_API_KEY`.

### Google Stitch
Google Labs now issues **stable API keys** (Stitch → Settings → API key →
Create key). The value you supplied (`AQ.Ab8RN6…`) is an OAuth/session token,
which is short-lived and likely won't authenticate the API. Generate a real
Stitch API key and replace `STITCH_API_KEY`.

### Seedance 2.0
No standalone Seedance MCP exists. It is reached **through** `fal-ai`
(`bytedance/seedance-2.0/text-to-video`, `/image-to-video`,
`/reference-to-video`) or `replicate` (`bytedance/seedance-2.0`). Set
`FAL_KEY` (recommended) or `REPLICATE_API_TOKEN` to unlock it.

### Higgsfield
Auth needs **both** an id and a secret from `cloud.higgsfield.ai/api-keys`
(both supplied). `higgsfield-mcp@0.2.0` reads them as `HF_API_KEY` /
`HF_SECRET` (confirmed in `src/server.js`: `process.env.HF_API_KEY` /
`process.env.HF_SECRET`, missing → *"Warning: Missing HF_API_KEY and/or
HF_SECRET"* and every call 401s). `.mcp.json` now maps:

```jsonc
"higgsfield": { "env": {
  "HF_API_KEY":  "${HIGGSFIELD_API_KEY}",
  "HF_SECRET":   "${HIGGSFIELD_API_SECRET}"
}}
```

To go green: set `HIGGSFIELD_API_KEY` and `HIGGSFIELD_API_SECRET` in
Settings → Environment, then start a **new** session and confirm with the
`mcp__higgsfield__debug_credentials` tool (`api_key_configured: true`).
Editing config mid-session does not retroactively re-auth the already-
running server — a fresh session is required.

### D5 Render — not possible
D5 Render is a **Windows-only desktop GPU application** with no public cloud
API and no MCP server. It cannot be wired to Claude Code. The only automation
path is generic Windows GUI automation on a real D5 machine, which is out of
scope for this environment. Treat D5 as a manual desktop step.

## Security

Every credential in this thread is **compromised** (pasted in plain chat).
Rotate each after confirming the servers work:
- Gemini: <https://aistudio.google.com/apikey>
- Stitch: Stitch → Settings → API key
- Higgsfield id + secret: <https://cloud.higgsfield.ai/api-keys>

## How to load credentials

**Claude Code on the web:** add each variable in the environment's variable
settings (Settings → Environment). MCP servers read them at launch.

**Local CLI:** `set -a && source .mcp.env && set +a` before `claude`, then
restart so `.mcp.json` is picked up. Verify with `claude mcp list`.
