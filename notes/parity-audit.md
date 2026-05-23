# Archetype <-> Reference-Reel Parity Audit

Generated: 2026-05-20
Source: build.js STYLES[] (lines 122-499) vs notes/reel-to-archetype.json
Method: per-archetype delta-E reasoning against named-reel training knowledge
(Cartier, Spline Ice Cube, Coco Veda, terminal-industries.com, Aman, etc.)

| ID | aesthetic-target | palette-verdict | font-verdict | layout-verdict | TOP_FIX |
|----|------------------|-----------------|--------------|----------------|---------|
| 01-luxury-dark | warm champagne gold on matte obsidian, hand-finished horlogerie | match | match | covers | tighten `--card-bd` alpha from .18 to .12 — Cartier card edges are barely-there, current border reads too forensic |
| 02-cinematic-video | Bebas-cap cinematic hero, freight-orange against deep navy-black | drift: should be #0A0E1A bg with accent in #F2A33A-#FF7A1A range | match | covers | drop `--accent` from honey #E6B873 to #FF7A1A — Terminal/Hashgraph reels punch with hot signal-orange, not muted amber |
| 03-dark-brutalist | ALL-CAPS manifesto, hot red on pure black, zero radius | match | match | covers | swap `--accent` #FF2D16 to #FF1F0F (slightly redder, less orange) — Guilty Mind/Sazabi reads pure stop-sign red, current accent skews tomato |
| 04-3d-spline-webgl | Spline Ice Cube cyan glow on deep blue-black, glassy | match | match | covers | bump `--accent` saturation: #5BE0FF -> #7CF7FF and add a magenta secondary (#FF5BE0) — Spline hero relies on dual-tone bloom |
| 05-vaporwave | Sidewave neon magenta + cyan on deep violet, NOT orange | drift: should be #FF2BD6 or #00F0FF accent, not #FF8C00 | drift: try VT323 or Major Mono Display for the marquee | covers | replace `--accent:#FF8C00` with `--accent:#FF2BD6` + `--accent-2:#00F0FF` — current orange reads synthwave-sunset not vaporwave-glow |
| 06-soft-editorial | Maison de Synergy / Bisous bone-cream + warm cocoa serif italic | drift: should be #F5EFE6 bone, not pink-leaning #FAF0EB | drift: try Italiana or PP Editorial New for display | covers | shift `--bg` #FAF0EB (peach) to #F5EFE6 (true oat) and `--accent` #B07D63 to #8C6A56 — reference reads cooler, more atelier-paper |
| 07-saas-glass | JoyJam/Hashgraph violet glass on near-black, glossy PBR sphere | match | match | covers | nudge `--accent` #7B61FF to #8B5CF6 and add subtle `--accent-2:#22D3EE` for the dual-gradient CTAs JoyJam uses |
| 08-architecture-editorial | Fall Line stone/oat editorial, large DM Serif, mute warm gray accent | match | match | covers | warm `--accent` #9B9086 (cool taupe) to #A89376 — Fall Line/Alpine reels lean burnt-sand not cement-gray |
| 09-aviation-luxury | Jesko Jets matte black + warm gold, runway twilight | match | drift: try Cormorant Garamond or GT Sectra for display | covers | swap `disp:'Space Grotesk'` to `'Cormorant Garamond'` — Jesko/VistaJet reels never use grotesk for the wordmark, they use a high-contrast serif |
| 10-food-beauty-dtc | Casper's Caviar / Obsidian Dew matte black + champagne, single-product macro | match | match | covers | raise `--accent` luminance: #B48226 -> #D4A24A — current reads bronze-coin, references read champagne-leaf |
| 11-japanese-web3 | OF Sakazuki amber/orange on warm black, kanji marquee, ritualistic | match | match | covers | switch `body:'Space Grotesk'` to `'Noto Sans JP'` (or pair) so the kanji marquee renders with proper Japanese hinting instead of fallback glyphs |
| 12-experimental-dev | Robert Borghesi / IDOM mono black + hot red, shader playground | match | match | covers | accent fine: tighten `--card-bd` alpha from .26 to .14 — Borghesi cards have hairline borders, current reads neon-card |
| 13-wellness-botanical | Coco Veda 6-chapter film, amber-cream on deep coffee-black, slow serif | match | match | covers | add `--amber-deep:#B8580A` accent variant so the marquee chapter dividers don't all collapse to the single `#e9b26b` gold — film grades shift per chapter |
| 14-cosmic-platform | Starry Labs ephemeris UI, deep space indigo with violet-white star accent | drift: should be #0A0820 bg with accent in #B6A0FF-#E0D4FF range | drift: try Instrument Serif or Cormorant Infant for display | missing: starfield/ephemeris-grid background pattern | swap `disp:'Cormorant Garamond'` to `'Instrument Serif'` and lighten `--accent` #9E8CFF to #C7B8FF — current violet sits too saturated against the dark indigo, references feel more iridescent |
| 15-resort-residences | Aman/Six Senses sand-cream + driftwood bronze, barefoot luxury cream palette | match | match | covers | deepen `--accent` #9C7B4A to #8A6638 — Aman wordmarks read espresso-on-cream, current taupe-bronze loses contrast at small caps |
| 16-terminal-industrial | terminal-industries.com / Linear / Stripe — near-black + signal-orange + acid-green, mono UI | match | match | covers | tighten `--card-bd` to `rgba(255,255,255,.06)` and reduce `--btn-radius` to `0px` — Linear/terminal-industries are flat-edged, current 2px corner softens the industrial read |

---

## Verdict tallies

- **Palette**: 13 match / 3 drift (02-cinematic-video, 05-vaporwave, 06-soft-editorial, 14-cosmic-platform — wait, 4 drift)
- Recount: **12 match / 4 drift** (02, 05, 06, 14)
- **Font**: 12 match / 4 drift (05, 06, 09, 14)
- **Layout**: 15 covers / 1 missing (14 — no starfield/ephemeris pattern)

---

## Top 5 fixes to apply this pass (ranked by delta-E impact)

1. **05-vaporwave `--accent` #FF8C00 -> #FF2BD6 (+ add `--accent-2:#00F0FF`)** — current orange is the single largest aesthetic mismatch in the whole registry; Sidewave is magenta/cyan glow, not synthwave sunset. Highest delta-E gain.
2. **02-cinematic-video `--accent` #E6B873 -> #FF7A1A** — Terminal/Hashgraph reels live on hot signal-orange; the muted honey currently used reads "boutique hotel," not "global logistics OS."
3. **06-soft-editorial `--bg` #FAF0EB -> #F5EFE6 and `--accent` #B07D63 -> #8C6A56** — peach-leaning cream is the giveaway that this isn't Maison de Synergy; true bone/oat plus cooler cocoa accent fixes the whole archetype in one swap.
4. **14-cosmic-platform display font Cormorant -> Instrument Serif + `--accent` #9E8CFF -> #C7B8FF + add starfield bg pattern** — three-axis miss (font, accent, missing pattern); biggest combined drift in the registry. Starry Labs needs the iridescent + grid feel.
5. **09-aviation-luxury display font Space Grotesk -> Cormorant Garamond (or GT Sectra)** — Jesko/VistaJet/NetJets reels universally use a high-contrast serif wordmark; a grotesk display font is the single biggest tell that this archetype is off-reference, even though the palette is correct.
