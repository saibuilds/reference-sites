# BOOTSTRAP.md — start a fresh session here

**Read this whole file. Then read the docs in the order listed. Then act.**

This file is the single paste-target for any new Claude Code session
(either computer) or any new Claude chat that should orchestrate work
on this project. It exists because we now work across two machines and
optionally delegate to a Claude-for-Chrome browser session — and that
only works if every fresh session boots into the same shared context.

---

## 1. The 60-second bootstrap (copy this paragraph into a fresh chat)

> You are continuing work on the `saibuilds/reference-sites` repo,
> branch `claude/setup-mcp-api-keys-t4GTr`. Read `BOOTSTRAP.md` end to
> end, then read in this order: `HANDOFF.md` (latest sync section at
> the top), `STACK.md`, `GHL-PRODUCTION.md`, `ARSENAL.md` (especially
> the Runable + tools-research sections), `notes/tools-research.md`,
> `PROMPTS-MANUAL.md`, `LEARNINGS.txt`. Run `git log --oneline -10` and
> `git status` to see live state. The SessionStart hook in
> `.claude/settings.json` already auto-pulls the branch on every session
> start. After reading, propose the smallest next move that advances a
> business site (DJ Custom Reno is the obvious next build using
> `sathideals/index.html` as template + a before/after slider). Ask
> before doing anything irreversible.

---

## 2. The division of labor (this is the whole architecture)

Three actors. Each does what only it can do.

### a. Claude Code (this CLI / cloud build session)
**Owns:** code, repo, build, deploy. Outbound network is restricted —
generation hosts (Higgsfield platform, fal, replicate, pollinations,
drive.google.com, Instagram, Spline runtime) all `403` from here. So
this session does **not** generate media, does **not** browse, does
**not** touch authed sources.

### b. Claude-for-Chrome (your browser, your machine)
**Owns:** anything that needs a logged-in browser session. Runable
asset generation. Pulling real client testimonials / listings /
brokerage info from authed dashboards. Sketchfab download with
license verification. Cloudflare console clicks. Google Drive
file pulls.
**How to delegate:** paste a task from `PROMPTS-MANUAL.md` § 12 (or
write one in that style) into Claude-for-Chrome. It does the browser
work and commits the result back to this repo on the working branch.
Auto-sync hook then pulls it into the build session.

### c. The user (you)
**Owns:** the decisions only you can make. Which business to build
next. The real copy / services / testimonials (we never invent
these — that's what got the earlier versions stripped). The GHL form
endpoint. The RESO env vars in Cloudflare. The license sign-off on
any 3rd-party model used.

---

## 3. The discipline (non-negotiable)

1. **Never invent business facts.** No fake testimonials, addresses,
   stats, prices, agent bios. Use clearly-marked `[PLACEHOLDER]`s and
   the page stays `noindex` until real content lands. This is the
   rule that the SathiDeals stub's tagline ("only with content that's
   actually ours") is recovering from.
2. **Own the code, don't host on builders.** Custom Next.js / static
   in this repo, deployed via Cloudflare. GHL handles the CRM via
   webhook or embedded form. Same for Webflow / Lovable / Framer /
   Runable site-gen — never the host, only the asset factory.
3. **Premium = taste + attention control, not "more tools".** One
   focal point per screen, one job per section, whitespace = luxury.
4. **`shared/lib.css` + `shared/lib.js` are the design system.** New
   pages reuse them; don't fork them per page. The SathiDeals page is
   the working reference.
5. **Stay on `claude/setup-mcp-api-keys-t4GTr`.** All work, all PRs.
   Don't merge to main without the user explicitly asking.

---

## 4. The current state of play (as of last commit on this file)

| Thing | Where it is |
|---|---|
| Branch | `claude/setup-mcp-api-keys-t4GTr` |
| Draft PR | https://github.com/saibuilds/reference-sites/pull/6 |
| Deploy | Cloudflare Workers — green; preview URL in HANDOFF.md |
| Reference library | 16 archetypes × {generic, real-estate} = 72 pages, complete |
| SathiDeals | premium shell built, marked `[PLACEHOLDER]`s, needs real content + Runable hero + GHL endpoint + RESO env |
| DJ Custom Reno | stub. Next build target. Use SathiDeals as template + add before/after slider |
| My Legal Basement | stub. Needs positioning before content |
| MCPs | 8 servers in `.mcp.json`; secrets per-machine via `.mcp.env` |
| Auto-sync | SessionStart hook in `.claude/settings.json`, pulls every session start on either machine |

---

## 5. The first move template

When the bootstrap is done, the new session should propose one of:

A. **Build DJ Custom Reno** (template: `sathideals/index.html`; new section: before/after slider for reno; same `[PLACEHOLDER]` discipline).

B. **Drop in a Runable hero for SathiDeals** (workflow in PROMPTS-MANUAL.md § 11, browser-delegate version in § 12a) + replace `[PLACEHOLDER]`s with real content the user provides.

C. **Wire a verified MCP** (Semrush or Sketchfab from `notes/tools-research.md` § 1.3 / 1.1) — only on a session with real network + the OAuth flow.

D. **Pull real content** from an authed source via Claude-for-Chrome (PROMPTS-MANUAL.md § 12c) so we can swap out the placeholders on the existing SathiDeals page.

Pick whichever moves a real business outcome forward. If unclear, ask.

— end —
