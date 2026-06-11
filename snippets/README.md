# Snippets

Reusable, copy-paste building blocks for the real React client builds
(downstream of `PROMPTS.md`). Not used by the static reference generator —
these are for the Next.js apps (sathideals, etc.) when they go live.

## ScrollHero.tsx — scroll-scrubbed cinematic video hero

A premium hero where scroll progress drives the video playhead (lerped, so
it glides). Drop into a Next.js 14+ App Router + TypeScript + Tailwind app.

### End-to-end recipe

1. **Make the video** (in a session/machine WITH network — the cloud
   `refsites-code` session can't reach Higgsfield or render Remotion):
   - Higgsfield → Seedance 2.0, 16:9, 8s, 1080p.
   - Cinematic prompt: slow drone / push-in camera, golden-hour lighting by
     default, shallow depth of field, anamorphic lens, 24fps film grain,
     no people, no text overlays.
   - **Preview the rewritten prompt before generating** — video gen costs
     real credits (1080p/8s Seedance is not free-tier; budget 3–5 takes to
     get one you like). Never run "generate, no questions."
2. Save the result to `public/hero.mp4` (and a `public/hero-poster.jpg`).
3. Use it as the first section:
   ```tsx
   import ScrollHero from '@/components/ScrollHero'; // copy ScrollHero.tsx here
   export default function Page() {
     return (
       <>
         <ScrollHero src="/hero.mp4" poster="/hero-poster.jpg" heightVh={300} />
         {/* ...rest of the page */}
       </>
     );
   }
   ```
4. `npm run dev`, scroll the hero to test the scrub.

### Why this version (vs the naive spec)

- **Mobile:** iOS Safari throttles `video.currentTime` scrubbing → janky.
  This component detects coarse-pointer devices and smoothly autoplay-loops
  instead. For a true mobile scrub, extract the clip to an image sequence
  and draw to `<canvas>` (or use `requestVideoFrameCallback`).
- **Accessibility:** honors `prefers-reduced-motion` (static poster).
- **Scroll budget:** `heightVh={300}` = three screens before the next
  section. That runs *against* the minimal-scroll goal — reserve this for
  one signature moment per site, not every page (see ARSENAL §9).

### Connecting to this repo's pattern

The static generator's `heroVideoGSAP` already plays an MP4 via
`resolveVideo()` and falls back to a CSS Ken-Burns when none exists. This
ScrollHero is the richer, React-only variant for client builds that want
the scroll-driven playhead.
