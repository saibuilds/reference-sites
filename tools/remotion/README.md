# Remotion brand-reel renderer

Renders a 5-second cinematic intro **per archetype** to
`assets/<id>-hero.mp4`. Pure code, no API/network needed — output is
deterministic from the archetype's palette + fonts + brand copy.

The reference-site build's `resolveAsset()` already prefers
`assets/<id>-hero.{jpg,png,webp}` over the procedural SVG. Once `heroVideo`
in `build.js` is wired to look for `.mp4` next to the raster, these files
will drop straight into the `02-cinematic-video` archetype + any reel
using it.

## Install + run (in any session with `npm` access — the cloud `npm` is
allowlisted, so this works in `refsites-code` too)

```bash
cd tools/remotion
npm install
node render.js                       # all 15+ archetypes
node render.js 13-wellness-botanical # one
```

Outputs land at `../../assets/<id>-hero.mp4`. Skips existing files.

## Open the live preview while iterating on the composition

```bash
npm run studio
```

Then open `localhost:3000` and pick an archetype's id from the
composition list.

## Where the per-archetype data comes from

`render.js` reads `build.js`, extracts the `STYLES[]` array, and passes
each archetype as `inputProps` into the same Remotion composition
(`HeroReel`). Editing `STYLES[i].vars` / `g.brand` / `g.h1` / `g.kicker`
in `build.js` automatically changes that archetype's reel — no Remotion
edit needed.

To restyle the *reel itself* (animation timing, layout, vignette),
edit `src/HeroReel.tsx`.

## Why this is here

Separate package.json on purpose. The reference-sites root has no
package.json (it's a framework-less static site). Adding Remotion at the
root would pull React + native renderer deps into a project that
doesn't use them. Keeping it under `tools/remotion/` means the static
site stays clean and only sessions that need video rendering install
the deps.
