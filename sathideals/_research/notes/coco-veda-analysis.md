# coco-veda.vercel.app — reverse-engineered

Source: live fetch 2026-05-20. HTML 48 KB, CSS 13 KB (tailwind+custom).
Saved at `coco-veda/index.html` and `coco-veda/styles.css`.

## Stack
- **Framework**: Next.js 14 app router (`/_next/static/chunks/app/page-*.js`, `__next_f.push` hydration bootstrap).
- **CSS**: Tailwind v3.4.4 + ~25 custom utilities (scrim-*, marquee-mask, text-plate, font-display, font-numeral, shimmer, hairline).
- **Fonts**: Fraunces (variable, opsz/SOFT/WONK axes) for display/italic/numerals; Inter for body; JetBrains Mono for mono labels.
- **Bundle is small** — single page-*.js (~100 KB). No GSAP/Lenis/Three import found in chunk names. Scroll-driven animations done with native `window.scroll` listener + transform/opacity on inline-style elements. The `style="opacity:0"` on every chapter wrapper is the GSAP-less proxy — JS toggles based on scroll progress.

## Palette tokens (verbatim from CSS)
```css
--bg:#050302
--cream:#f4e6cf
--gold:#e9b26b
--amber:#de7c0d
```
Tailwind aliases: `coco-black=#050302`, `coco-cream=#f4e6cf`, `coco-gold=#e9b26b`, `coco-stage=#050302`.

## Page structure (in document order)
1. **Stage canvas** — `<canvas class="fixed inset-0 z-0">` fills viewport, bg `#050302`. (Idle in HTML, JS likely draws a slow grain/orbs animation.)
2. **Loading overlay** — z-50, "COCO Vēda" wordmark + thin horizontal progress bar 224px + "Loading film · 000%" counter. Removes when scroll begins.
3. **Six fixed chapter overlays** (z-20, `pointer-events-none`), each `absolute inset-0 h-screen w-screen` with `opacity:0;will-change:opacity`. Crossfades driven by scroll.
   - **Chapter I — prologue**: marquee top, big H1 "A film about / oil." (italic word "oil."), bottom-right text-plate "Six frames. One coconut..." + "I — A FILM IN SIX CHAPTERS".
   - **Chapter II — The Grove**: giant numeral "01" top-right (font-numeral, 28vw, cream/10), H1 "Picked at the / perfect moment." (italic "perfect"), bottom-left text + coords "10°31′N · 76°10′E · HARVEST 04:30".
   - **Chapter III — The Reveal**: numeral "02" top-left, H1 "Split open. / Nothing added." (italic "Nothing"), aligned right.
   - **Chapter IV — The Press**: marquee, numeral "03" top-right, H1 "One press. / No heat. No haste.", aligned left.
   - **Chapter V — The Bottle**: numeral "04" top-left, H1 "Liquid gold, / sealed in glass." (italic "gold,"), aligned right.
   - **Chapter VI — Available Now**: marquee top, centered "Pure. / Pressed once. / Yours." (italic "Yours."), "₹ 1,490 · FREE SHIPPING ABOVE ₹ 2,000".
4. **Sticky header** (z-30, pointer-events-auto, `fixed top-0`): COCO Vēda wordmark + nav (Story/Process/Journal/Shop) + "Buy · ₹1,490" gold-outline pill.
5. **Left chapter rail** (z-30, `fixed left-6 top-1/2 -translate-y-1/2 hidden md:block`): vertical stack of I-VI Roman numerals with 6×24px hairline between each; active = gold, inactive = cream/30.
6. **Right vertical credit rail** (z-30, `writing-mode:vertical-rl;transform:rotate(180deg)`): "A Film By Coco Vēda · MMXXVI".
7. **Bottom scroll progress** (z-30): `01 / 06` ··· hairline 1px with gold fill ··· `00%`.
8. **Scroll hint** (`fixed bottom-16 left-1/2`): "Scroll to begin" + shimmering vertical 40px hairline.
9. **700vh spacer** (`<div style="height:700vh" aria-hidden>`) — gives 6 chapters × ~100vh of scroll distance.

## Key custom CSS (already extracted)
```css
.text-plate{background:rgba(5,3,2,.42);backdrop-filter:blur(14px) saturate(120%);border:1px solid hsla(37,63%,88%,.06);border-radius:2px}
.scrim-bottom{background:linear-gradient(0deg,rgba(5,3,2,.92),rgba(5,3,2,.4) 30%,rgba(5,3,2,0) 70%)}
.scrim-left/right/top — analogous
.marquee-mask{-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.font-display{font-family:Fraunces;font-variation-settings:"opsz" 144,"SOFT" 50,"WONK" 0}
.font-display-italic{font-family:Fraunces;font-style:italic;font-variation-settings:"opsz" 144,"SOFT" 100,"WONK" 1}
.font-numeral{font-family:Fraunces;font-variation-settings:"opsz" 144,"SOFT" 0;font-feature-settings:"lnum","tnum"}
@keyframes marquee{0%{transform:translateZ(0)}to{transform:translate3d(-25%,0,0)}}
@keyframes shimmer{0%,to{opacity:.55}50%{opacity:1}}
@keyframes hairline{0%{transform:scaleY(.2)}50%{transform:scaleY(1)}to{transform:scaleY(.2)}}
```

Marquee animation `50s linear infinite` driving 4× duplicated chip strip translated -25%.

Per-letter text reveal: each character wrapped in `<span class="inline-block">` with `transform:translate3d(0,110%,0);opacity:0`. JS bumps to `translate3d(0,0,0);opacity:1` stagger when its parent chapter enters.

## How to replicate in build.js
Add a new section renderer `heroCinematicFilm(x)` that emits, in order:
1. `<canvas class="cv-stage">` fixed background, with a small inline JS that draws slow gold-particle drift on `#050302` (or skip — the static gradient already reads well).
2. **Loading overlay** with the wordmark + thin progress bar that fades out on `DOMContentLoaded`.
3. **Six chapter `<section>` overlays** generated from a `chapters` array in the archetype config (label, h1, h1Html for italic span, body, mono-meta, side `left|right|center`, marquee on/off, numeral). Each gets fixed positioning + opacity-driven crossfade.
4. **Chapter rail** — Roman numerals I-VI w/ hairline dividers; CSS-only `:target`/anchor-based active state, OR a tiny IntersectionObserver script.
5. **Vertical credit rail** right side.
6. **Scroll progress bar** bottom — pure CSS `position:fixed` + JS reading `window.scrollY/maxScroll`.
7. **Spacer** `<div style="height:700vh">`.

Inline 60-line vanilla JS handles: scroll listener → updates each chapter's opacity based on its 1/6 segment of total scroll → updates progress fill width + percent text + active Roman numeral. No GSAP needed.

Color tokens to import as archetype 13 `vars`:
```js
vars:{
  '--bg':'#050302','--surface':'#0E0805','--fg':'#f4e6cf',
  '--accent':'#e9b26b','--amber':'#de7c0d','--cream':'#f4e6cf','--gold':'#e9b26b',
  '--card':'rgba(244,230,207,.05)','--card-bd':'rgba(244,230,207,.14)'
}
```

Fonts to add to FONTS map:
```js
'Fraunces':'Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..700,50,0;1,9..144,300..700,100,1',
'JetBrains Mono':'JetBrains+Mono:wght@300;400',
```

Then archetype 13:
```js
disp:'Fraunces', body:'Inter', threeD:false,
layout:[heroCinematicFilm, footerBare]  // single hero replaces all sections
```

Optional: keep existing sections AFTER the 700vh film as a "Process / Journal / Shop" set so the page has real content beyond the film.
