# Higgsfield generation queue — ready to run

Generated: 2026-05-20. Drop each output WebP into `assets/<filename>` after download.

## P0 — Coco Veda 6 chapters (archetype 13)

Aspect: 16:9, 1920x1080, WebP. Style: cinematic film still, 35mm grain, no text.

| File | Prompt |
|---|---|
| `assets/13-ch1-grove.webp` | Coconut grove at first light, slim trunks, soft amber sun through fronds, dewy ground, Kerala-coast feel, cinematic still, no text |
| `assets/13-ch2-reveal.webp` | A single halved coconut on warm cream linen, milk catching a soft window light, macro, ayurvedic-editorial, no text |
| `assets/13-ch3-press.webp` | Hands lowering a stone wheel onto fresh coconut meat, cold-press method, deep shadow + warm rim light, no text |
| `assets/13-ch4-bottle.webp` | Amber-glass bottle of fresh oil on stone counter, hand-written label, side window light, slow-fashion DTC, no text |
| `assets/13-ch5-ritual.webp` | A palm catching warm oil at a private vanity, cream walls, sun-bleached linen, calm ritual moment, no text |
| `assets/13-ch6-bottle-hero.webp` | Hero shot of the amber bottle on rough hand-thrown ceramic, single shaft of late sun, ad-grade product still, no text |

## P1 — Top-5 fixed archetypes hero plates

Aspect: 21:9, 2520x1080. WebP. Replace `artSVG` fallbacks.

| File | Prompt |
|---|---|
| `assets/02-hero.webp` | Wide cinematic aerial of a cargo vessel at dawn, deep teal-black water, hot signal-orange horizon glow, anamorphic film grain, no text |
| `assets/05-hero.webp` | Audio-reactive vaporwave hero, neon magenta and cyan ripples over deep violet, scanline glow, perspective grid, NOT orange, no text |
| `assets/06-hero.webp` | Soft editorial fashion still life on oat-bone linen, warm cocoa accents, diffuse window light, slow-fashion atelier calm, no text |
| `assets/09-hero.webp` | Private jet on tarmac at twilight, low horizon, long vapor trail, warm gold-on-charcoal, serif-editorial mood, no text |
| `assets/14-hero.webp` | Deep-space astrophotograph, faint star field with luminous iridescent violet nebula bloom and thin orbital rings around one bright point, NASA-grade celestial calm, no text |

## P2 — Full 16-archetype set

See `GEN_PROMPT` in `build.js` lines 50-65 for the remaining 11. Run after P0+P1 land.

## Output expectation

After generation, the build picks up `assets/<id>-hero.{jpg,png,webp}` automatically — no code change needed (see `artSVG` fallback note in build.js line 35-43).
