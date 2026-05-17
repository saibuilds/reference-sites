# Reference Sites — AI Website Library

Self-contained reference builds of every style/concept in the research library
(`../02-REEL-FINDINGS.md`), so they can be opened side-by-side with the reel
videos to verify the AI website builder produces the right thing.

## What's here

| Set | Count | Path |
|-----|-------|------|
| 12 style archetypes — generic theming | 12 | `styles/` |
| 12 style archetypes — real-estate / reno variant | 12 | `styles-realestate/` |
| 20 reel-specific builds — generic | 20 | `reels/` |
| 20 reel-specific builds — real-estate / reno variant | 20 | `reels-realestate/` |
| Gallery / comparison index | 1 | `index.html` |

**64 builds total.** Zero frameworks — pure HTML/CSS/JS. GSAP, Lenis and
Three.js load from CDN. Shared primitives live in `shared/lib.css` +
`shared/lib.js` (Lenis smooth scroll, GSAP ScrollTrigger parallax, Three.js
wireframe orb, magnetic buttons, 3D tilt cards, scroll reveal, count-to —
faithful to the universal animation library in the research notes).

## Regenerate

Everything is generated from a single spec table so the builds stay faithful
and consistent:

```
node build.js          # emits all 64 pages + manifest.json
node build-index.js    # rebuilds the gallery index from manifest.json
```

Edit the `STYLES` / `REELS` tables in `build.js` to tune any build.

## Compare against the reels

Reel video links are in `../00-REEL-LINKS.md`. Open a build, play the matching
reel, and check hero treatment, palette, type pairing, motion signature and
section pacing. Builds are faithful to the *system*, not pixel-copies of
proprietary footage.

## Deploy

Static site — deploys as-is on Cloudflare Pages (no build command, output
directory = root). `index.html` is the entry point.
