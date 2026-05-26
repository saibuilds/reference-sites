# Frontend stack + session learnings (relay doc)

> Paste-ready for the other Claude Code session. Covers: modern frontend stack (2026),
> MCP setup, what was learned this session, and pointers to the two master knowledge files.

---

## 0. Source-of-truth files (read these first — they are NOT in this repo)

Two large research files in `C:\Users\Admin\Downloads\`:

| File | Size | What it is |
|---|---|---|
| `web and video sskill backup.txt` | 247KB / 6204 lines | **MASTER_KNOWLEDGE.md** — Parts A–H: web design system (Jerry the Web Dev attention formula, 12 styles, animation code, design tokens), Claude Code impl + CLAUDE.md template, Google Stitch, Nano Banana 2, video pipeline (VEO3, Higgsfield), viral reels (Sai Tiru, Joel Van Beek), 3D generation, pro video editing (DaVinci Resolve nodes) |
| `web automation claude broser to learn rom etc.txt` | 3.4MB | **COMPLETE MASTER PROMPT LIBRARY** — reverse-engineers all 20 reference reels into per-style copy-paste creative-director prompts with full brand specs |

These are the design/prompt foundation. Properly sourced (real creators cited). Use them — don't reinvent.

---

## 1. MCPs to install (user-scoped, one-time)

```powershell
claude mcp add --scope user context7   -- npx -y @upstash/context7-mcp
claude mcp add --scope user playwright  -- npx -y @playwright/mcp@latest
claude mcp add --scope user magic       -- npx -y @21st-dev/magic@latest --api-key=YOUR_KEY
```

- **context7** — live, current docs for any library. Say `use context7` in a prompt → pulls real docs, not stale training data.
- **playwright** — browser automation. The right pick of the three "browser MCP" options (vs BrowserMCP extension-based, vs deprecated Puppeteer MCP).
- **21st.dev Magic** — generate React + Tailwind components from a description. Free tier. Key at https://21st.dev/magic/console.

Verify: `claude mcp list` → all three `✓ Connected`.

---

## 2. Animation library — only ONE right answer in 2026

- "Framer Motion" split from Framer (late 2024), renamed **Motion** (motion.dev).
- React: `npm install motion` → `import { motion } from "motion/react"`.
- Do NOT install `framer-motion` for new code. Do NOT install both.
- **Remotion is separate** — renders MP4 video from React components (`npm install remotion @remotion/cli`). Only if you want video files as output. "Framer Remotion" is not a thing — it's two libraries.

---

## 3. Component libraries — layered stack (pick by use case)

| Layer | What | When |
|---|---|---|
| **shadcn/ui** | Copy-paste primitives (Button, Dialog, Form, Table) on Radix + Tailwind. You own the code. | Dashboards, admin, internal tools (marketplace-command-center). FOUNDATION. |
| **Skiper UI** | Animation-rich components (image trails, marquee, scroll-stacks, 3D scroll) on shadcn + Motion. Copy-paste via shadcn CLI. | Marketing/landing/hero sections (sathideals / mylegalbasement). |
| **21st.dev Magic** | AI-generated bespoke components on demand. | Unique designs not in any registry. |
| **Aceternity / Magic UI** | Other animation registries, same pattern. | Pick ONE — don't sprawl. |

Rule: install shadcn FIRST. Everything else layers on shadcn's `components/ui/` + `cn()` helper + Tailwind config.

**Skiper UI install** (per project, shadcn-style — NOT an npm package):
```powershell
npm install motion clsx tailwind-merge
npx shadcn@latest init                                        # if not already
npx shadcn@latest add https://skiper-ui.com/registry/<component>.json
# 3D components also need:
npm install three @react-three/fiber @react-three/drei
```

---

## 4. New-project install order

```powershell
npx create-next-app@latest            # or vite
npm install motion clsx tailwind-merge
npx shadcn@latest init
npx shadcn@latest add button card dialog form input table
npx shadcn@latest add https://skiper-ui.com/registry/<component>.json   # animation layer
npm install three @react-three/fiber @react-three/drei                  # optional 3D
```

---

## 5. Stitch (Google)

`stitch.design` — AI design tool, free beta. Generates UI screens from prompts, exports to Figma or HTML+CSS. Use for rapid mockups. NOT a runtime library. Flow: idea → Stitch design → export Figma → implement via Magic MCP / shadcn → polish in code. **Never ship Stitch's exported code directly** (pulls Google Fonts + telemetry).

---

## 6. UI/UX "pro max" rules (what actually works)

1. Design tokens first. Colors/spacing/font-scale/radius in `tailwind.config.ts` + CSS vars. Change brand = change tokens, not 50 files.
2. One animation library. Motion only. GSAP only for timelines Motion can't do.
3. Scroll-driven: Motion `useScroll` + `useTransform` replaces 90% of scroll libs.
4. shadcn for structure, Skiper/Aceternity for spectacle.
5. Image-trail / hover-distortion / scroll-stack → pull from registry, never hand-write.
6. `cn()` helper on every component.
7. No arbitrary px (`p-[17px]`) — use the spacing scale (`p-4`, `gap-6`).
8. Dark mode = CSS vars (`--bg`, `--ink`), not `bg-white dark:bg-black` everywhere.
9. Mobile-first; use `@container` queries for component-level responsiveness.
10. Accessibility free via Radix — don't replace primitives with raw `<div>`s.
11. Loading = Suspense + `<Skeleton>`. Never "Loading..." text.
12. Forms = react-hook-form + zod (shadcn default). Not Formik, not raw useState past 2 fields.
13. Icons = lucide-react. Pick one icon set.
14. Fonts = next/font (Next) or @fontsource. Never Google Fonts `<link>` (kills LCP).
15. Verify in the actual browser. Type-check proves correctness, not "looks right."

---

## 7. Hard lessons from THIS session (the painful ones)

**The "invented content" disaster** — an autonomous overnight run built full SathiDeals /
MyLegalBasement / DJ sites across 7 polish passes. Almost all of it was deleted (−13,849 lines)
because every business fact was fabricated: team names, addresses, phones, emails, client
quotes, stats, an entire fake "Sai & Family" umbrella brand. None of it came from the user.

Rules that came out of it:

1. **Content ledger gate.** Before generating any person/address/price/date/stat: did it come
   from the user? If not → `[placeholder]`, never a fabricated fact.
2. **High design + fake content is WORSE than low design + fake content.** Polish lends
   credibility the facts don't deserve.
3. **Cloudflare auto-deploys every push.** No staging. Every push to the branch = production-
   public = instantly indexable. Don't push content that isn't safe for the public.
4. **Pass N+1 compounds a broken foundation.** Verify foundation before iterating.
5. **Three.js Points ≠ 3D.** Real 3D = `.glb` / Spline scene URL / R3F meshes. Don't call
   WebGL particle clouds "3D assets."
6. **Cleanup pattern:** `rm -rf` named files → `git add <each file explicitly>` → commit
   referencing exactly what was removed. NEVER `git add -A` during cleanup.
7. **When cleanup > original mistake, ask first** (nuke-to-stub vs surgical-strip vs delete).

**New build process:**
- Phase 0: content ledger (real vs TBD). TBD stays placeholder.
- Phase 1: design tokens + component shell (real logos, real colors, lorem text).
- Phase 2: integrate user's REAL Spline scene URLs.
- Phase 3: user fills placeholders OR we wait. No filler.
- Phase 4: deploy only after user reviews.

---

## 8. Anti-patterns to call me out on

- Inventing project content when the user hasn't given it.
- Mixing 4 animation libraries because each demo used a different one.
- Hand-rolling components that exist in shadcn or Skiper.
- Adding JSON-LD / SEO / sitemap / about pages before content exists.
- Polishing to "pass 7" before v1 is content-accurate.
