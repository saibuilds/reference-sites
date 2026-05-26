# Claude for Chrome — project playbook

This cloud session (`refsites-code`) can't browse, generate images, or
touch Cloudflare (network allowlist + no browser tool). **Claude for
Chrome runs in your own browser with your logins**, so it's the right
tool for exactly those gaps. This file makes it work *well* for this
repo: correct setup, the specific tasks to hand it, and reliability tips.

## Setup (one-time)

- **Plan:** any paid Anthropic plan works, but use **Max / Team /
  Enterprise** — those let you pick the model. **Pro is limited to Haiku
  4.5**, which is weaker for design/visual judgement. Free tier can't use
  it.
- **Versions:** Claude Code `v2.0.73+` and the Chrome extension
  `v1.0.36+`.
- **Browser:** Google Chrome or Microsoft Edge (not Brave/Arc/WSL yet).
- Install + enable from the side panel; grant **site-level permissions**
  only for the domains you'll use (below). Manage them in the extension
  settings.
- Setup guide: <https://support.claude.com/en/articles/12012173-get-started-with-claude-in-chrome>
  · docs: <https://code.claude.com/docs/en/chrome>

## What to hand it (the gaps this session can't fill)

Be **logged in** to each target site first — it uses your active session.
Give it **one goal at a time**; narrow tasks are far more reliable than
"do everything."

### 1. Analyze a reference site → DESIGN.md (fixes "make it exact")

> Open `https://coco-veda.vercel.app/`. Extract its design system:
> background/text/accent colors as hex, heading + body fonts, the exact
> section order top-to-bottom, spacing rhythm, and any signature motion
> (scroll, hover, video). Write it as a DESIGN.md and save it to
> `notes/coco-veda.design.md` in the `saibuilds/reference-sites` repo on
> branch `claude/setup-mcp-api-keys-t4GTr`. Don't invent — only report
> what's actually on the page.

(Then the cloud session reads that file and tunes the matching archetype
precisely. Same flow for any Awwwards winner or competitor site.)

### 2. Generate hero images / video → commit to assets/

> In the Higgsfield (or fal.ai) web app I'm logged into, generate one
> image per prompt in `GEN_PROMPT` from `build.js`. **Show me the
> rewritten cinematic prompt before each generation** (don't auto-spend
> credits). Download each as `assets/<id>-hero.jpg`. For the cinematic
> archetype, also generate an 8s Seedance video → `assets/02-cinematic-
> video-hero.mp4`. Commit to the branch. `resolveAsset()` /
> `resolveVideo()` pick them up automatically on the next build.

### 3. Configure Cloudflare (env the cloud session can't set)

> Open the Cloudflare dashboard → `reference-sites` Workers project.
> Under **Build configuration → Variables & Secrets**, add: `RESO_BASE`,
> `RESO_TOKEN` (and `HIGGSFIELD_API_KEY` / `HIGGSFIELD_API_SECRET` if
> wanted). Set the **build command** to
> `node tools/fetch-listings.js && node build.js && node build-index.js`.
> Then trigger a deploy and report the production URL + whether it's
> green. (Pause and show me before saving secrets.)

### 4. Visual QA the deployed site

> Open `https://reference-sites.rajsharma2234567.workers.dev` (and a few
> archetype pages). Screenshot each, scroll through, and report anything
> broken, mis-aligned, or off-brand vs the reference. Check mobile width.

## Reliability tips

- **One goal per task.** Chain later; don't front-load.
- **Record-a-workflow** for repetitive jobs (e.g. generate+download all
  16 heroes) — teach it once, replay.
- **Schedule** recurring jobs (e.g. weekly listings refresh check) if
  useful.
- **Pin context:** always include the repo + branch in the task so its
  commits land in the right place.
- **Verify:** it can misreport an action. Check the actual file/commit/
  dashboard after, especially for #2 (credits) and #3 (secrets).

## Security

- Grant site permissions **only** to the domains you're actively using
  (Higgsfield, fal, Cloudflare, the reference sites). Revoke afterwards.
- For sensitive surfaces (Cloudflare secrets, email, anything with
  billing), keep it in **review/confirm** mode — make it show you each
  action before it runs. Don't give a "no questions, just execute"
  instruction on those.
- Treat any token it surfaces as sensitive; don't let it paste secrets
  into pages or chats.
