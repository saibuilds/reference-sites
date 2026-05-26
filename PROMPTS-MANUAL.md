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

## 7. Omma.build
Site/component builder. Use only for inspiration scraping — paste any
exported component into Claude Code and ask:
```
Here's a component exported from Omma. Re-implement it in vanilla
HTML/CSS/JS using this repo's shared/lib.css primitives (sec / wrap /
grid / card / data-reveal). Strip any external font, telemetry, or
3rd-party CDN that isn't already in shared/lib.js. Keep the visual
intent identical but the code must match the repo's conventions.
```

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
