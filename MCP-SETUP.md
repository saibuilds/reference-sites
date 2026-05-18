# MCP Setup — AI generation servers

`.mcp.json` wires five MCP servers. Every secret is referenced via `${VAR}`
expansion — **no key is stored in a tracked file**. Fill credentials in
`.mcp.env` (gitignored) for local use, **and** add them to your Claude Code
on the web environment variables (a local file is not auto-loaded there).

## Status of each service

| Server | What it gives | Key you gave? | State |
|--------|---------------|---------------|-------|
| `nano-banana` | Gemini 2.5 Flash Image (a.k.a. Nano Banana) | ✅ Gemini key | **Ready** (verify env var name vs package README) |
| `stitch` | Google Stitch — prompt → UI design/code | ⚠️ OAuth token | **Needs real API key** (see below) |
| `fal-ai` | Umbrella host: nano-banana **+ Seedance 2.0** + 1000s | ❌ no `FAL_KEY` | Blocked until `FAL_KEY` set |
| `replicate` | Alt umbrella: Seedance 2.0 = `bytedance/seedance-2.0` | ❌ no token | Blocked until `REPLICATE_API_TOKEN` set |
| `higgsfield` | Higgsfield (Kling 3.0 video/image) | ❌ none | Blocked — needs **id + secret** |

### Nano Banana
Works with the Google AI Studio key (`AIzaSy…`). The official REST path is
`POST generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent`
with header `x-goog-api-key`. The `@nanana-ai/mcp-server-nano-banana` package
is community-maintained — confirm its expected env var (`GEMINI_API_KEY` is
the common one) against its README before relying on it in production.

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
An official MCP + HTTP API exist, but auth needs **both** an id and a secret
from `cloud.higgsfield.ai/api-keys` — you have not provided these yet. The
configured `higgsfield-mcp` package is community-maintained; verify its env
var names against its README once you have credentials.

### D5 Render — not possible
D5 Render is a **Windows-only desktop GPU application** with no public cloud
API and no MCP server. It cannot be wired to Claude Code. The only automation
path is generic Windows GUI automation on a real D5 machine, which is out of
scope for this environment. Treat D5 as a manual desktop step.

## Security

Both keys in this thread are **compromised** (pasted in plain chat). Rotate
them after confirming the servers work:
- Gemini: <https://aistudio.google.com/apikey>
- Stitch: Stitch → Settings → API key

## How to load credentials

**Claude Code on the web:** add each variable in the environment's variable
settings (Settings → Environment). MCP servers read them at launch.

**Local CLI:** `set -a && source .mcp.env && set +a` before `claude`, then
restart so `.mcp.json` is picked up. Verify with `claude mcp list`.
