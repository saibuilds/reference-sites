# GHL production playbook — DJ Custom Reno · Sathi & Sai Real Estate · Sathi & Sai Mortgages

How to ship genuinely high-end landing pages for the three GHL
businesses — and why this approach beats Lovable / Framer / Wix /
template builders.

## The architecture (this is how you beat the builders)

**Do not build the pages inside GoHighLevel's page editor.** Its builder
is template-grade — it can't do scroll-scrub heroes, real 3D, GSAP
choreography, or true performance control. Instead:

> **Build the page as owned code; use GHL only as the CRM.**

- **Page** = real code (the `STACK.md` stack: Next.js/static + shadcn +
  Motion + GSAP/Lenis + the `heroScrollScrub` we built), deployed on
  **Cloudflare**, on the business's own domain.
- **GHL** = forms, pipelines, automations, SMS/email. The page feeds it.

**Why this beats Lovable / Framer / Awwwards-builder sites:**
- You **own the code** — no monthly platform rent, no lock-in, no export
  tax.
- **Full motion/3D control** — scroll-scrub video, GSAP pinning, Spline
  3D. Builders cap exactly this.
- **Attention-control design** (ARSENAL §9) + **real content** — taste,
  not templates. That's the actual differentiator; the AI just makes
  execution fast.
- **Performance** — Lighthouse 90+, <2s LCP. Builder output is usually
  heavy.
- Note: the goal is to *match or beat the quality* of top reference
  sites with **original** design — not to clone anyone's site.

## Lead capture → GHL (pick one per page)

1. **Embedded GHL form** — paste the GHL form/survey embed into the
   contact section. Fastest; styling limited to GHL's form options.
2. **Custom-styled form → GHL inbound webhook / LeadConnector API**
   (recommended for high-end) — design the form yourself, POST submits to
   a GHL inbound webhook URL, GHL automation takes over. Add success +
   error states. Keep the webhook URL in an env var, never hardcoded.

Either way GHL still owns the pipeline, SMS/email follow-up, and
calendar booking.

## The three builds

### DJ Custom Reno — renovation / cabinets / millwork
- **Base look:** architecture-editorial / luxury showroom (warm
  neutrals, serif headlines).
- **Signature sections:** full-bleed hero (project film or scroll-scrub) →
  **before/after slider** (the killer section for reno) → project gallery
  with scroll-snap "rooms" → process steps → quote-request form → footer.
- **Media:** real project before/after photos + one hero video.

### Sathi & Sai Real Estate
- **Base look:** architecture-editorial / aviation-luxury (premium,
  cinematic).
- **Signature sections:** cinematic property hero (scroll-scrub) → **live
  listings** (RESO Web API, already wired — see `LISTINGS.md`) → areas/
  map → valuation/enquiry form → footer.
- **Data:** RESO/IDX feed at launch (build-time bake).

### Sathi & Sai Mortgages
- **Base look:** saas-glass / soft-editorial (trust + clarity, clean
  sans, calm).
- **Signature sections:** hero with a promise → **interactive rate /
  payment calculator** (Claude-coded) → trust band (licenses, years,
  lenders) → process → application form → footer.

## Production checklist (run for every page before launch)

- [ ] **Real content** — services, copy, contact, offers, testimonials.
      No invented data. (This is the #1 blocker every time.)
- [ ] **High-quality hero media** — image/video from your working gen
      session (Higgsfield/Veo/Nano Banana), not the free Pollinations
      placeholders. Commit to `assets/`.
- [ ] **Attention map** — one focal point per screen, one job per section
      (ARSENAL §9).
- [ ] **Lead form wired to GHL** — and test a real submission end to end.
- [ ] **SEO** — title, meta description, OpenGraph/Twitter, JSON-LD;
      `sitemap.xml`; `robots.txt`.
- [ ] **Performance** — `next/font`, lazy-load media, <2s LCP, Lighthouse
      90+.
- [ ] **Accessibility** — semantic landmarks, focus states,
      `prefers-reduced-motion`.
- [ ] **Mobile pass** — including the scroll-scrub fallback.
- [ ] **Agency add-ons, as they fit** — sticky shrink-on-scroll nav,
      animated stat counters, before/after slider (reno + RE),
      testimonial carousel, floating call/WhatsApp CTA.
- [ ] **Deploy** — custom domain on Cloudflare, redirects, analytics.

## What only your *browser/machine* session can do

This cloud session can't browse, generate media, or touch GHL/Cloudflare/
AWS. Hand these to Claude-for-Chrome (see `BROWSER.md`) or do them
yourself; they commit back to the repo and the build picks them up:
- Generate high-quality hero media → `assets/<id>-hero.{jpg,mp4}`
- Grab real project photos / listing data / copy
- Get the GHL form embed code **or** inbound webhook URL
- Configure the Cloudflare domain + deploy

## First move

Pick one business, hand me its **real content** (services, copy, contact,
a few photos or a DESIGN.md) + its **GHL form embed or webhook URL**, and
I build the full page here — custom code, GHL-wired form, deploy-ready.
That page becomes the template for the other two.
