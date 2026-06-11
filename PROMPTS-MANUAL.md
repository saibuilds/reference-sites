# PROMPTS-MANUAL.md — paste-ready prompts for the tools without MCPs

For every tool we use that has **no working MCP** (see `notes/tools-research.md`),
this file gives you a paste-ready prompt to drop into the tool itself
**or** into a Claude Code / Claude-for-Chrome session on your other
computer. Every prompt is tuned to our project context: GTA real-estate
landing pages (SathiDeals), renovation/cabinets (DJ Custom Reno), and
mortgages / legal basement (My Legal Basement & Garden Suite).

Conventions used below:
- `<<SUBJECT>>` = swap with your real subject (a cabinet, a house, a logo, …)
- `<<BRAND>>` = swap with the business name (SathiDeals / DJ Custom Reno / …)
- `<<PALETTE>>` = swap with your final palette (e.g. "warm gold #C9A96E on near-black #0b0b0d")
- Output destination is always: download → commit to `assets/<slug>-hero.{jpg,mp4,glb}` in this repo. The build picks them up automatically.

---

## 1. Spline (spline.design) — 3D hero scenes
**Use:** open spline.design, hit "Create new scene", paste the prompt into
the AI assistant (or use it as your own brief). Export as `.glb` or
publish-link. Then either embed via `<spline-viewer url="...">` or commit
the `.glb` to `assets/`.

### 1a. Real-estate hero — subtle floating object
```
Build a single-object Spline scene for a luxury real-estate landing page.
Subject: a soft architectural form — a chamfered glass cube, frosted,
floating slightly above a thin gold ring on a dark stage. Camera locked,
slow continuous orbit (0.05 rad/s). Soft HDRI lighting, warm rim light
from upper-right, gentle floor reflection. No text, no UI, no people.
Background fully transparent. Optimise for web: under 2MB glb, no
heavy textures.
```

### 1b. Product showcase (renovation / cabinetry)
```
Spline scene for a custom-cabinet showcase. Subject: a single
walnut-veneer cabinet door with brass pull, lit cinematically against
soft charcoal. Slow scroll-driven rotation (45° total), shallow depth
of field, materials accurate to real walnut grain. No text, no people,
transparent background. Export glb, target <3MB.
```

### 1c. Interactive 3D wordmark
```
Spline 3D wordmark for "<<BRAND>>". Heavy serif letterforms, beveled
edges, brushed metal material with a hint of warm gold tint. Letters
react to cursor — subtle parallax tilt, max 6 degrees. Slow ambient
rotation when idle. Transparent background, web-optimised glb.
```

### 1d. The "what Claude Code should do with the export" follow-up
Paste this into Claude Code after you've committed the glb / saved the scene URL:
```
A new Spline scene is ready at assets/<<SLUG>>-hero.glb (or the
published URL: <<URL>>). Wire it into <<PAGE>> as the hero visual,
using @splinetool/viewer via CDN (<spline-viewer url="...">) with
loading="lazy" and a poster fallback for prefers-reduced-motion. Keep
the existing hero scrim and copy intact. Match the SathiDeals shell's
graceful-fallback pattern (onerror remove).
```

---

## 2. Womp (womp.com) — soft-3D / clay
Use Womp for puffy "clay" shapes (good for playful brand accents, not
for real-estate). Paste into Womp's UI brief field or as your own
mental brief:
```
Womp clay scene: a single rounded form — a soft pillow-cube with one
bevelled corner, matte cream finish, lit from above-left, sitting on a
neutral cream ground. No background. Export as png at 1600x1000 with
transparent bg and as glb. Target use: secondary visual on a wellness
landing page, must read as "calm + premium" not "toy".
```

---

## 3. Nomad Sculpt (iPad)
Best for hand-sculpted one-offs. Use it manually; export glb. Reference brief:
```
Sculpt a single anatomical or organic form for a hero visual:
<<SUBJECT, e.g. an abstract leaf, an architectural keystone>>.
Polycount target: under 30k tris. Retopo with the built-in remesher.
Bake a single PBR material (base + roughness only). Export glb to
desktop, then commit to the repo's assets/.
```

---

## 4. Adobe Substance 3D — textures
For real-world materials on a Spline / Three.js mesh. Brief:
```
Substance 3D Painter / Sampler brief: produce a single PBR material
set (basecolor, normal, roughness, metallic, height) at 2K for
<<MATERIAL, e.g. walnut veneer with brass inlay, brushed dark steel,
warm travertine>>. Tileable, no logos, neutral lighting reference,
export as a GLTF-ready zip.
```

---

## 5. EndlessTools.io
Generative pattern / shape tool. Brief:
```
Endless Tools brief: generate a single seamless background pattern at
3000x2000, monochrome with subtle gold accent (#C9A96E), low-contrast
so it sits under heading type without competing. Output PNG.
Use case: section-break decoration on a real-estate landing page.
```

---

## 6. ContentCore.xyz
AI content/asset platform — use as a fallback for stock photography
or stylized hero plates if Runable + Pollinations don't suffice. Brief:
```
ContentCore brief: a single editorial photograph, 1600x1000, of an
empty premium living room interior at dusk — large window with city
skyline visible, warm lamp glow, neutral linen sofa, no people, no
text overlays. Cinematic colour grade. Output JPG.
```

---

## 7. Omma.build — the "section/idea generator" (50 free code generations/month)

**Verified May 2026** (omma.build/pricing): the **Free** plan is permanent,
**50 credits/month**, **no credit card** required, and covers **full code
generation** (HTML / CSS / JS). What's locked behind paid: image gen, 3D
model gen, and custom domain. **No MCP exists** — manual usage only.

> Heads-up: if you'd heard "20 free" — that's outdated. It's 50/month
> right now. More headroom than expected.

### How to use Omma WITH our architecture (the smart way)
- ✅ Use Omma's free credits as a **section / idea generator** — generate
  code-only section variants, then port them back into our pages using
  `shared/lib.css` primitives.
- ❌ Don't use Omma to host the actual sites (custom domain is paid; we
  own the code in this repo anyway).
- ❌ Don't burn free credits on image / 3D generation — those need the
  paid plan and we have Runable + Spline for those.

### Signup (60 seconds)
1. Open `https://omma.build` → "Sign up" (Google OAuth or email).
2. The Free plan auto-applies. 50 credits reset monthly on signup date.
3. Each generation consumes a variable number of credits — text-light
   code generations cost least. Stick to code-only requests on free.

### Credit budget plan — finish all three sites with ~40 of 50 free credits
Eight prompts, ~3-6 credits each, leaves ~10 credits for retries/refines.
After each generation: click Omma's "Code" / "Export" → copy the result
→ paste into Claude Code with **the port-back prompt** at the end of
this section. Claude Code rewrites it onto our `shared/lib.css`
primitives, our palette variables, and our `[PLACEHOLDER]` discipline.

#### A. SathiDeals — listing-card showcase (alt to current placeholders)
```
Build a single page section: a responsive 3-column grid of premium
real-estate listing cards. Each card: 4:3 image area at top, gold price
in a serif font, two-line address, one line of "beds · baths · sqft"
metadata, neighbourhood line, subtle "View listing →" link. Dark
background near-black, warm gold accent. Cards lift on hover. Pure
HTML + CSS, no images, no JS frameworks. Use CSS custom properties
for colors. Mobile = 1 column.
```

#### B. SathiDeals — split-hero alternative
```
Hero section, full viewport. Left half: vertical type stack — small
all-caps eyebrow, oversized serif headline (italic accent on one
word), single-line subhead in sans, two CTAs (primary filled + ghost
link). Right half: a single tall image slot, subtle inner shadow,
optional thin gold corner accent. Dark theme, near-black bg, warm
ivory text, gold accent. Pure HTML + CSS. Use CSS variables for
palette. No JS.
```

#### C. DJ Custom Reno — horizontal scroll project gallery
```
Section: a horizontally-scrolling gallery of project cards
(scroll-snap mandatory). Each card: 3:4 vertical image area, project
type tag in uppercase tracking-wide above title, large serif project
title, one-line meta (neighbourhood · year). Walnut+ivory+bronze
palette via CSS variables. Mobile: same horizontal scroll, native
inertia. Pure HTML + CSS, no JS, no images.
```

#### D. DJ Custom Reno — vertical timeline process
```
"How it works" section: 4 steps as a vertical timeline. Each step:
left column = step number in serif (01-04) with a bronze accent line
running vertically connecting them, right column = step title (sans
600) + 1-2 line description. Walnut + ivory + bronze palette. Mobile
collapses to single column, accent line straightens. Pure HTML + CSS,
no JS, no images.
```

#### E. My Legal Basement & Garden Suite — full landing page
```
Single-page landing for a Toronto-area consulting/contracting service
that turns basements and garden suites into legal rental units.
Sections in order: nav, hero with one focal headline + two CTAs,
trust strip (areas served marquee), "what we do" (3 services: legal
basement, garden suite, permit handling), "how it works" (4 steps),
estimated-cost band with simple input fields (sq ft, finish level
dropdown), recent projects grid (3 cards), FAQ (5 items),
contact form, footer. Mid-century-modern + warm palette: deep
charcoal, cream, brick-red accent. Pure HTML + CSS only — minimal
inline JS for the FAQ accordion. No images, use CSS gradients for
visual interest. CSS variables for palette.
```

#### F. My Legal Basement — interactive cost calculator
```
Standalone interactive section: a basement-build cost estimator.
Inputs: square footage (number), finish level (basic / standard /
premium — radio buttons), include permit help (checkbox). Live total
updates as you type/select. Output: a big serif estimated range
("$XX,XXX – $YY,YYY"), small disclaimer, "Get a real quote" CTA.
Vanilla JS, no frameworks. Numbers should be configurable via
data-* attributes on the section so we can tune them later. Use CSS
variables for palette. Mobile responsive.
```

#### G. Universal before/after slider — alt implementation
```
Before/after image comparison section with a centered draggable
divider. Pointer + touch + keyboard (arrow keys) support. Two image
slots that fall back to colored placeholders (CSS gradient) if the
src is missing. "Before" label top-left, "After" label top-right
with accent color. Pure HTML + CSS + vanilla JS, no frameworks.
~80 lines max.
```

#### H. Universal animated footer
```
Dark 4-column footer with: column 1 = serif brand mark + one-line
description, column 2 = nav links (5), column 3 = contact (phone,
email, address), column 4 = small newsletter / quick-contact field
+ social row. Above the columns: a thin marquee strip of service-area
names that scrolls slowly. Below the columns: fine print + © year.
Subtle hover underline on links, accent-colored on hover. Pure HTML
+ CSS only, no JS. CSS variables for palette.
```

### Port-back prompt (paste into Claude Code after each Omma export)
```
Here's an Omma export. Port it into <<TARGET FILE>> using this repo's
`shared/lib.css` primitives (`sec` / `wrap` / `sec-head` / `grid` /
`g3` / `card` / `eyebrow` / `lead` / `data-reveal` /
`data-reveal-d` / `magnetic` / `tilt`). Strip any external font, CDN,
or telemetry that isn't already in `shared/lib.js`. Replace any
hard-coded color with our existing CSS variables (`--bg --fg
--accent --surface --card --card-bd`). Keep the visual intent and
any new interaction logic. All business-specific copy stays as
[PLACEHOLDER] — do not invent client names, addresses, prices, or
stats. Show me a diff before writing.

----- Omma export below -----
<<paste the Omma HTML/CSS/JS here>>
```

### Net plan to "finish all sites with the free credits"
| Site | Use credits for | Expected outcome |
|---|---|---|
| `sathideals/` | A + B | Replace listing placeholders with richer cards; optional split-hero variant ready if you want a different mood |
| `dj/` | C + D | Horizontal project gallery + a refined timeline alternative to the current grid steps |
| `mylegalbasement/` | E + F | Full premium landing (currently still a stub) + an interactive cost calculator — the biggest single jump in completeness |
| All three | G + H | Slider + footer pattern alternates available for either site if the current versions need refreshing |

Once ported back, every gain stays in this repo (`shared/lib.*` +
business folder) — Omma was just the idea sketcher. The free 50
credits/month is renewable, so you can keep using it as we build out
later pages.

---

## 8. Sketchfab.com — free 3D model search
While the Sketchfab MCP isn't wired yet, this is the manual workflow.
Open sketchfab.com and run searches like:
```
search terms:
  "modern house glb low poly"     license: CC Attribution
  "luxury cabinet 3d glb"         license: CC0 (no attribution required)
  "interior living room glb"      license: any download-allowed
filter: downloadable, glb format, polycount < 50k
```
Pick a model, **read the license**, download glb, commit to
`assets/<slug>-3d.glb`, then in Claude Code:
```
Embed assets/<<SLUG>>-3d.glb in <<PAGE>> using <spline-viewer> or
@google/model-viewer (whichever is already in shared/lib.js). Add
loading="lazy" + the credit string the Sketchfab license requires
into the page footer.
```

---

## 9. Free3D / 3DModels.org / 1MIBA
**Licensing is per-model.** Use only when you've personally verified
the model's licence. Search workflow:
```
On free3d.com / 3dmodels.org / 1miba.com, search:
  "<<SUBJECT>> glb"
filter: free + commercial use allowed
download the glb (NOT the proprietary .max / .blend), verify the
licence file, commit to assets/, and credit per its terms in the
footer.
```

---

## 10. UIColors.app + Realtime Colors — palette builders
Manual but fast. Use either to lock the final palette before the next
build. Reference brief (paste into UIColors / Realtime Colors brief
field, or treat as your own checklist):
```
Goal: a 6-stop palette for <<BRAND>>.
  - bg     : near-black, #0b0b0d-ish but tunable
  - fg     : warm off-white, #f4f1ea-ish
  - accent : warm gold or muted brass (one accent only, never two)
  - surface: 8-12% lighter than bg
  - card   : translucent fg at ~4%
  - border : translucent fg at ~12%
Pass WCAG AA on the fg/bg pair at minimum, AAA preferred.
Pin the hex values into the repo's :root in sathideals/index.html
(or dj/, mylegalbasement/).
```

---

## 11. Runable (runable.com, your phone) — the cheap-media asset factory
This is the canonical media path documented in ARSENAL.md. Step-by-step:

```
PHASE 1 — generate the hero image
1. Open Runable app or runable.com on your phone.
2. Open the Image tab.
3. Photograph or upload a reference (a real subject for product;
   a similar mood image for real-estate).
4. Paste prompt (image):
     "<<SUBJECT>>, 3D-style product render, photoreal lighting,
      1600x1000, pure white background, soft shadow, premium feel,
      no people, no text, no UI overlays."
5. Download the result.

PHASE 2 — animate it into a hero video
6. Open the Video tab in Runable.
7. Upload the image you just generated.
8. Paste prompt (video):
     "Slow gentle camera push-in, 8 seconds, anamorphic lens feel,
      shallow depth of field, ambient micro-motion, no people, no
      cuts, no text, no UI."
9. Download the mp4.

PHASE 3 — wire it into this repo
10. Commit:  assets/<<SLUG>>-hero.jpg + assets/<<SLUG>>-hero.mp4
11. Push.  The build (or static page that already references
    ../assets/<<SLUG>>-hero.*) lights up automatically.
```

Follow-up prompt for Claude Code on the build side:
```
A new hero pair landed at assets/<<SLUG>>-hero.jpg (+ .mp4). Confirm
the matching page references the path correctly, verify the graceful
fallback still works if the file is missing, and rebuild any
generated pages that consume it (node build.js if relevant).
```

---

## 12. The "delegate to Claude-for-Chrome" prompts (browser tasks)
For things this Claude Code session physically can't do (browse, log
in to gen tools, grab content from the open web), drop these into
Claude-for-Chrome on your machine. See BROWSER.md for the full
delegation playbook; these are the high-frequency ones.

### 12a. Generate + commit a SathiDeals hero
```
TASK: open runable.com on this browser (I am logged in). Generate a
1600x1000 hero image for a luxury Greater Toronto Area real-estate
brand: dusk skyline of a generic premium neighbourhood, warm window
light, no people, no text. Then animate it into an 8-second mp4 with
a slow camera push-in. Download both files.

Then commit them to the saibuilds/reference-sites repo at
assets/sathideals-hero.jpg and assets/sathideals-hero.mp4, on branch
claude/setup-mcp-api-keys-t4GTr. Push and confirm the Cloudflare
deploy completes green.
```

### 12b. Grab a real Sketchfab model for DJ
```
TASK: on sketchfab.com, find a free, commercial-use, downloadable glb
of a walnut kitchen cabinet (polycount < 50k). Verify the licence.
Download the glb. Commit it to saibuilds/reference-sites at
assets/dj-hero-3d.glb on branch claude/setup-mcp-api-keys-t4GTr.
Note the licence + attribution string in the commit message.
```

### 12c. Scrape real content (when the user is ready)
```
TASK: open the user's real-estate listing portal / brokerage CRM and
collect: agent bio, contact phone, contact email, brokerage name and
RECO registration string, current testimonials (real client quotes,
attributed). Paste the structured result back into the Claude Code
session — do NOT commit invented data.
```

---

## 13. Mini index — which prompt to grab when

| Need | Prompt # |
|---|---|
| Real-estate hero, abstract object | 1a |
| Cabinet showcase | 1b |
| 3D wordmark | 1c |
| Cheap hero image + video (the workflow) | 11 |
| Palette lock | 10 |
| Free 3D model from Sketchfab | 8 |
| PBR material set | 4 |
| Browser-driven asset generation + commit | 12a–12c |

— end —
