/* ============================================================
   REFERENCE-SITES GENERATOR
   Emits self-contained Scaffold-A pages (HTML + shared lib.css/lib.js
   + GSAP/Lenis/Three via CDN) for:
     - 12 style archetypes  (generic + real-estate themes)
     - 20 reel-specific sites (generic + real-estate themes)
   Faithful to 02-REEL-FINDINGS.md (palettes, fonts, sections, anims).
   Run:  node build.js
   ============================================================ */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

/* ---------- Google font slugs ---------- */
const FONTS = {
  'Playfair Display':'Playfair+Display:ital,wght@0,500;0,600;1,500',
  'Cormorant Garamond':'Cormorant+Garamond:ital,wght@0,400;0,500;1,400',
  'Inter':'Inter:wght@300;400;500;600',
  'Bebas Neue':'Bebas+Neue',
  'Anton':'Anton',
  'Syne':'Syne:wght@500;700;800',
  'Space Grotesk':'Space+Grotesk:wght@400;500;700',
  'DM Serif Display':'DM+Serif+Display:ital@0;1',
  'Archivo Black':'Archivo+Black',
  'DM Sans':'DM+Sans:wght@400;500;700',
  'IBM Plex Mono':'IBM+Plex+Mono:wght@400;600',
};
function fontHref(list){
  const s = [...new Set(list)].map(f=>'family='+FONTS[f]).join('&');
  return `https://fonts.googleapis.com/css2?${s}&display=swap`;
}

/* ---------- 12 STYLE ARCHETYPES (02-REEL-FINDINGS.md lines 648-670) ---------- */
const STYLES = [
  { id:'01-luxury-dark', name:'Luxury Dark / Sand Atmosphere',
    refs:'Cartier · Obsidian Dew · OF Sakazuki',
    vars:{'--bg':'#080808','--surface':'#1A1A1A','--fg':'#F5F0E8','--accent':'#C9A96E','--card':'rgba(255,255,255,.04)','--card-bd':'rgba(201,169,110,.16)'},
    disp:'Playfair Display', body:'Inter', threeD:true, vanta:'',
    tag:'Near-black bg, warm sand radial light, floating product, serif small-caps, gold only, vast negative space.',
    g:{ brand:'MAISON NOIR', kicker:'Haute Horlogerie', h1:'Time, distilled to its purest form.',
        sub:'A single complication. A lifetime of restraint. The atelier collection, hand-finished in Geneva.',
        cta:'Discover the collection', svc:['The Atelier','Bespoke Commission','Private Viewing'],
        svcd:['Every movement assembled by a single master watchmaker.','Your vision, realised across eighteen months of craft.','By appointment at the Geneva salon.'],
        stats:[['18','Months per piece'],['1','Watchmaker each'],['74','Years of house'] ] },
    re:{ brand:'NOIR ESTATES', kicker:'Private Residences', h1:'Architecture, distilled to its purest form.',
        sub:'A curated portfolio of architecturally significant homes across the GTA. Discreet. Considered. Rare.',
        cta:'Request the portfolio', svc:['Curated Listings','Bespoke Search','Private Showing'],
        svcd:['A handful of significant residences, never mass-listed.','Your brief, matched across eighteen months of market intelligence.','By appointment with a single dedicated advisor.'],
        stats:[['$4.2M','Avg. portfolio'],['1','Advisor each'],['28','Days to close'] ] } },

  { id:'02-cinematic-video', name:'Cinematic Video Hero',
    refs:'Terminal Logistics · Villa Maravilha · Alpine · Hashgraph',
    vars:{'--bg':'#05050F','--surface':'#0C0C18','--fg':'#F4F6FB','--accent':'#E6B873','--card':'rgba(255,255,255,.05)','--card-bd':'rgba(255,255,255,.10)'},
    disp:'Bebas Neue', body:'DM Sans', threeD:false, video:true,
    tag:'Full-bleed autoplay video, gradient veil (never pure black), text enters y:60, SCROLL DOWN cue, counters, video parallax.',
    g:{ brand:'TERMINAL', kicker:'Global Logistics', h1:'The world moves on schedule.',
        sub:'Freight, forwarding and fulfilment across 140 countries — engineered to never miss a window.',
        cta:'Track a shipment', svc:['Ocean Freight','Air Cargo','Last Mile'],
        svcd:['FCL & LCL across every major lane.','Time-critical air with charter capability.','Same-day delivery in 38 metros.'],
        stats:[['140','Countries'],['2.1M','Shipments/yr'],['99.4','% on-time'] ] },
    re:{ brand:'MERIDIAN', kicker:'Real Estate Group', h1:'Your next move, on schedule.',
        sub:'Buying, selling and relocation across the GTA — engineered to close on time, every time.',
        cta:'Book a consultation', svc:['Buy Side','List & Sell','Relocation'],
        svcd:['Off-market access and disciplined negotiation.','Cinematic listing media that moves fast.','End-to-end coordination across cities.'],
        stats:[['1,400','Closings'],['18','Days avg.'],['99','% list-to-sale'] ] } },

  { id:'03-dark-brutalist', name:'Dark Brutalist / Anti-Design',
    refs:'Guilty Mind · SHAPESHIFT · KVS · Sazabi · BANILA',
    vars:{'--bg':'#000000','--surface':'#000000','--fg':'#FFFFFF','--accent':'#FF2020','--card':'rgba(255,255,255,.02)','--card-bd':'#FFFFFF','--btn-radius':'0','--card-radius':'0'},
    disp:'Anton', body:'IBM Plex Mono', threeD:false, brutal:true,
    tag:'Pure #000, ONE accent, massive clamp(60px,14vw,200px) type, 0px corners, 1px borders, instant invert hover, scramble on load, grain overlay.',
    g:{ brand:'GUILTY/MIND', kicker:'Creative Studio — EST 2019', h1:'WE BREAK THE GRID ON PURPOSE',
        sub:'A design studio that refuses the template. Brand systems, motion, and interfaces with teeth.',
        cta:'START A PROJECT', svc:['BRAND','MOTION','BUILD'],
        svcd:['Identity systems that do not blend in.','Loud, deliberate, frame-perfect motion.','Interfaces engineered to be remembered.'],
        stats:[['52','PROJECTS'],['11','AWARDS'],['0','TEMPLATES'] ] },
    re:{ brand:'BLACK/DOOR', kicker:'Property Studio — EST 2019', h1:'WE SELL HOMES ON PURPOSE',
        sub:'A real estate studio that refuses the template. Bold marketing, ruthless negotiation, results with teeth.',
        cta:'LIST WITH US', svc:['SELL','BUY','STAGE'],
        svcd:['Listing campaigns that do not blend in.','Aggressive, data-led buyer representation.','Staging engineered to be remembered.'],
        stats:[['340','SOLD'],['$210M','VOLUME'],['0','BORING LISTINGS'] ] } },

  { id:'04-3d-spline-webgl', name:'3D Spline / WebGL',
    refs:'Spline Ice Cube · E.C.H.O. · JoyJam · Cartier 3D',
    vars:{'--bg':'#070A12','--surface':'#0E1322','--fg':'#EAF0FF','--accent':'#5BE0FF','--card':'rgba(255,255,255,.04)','--card-bd':'rgba(91,224,255,.18)'},
    disp:'Space Grotesk', body:'Inter', threeD:true,
    tag:'WebGL object fills/right-50%, mousemove lerp rotation, warm/cool PointLight pair, ACES glow, glass material.',
    g:{ brand:'ECHO LABS', kicker:'Interactive Engineering', h1:'Built in three dimensions.',
        sub:'We design real-time 3D product experiences — configurators, portals and worlds that respond to you.',
        cta:'See the engine', svc:['Realtime 3D','Configurators','WebGL Worlds'],
        svcd:['60fps product scenes in the browser.','Pick, rotate, customise — instantly.','Immersive brand environments.'],
        stats:[['60','fps target'],['12','Engines shipped'],['4','Awwwards'] ] },
    re:{ brand:'DIMENSION RE', kicker:'Immersive Property', h1:'Tour homes in three dimensions.',
        sub:'Interactive 3D walkthroughs and configurable floorplans — buyers explore before they ever visit.',
        cta:'Launch a 3D tour', svc:['3D Walkthroughs','Floorplan Config','Virtual Staging'],
        svcd:['Photoreal scenes that load in-browser.','Reconfigure rooms and finishes live.','Stage empty homes in real time.'],
        stats:[['60','fps tours'],['320','Homes scanned'],['3.1x','More inquiries'] ] } },

  { id:'05-vaporwave', name:'Vaporwave / Psychedelic',
    refs:'Sidewave',
    vars:{'--bg':'#1A0033','--surface':'#2A0A4A','--fg':'#FDF0FF','--accent':'#FF8C00','--card':'rgba(255,255,255,.06)','--card-bd':'rgba(255,0,110,.30)'},
    disp:'Archivo Black', body:'Space Grotesk', threeD:false, ripple:true,
    tag:'bg #1A0033→#FF006E, concentric ripple rings scale→3 fade, glowing center oval, silhouette mix-blend screen, bold condensed italic.',
    g:{ brand:'SIDEWAVE', kicker:'Sound Collective', h1:'Feel the frequency.',
        sub:'An audio-reactive label and live event series. Wave after wave after wave.',
        cta:'Hear the wave', svc:['Releases','Live Sets','Sync'],
        svcd:['Genre-fluid drops every full moon.','Immersive audiovisual live shows.','Music licensing for film & games.'],
        stats:[['48','Releases'],['1.2M','Listeners'],['6','Continents'] ] },
    re:{ brand:'PULSE PROPERTIES', kicker:'Lifestyle Real Estate', h1:'Feel the neighbourhood.',
        sub:'Bold listings for bold buyers — lofts, studios and creative spaces with a heartbeat.',
        cta:'Find your space', svc:['Lofts','Studios','Creative HQ'],
        svcd:['Industrial conversions with character.','Live-work units for makers.','Commercial creative footprints.'],
        stats:[['210','Spaces'],['38','Days avg.'],['6','Districts'] ] } },

  { id:'06-soft-editorial', name:'Soft Editorial / Feminine',
    refs:'Maison · Trendship · Bisous · hansarnesen',
    vars:{'--bg':'#FAF0EB','--surface':'#F3E2D8','--fg':'#2C1810','--accent':'#C8A08A','--card':'rgba(255,255,255,.55)','--card-bd':'rgba(44,24,16,.10)'},
    disp:'Cormorant Garamond', body:'Inter', threeD:false, light:true,
    tag:'Cream/blush/dusty-rose, Cormorant italic, padding ≥120px, soft grain, asymmetric grids, images scale 1.05, soft-dot cursor lag.',
    g:{ brand:'Maison de Synergy', kicker:'Atelier de Mode', h1:'Softness, with intention.',
        sub:'A slow-fashion atelier of considered pieces — made in small batches, made to be kept.',
        cta:'Explore the atelier', svc:['The Collection','Made to Order','The Journal'],
        svcd:['Seasonless essentials in natural fibre.','Cut and finished to your measure.','Notes on craft, slowness and care.'],
        stats:[['12','Pieces / season'],['100','% natural fibre'],['1','Atelier'] ] },
    re:{ brand:'Maison Living', kicker:'Boutique Real Estate', h1:'A home, with intention.',
        sub:'A boutique advisory for design-led homes — matched slowly, considered carefully, made to be loved.',
        cta:'Begin your search', svc:['Curated Homes','Concierge Search','The Journal'],
        svcd:['Design-forward residences, hand-selected.','A calm, guided buying experience.','Notes on neighbourhoods and living well.'],
        stats:[['40','Homes / year'],['1','Advisor'],['97','% referral'] ] } },

  { id:'07-saas-glass', name:'SaaS Modern / Glassmorphism',
    refs:'JoyJam · GSAP Engine · Hashgraph · Financial Inst.',
    vars:{'--bg':'#05050F','--surface':'#0A0A18','--fg':'#EEF1FF','--accent':'#7B61FF','--card':'rgba(255,255,255,.05)','--card-bd':'rgba(255,255,255,.10)'},
    disp:'Syne', body:'Inter', threeD:true,
    tag:'Conic/shader mesh bg, glass cards blur(20px), device mockups perspective rotateX/Y, logo marquee, middle pricing card lifted, gradient text.',
    g:{ brand:'JoyJam', kicker:'Creator Platform', h1:'Ship your idea this weekend.',
        sub:'The all-in-one toolkit for creators — pages, payments and analytics, no code required.',
        cta:'Start free', svc:['Pages','Payments','Insights'],
        svcd:['Beautiful pages live in minutes.','Take money globally, day one.','Know exactly what converts.'],
        stats:[['120k','Creators'],['$48M','Paid out'],['4.9','★ rating'] ] },
    re:{ brand:'ListingOS', kicker:'Real Estate SaaS', h1:'List, market and close — in one place.',
        sub:'The all-in-one platform for modern agents: listings, lead capture and pipeline, no spreadsheets.',
        cta:'Start free trial', svc:['Listings','Lead Capture','Pipeline'],
        svcd:['Syndicated listings in minutes.','Capture and route every lead.','See every deal to close.'],
        stats:[['9,400','Agents'],['$2.1B','Closed'],['4.9','★ rating'] ] } },

  { id:'08-architecture-editorial', name:'Architecture / Editorial Photography',
    refs:'Fall Line House (19K likes) · Fifth & Dune · Alpine · Humaan',
    vars:{'--bg':'#0B0B0B','--surface':'#141414','--fg':'#F2F0EC','--accent':'#B7A88F','--card':'rgba(255,255,255,.03)','--card-bd':'rgba(255,255,255,.10)'},
    disp:'DM Serif Display', body:'Inter', threeD:false, editorial:true,
    tag:'Full-viewport object-fit cover desaturated, Editorial italic+upright 80px, cursor-following image preview (most viral), GSAP horizontal panels, clip-path reveal, minimal nav.',
    g:{ brand:'FALL LINE', kicker:'Architecture Studio', h1:'Houses that listen to the land.',
        sub:'A practice working at the edge — cliffside, forest and water. Selected works, 2014–2026.',
        cta:'View the work', svc:['Residential','Cultural','Landscape'],
        svcd:['Singular homes sited with restraint.','Public buildings that gather people.','Ground that frames the architecture.'],
        stats:[['38','Built works'],['9','Awards'],['12','Years'] ] },
    re:{ brand:'FALL LINE ESTATES', kicker:'Architectural Real Estate', h1:'Homes that listen to the land.',
        sub:'We represent architecturally significant properties — cliffside, forest and waterfront. Selected listings.',
        cta:'View the listings', svc:['Architectural','Waterfront','Estate Land'],
        svcd:['Design-significant homes, curated.','Rare waterfront with provenance.','Buildable land for a singular vision.'],
        stats:[['$310M','Sold'],['42','Listings'],['12','Years'] ] } },

  { id:'09-aviation-luxury', name:'Luxury Aviation / Private Services',
    refs:'Jesko Jets · Sakazuki',
    vars:{'--bg':'#0C0C0C','--surface':'#161616','--fg':'#F5F2ED','--accent':'#C9A96E','--card':'rgba(245,242,237,.04)','--card-bd':'rgba(201,169,110,.20)','--btn-radius':'999px'},
    disp:'Space Grotesk', body:'Inter', threeD:false, clock:true,
    tag:'Split dark/light, live clock setInterval, destination ticker rotating words, pill CTA 999px, letter-spacing .3em labels, no decorative images.',
    g:{ brand:'JESKO JETS', kicker:'Private Aviation', h1:'Anywhere. On your hour.',
        sub:'A global private fleet with a single standard of service. Wheels-up in as little as four hours.',
        cta:'Request a flight', svc:['Charter','Jet Card','Management'],
        svcd:['On-demand charter, any city pair.','Fixed-rate hours, zero surprises.','Full ownership management.'],
        stats:[['190','Aircraft'],['4h','To wheels-up'],['24/7','Crew'] ] },
    re:{ brand:'JESKO ESTATES', kicker:'Private Property Advisory', h1:'Anywhere. On your terms.',
        sub:'A global private-client property desk with a single standard. First viewings in as little as 24 hours.',
        cta:'Request an advisor', svc:['Acquisition','Portfolio','Relocation'],
        svcd:['Off-market acquisition, any market.','Discreet portfolio management.','White-glove global relocation.'],
        stats:[['40','Markets'],['24h','To viewing'],['24/7','Advisor'] ] } },

  { id:'10-food-beauty-dtc', name:'Luxury Food / Beauty DTC',
    refs:"Casper's Caviar · Obsidian Dew",
    vars:{'--bg':'#080808','--surface':'#161210','--fg':'#F3EBDD','--accent':'#B48226','--card':'rgba(255,255,255,.04)','--card-bd':'rgba(180,130,40,.22)'},
    disp:'Playfair Display', body:'Inter', threeD:true, sticky:true,
    tag:'Extreme close-up product hero, dark bg glow drop-shadow, ingredient mosaic mixed heights, sticky GET 15% OFF bar w/ dismiss.',
    g:{ brand:"CASPER'S", kicker:'Single-Origin Caviar', h1:'The ocean, at its rarest.',
        sub:'Sustainably farmed Oscietra, cured to a 200-year recipe and shipped on ice within 24 hours.',
        cta:'Shop the tin', svc:['The Caviar','Pairings','Gifting'],
        svcd:['Oscietra, Beluga and Kaluga grades.','Blinis, crème fraîche and service kit.','Hand-packed presentation boxes.'],
        stats:[['24h','To your door'],['1','Single origin'],['200','Year recipe'] ] },
    re:{ brand:'OBSIDIAN HOMES', kicker:'Boutique Listings', h1:'The market, at its rarest.',
        sub:'A small house of exceptional residences, presented with the polish of a luxury product launch.',
        cta:'View the residences', svc:['The Residences','Staging','Private Sale'],
        svcd:['A curated few, never the many.','Magazine-grade presentation.','Quiet, off-market transactions.'],
        stats:[['24h','To private viewing'],['1','Curator'],['100','% discreet'] ] } },

  { id:'11-japanese-web3', name:'Japanese Luxury / Community',
    refs:'OF Sakazuki',
    vars:{'--bg':'#0C0808','--surface':'#1A1010','--fg':'#F0E6D3','--accent':'#B8600A','--card':'rgba(255,255,255,.04)','--card-bd':'rgba(184,96,10,.26)'},
    disp:'Cormorant Garamond', body:'Space Grotesk', threeD:true, vanta:'fog',
    tag:'Warm amber/fire + dark overlay, Vanta-style smoke parallax, spare ideographic spacing, parenthetical socials, arrow CTA, exclusive copy.',
    g:{ brand:'盃 SAKAZUKI', kicker:'( Members Only )', h1:'Connection beyond access.',
        sub:'A private circle for collectors of craft and fire. Membership is by allowlist, by introduction only.',
        cta:'APPLY ALLOWLIST >>>', svc:['The Circle','The Vault','The Rituals'],
        svcd:['A community measured in trust.','Curated craft, released slowly.','Gatherings, seasonal and rare.'],
        stats:[['888','Members'],['1','Allowlist'],['∞','Patience'] ] },
    re:{ brand:'盃 KINDRED', kicker:'( By Introduction )', h1:'Homes beyond the listing.',
        sub:'A private property circle for discerning buyers. Access to off-market homes, by introduction only.',
        cta:'REQUEST ENTRY >>>', svc:['The Circle','The Vault','The Viewings'],
        svcd:['A trusted network of buyers & sellers.','Off-market homes, released slowly.','Private viewings, by appointment.'],
        stats:[['88','Members'],['1','Waitlist'],['100','% off-market'] ] } },

  { id:'12-experimental-dev', name:'Experimental / Creative Developer',
    refs:'E.C.H.O. · Robert Borghesi · IDOM',
    vars:{'--bg':'#000000','--surface':'#060606','--fg':'#EDEDED','--accent':'#FF3B3B','--card':'rgba(255,255,255,.03)','--card-bd':'rgba(255,59,59,.24)','--btn-radius':'0'},
    disp:'Space Grotesk', body:'IBM Plex Mono', threeD:true, minimal:true,
    tag:'Full-screen WebGL canvas, HTML absolute z-2, mouse-reactive geometry, single accent on black, near-zero UI — work + contact only.',
    g:{ brand:'R.B.', kicker:'Creative Developer', h1:'I build the strange ones.',
        sub:'Independent creative developer. WebGL, motion and the experiments other studios will not ship.',
        cta:'Contact', svc:['Work','Experiments','Contact'],
        svcd:['Selected client + lab projects.','Open-source shaders and toys.','Available Q3 2026.'],
        stats:[['41','Projects'],['7','FWA'],['1','Human'] ] },
    re:{ brand:'PLOT.', kicker:'Property × Code', h1:'I build property the strange way.',
        sub:'A one-person studio building experimental real-estate experiences — interactive maps, 3D, data.',
        cta:'Contact', svc:['Work','Experiments','Contact'],
        svcd:['Interactive listing + map builds.','Open data + 3D neighbourhood toys.','Available for select projects.'],
        stats:[['41','Builds'],['7','Awards'],['1','Human'] ] } },
];

/* ---------- 20 REELS -> map to a style + per-reel brand specifics ---------- */
const REELS = [
  { n:1,  site:'Cartier Watch',          style:'01-luxury-dark',          tech:'3D floating product, desert/fog atmosphere' },
  { n:2,  site:'Terminal Logistics',     style:'02-cinematic-video',      tech:'Video hero, truck driving, golden hour' },
  { n:3,  site:'Guilty Mind',            style:'03-dark-brutalist',       tech:'Cracked glass texture, all-caps grunge' },
  { n:4,  site:'GSAP Animation Engine',  style:'12-experimental-dev',     tech:'Neon circular ring, glitch text, code panel' },
  { n:5,  site:'Sidewave Music',         style:'05-vaporwave',            tech:'Purple/orange ripple rings, silhouette' },
  { n:6,  site:'OF Sakazuki',            style:'11-japanese-web3',        tech:'Amber fire parallax, exclusive community' },
  { n:7,  site:'Obsidian Dew',           style:'10-food-beauty-dtc',      tech:'Volcanic product, ingredient mosaic grid' },
  { n:8,  site:'Hashgraph Ventures',     style:'02-cinematic-video',      tech:'Ocean video, floating glowing orb' },
  { n:9,  site:'Spline Ice Cube',        style:'04-3d-spline-webgl',      tech:'Interactive 3D object, arctic fog' },
  { n:10, site:'Fall Line House',        style:'08-architecture-editorial',tech:'Misty cliffside, editorial, 19K likes viral' },
  { n:11, site:'Relats / Periflex',      style:'03-dark-brutalist',       tech:'Close-up product photo, specs overlay' },
  { n:12, site:'Maison de Synergy',      style:'06-soft-editorial',       tech:'Blush pink, serif, blooming flower 3D' },
  { n:13, site:'Design Agency',          style:'12-experimental-dev',     tech:'Highlight-on-scroll typography list' },
  { n:14, site:'Cartier Watches & Wonders',style:'06-soft-editorial',     tech:'Gallery room 3D perspective, all white' },
  { n:15, site:'E.C.H.O. / Active Theory',style:'12-experimental-dev',    tech:'3D eye portal, crimson neon, water reflect' },
  { n:16, site:"Casper's Caviar",        style:'10-food-beauty-dtc',      tech:'Dark texture product hero, popup CTA' },
  { n:17, site:'Villa Maravilha',        style:'02-cinematic-video',      tech:'Garden door to ocean, jungle parallax' },
  { n:18, site:'Jesko Jets',             style:'09-aviation-luxury',      tech:'Split layout, destination ticker, live clock' },
  { n:19, site:'Alpine Chalets',         style:'08-architecture-editorial',tech:'Snow panoramic, overlapping editorial type' },
  { n:20, site:'JoyJam',                 style:'07-saas-glass',           tech:'Flipping card panels, 3D phone mockups' },
];

/* ---------- HTML template ---------- */
function page(opts){
  const { title, vars, disp, body, threeD, vanta, light, brutal, editorial,
          c, refTag, badge, backHref, prevHref, nextHref, pos, total } = opts;
  const cssVars = Object.entries(vars).map(([k,v])=>`${k}:${v}`).join(';');
  const fonts = fontHref([disp, body]);
  const cdn = `
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>${ threeD ? `
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>`:'' }`;
  const heroBg = threeD
    ? `<canvas id="bg3d"></canvas><div class="veil" style="background:radial-gradient(60% 60% at 70% 35%,color-mix(in srgb,var(--accent) 14%,transparent),transparent 70%)"></div>`
    : `<div class="veil" data-parallax="60" style="background:
         radial-gradient(70% 90% at 80% 10%,color-mix(in srgb,var(--accent) 16%,transparent),transparent 60%),
         linear-gradient(180deg,color-mix(in srgb,var(--bg) 30%,transparent) 0%,var(--bg) 90%)"></div>`;
  const grain = `<div aria-hidden="true" style="position:fixed;inset:0;z-index:9;pointer-events:none;opacity:.05;mix-blend-mode:overlay;background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>')"></div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${c.kicker} — ${c.brand}. Reference build (${refTag}).">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fonts}">
<link rel="stylesheet" href="../shared/lib.css">
<style>
  :root{${cssVars};--font-display:'${disp}';--font-body:'${body}'}
  ${ brutal ? `.hero h1{font-size:clamp(60px,14vw,200px);letter-spacing:-.02em;text-transform:uppercase}
  .btn{border:1px solid var(--fg)}.btn-primary{background:var(--accent);color:#000}
  .btn:hover{background:var(--fg);color:#000;transition:none}` : '' }
  ${ editorial ? `.hero h1{font-style:italic}.proj{aspect-ratio:4/3;background:linear-gradient(135deg,var(--surface),var(--bg));border:1px solid var(--card-bd);display:flex;align-items:flex-end;padding:1.4rem;font-family:var(--font-display);font-size:1.1rem}` : '' }
  ${ light ? `.nav.scrolled{box-shadow:0 1px 0 var(--card-bd)} body{background:var(--bg)}` : '' }
  .sitenav{position:fixed;left:50%;transform:translateX(-50%);bottom:1rem;z-index:60;display:flex;align-items:center;gap:.2rem;
    font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;padding:.45rem .5rem;border:1px solid var(--card-bd);
    border-radius:999px;background:color-mix(in srgb,var(--bg) 78%,transparent);backdrop-filter:blur(10px);max-width:92vw}
  .sitenav a{padding:.4rem .85rem;border-radius:999px;white-space:nowrap;transition:background .25s,color .25s}
  .sitenav a:hover{background:var(--accent);color:#000}
  .sitenav .pos{padding:.4rem .7rem;opacity:.55;font-variant-numeric:tabular-nums}
  .sitenav .disabled{opacity:.3;pointer-events:none}
  .reftag{position:fixed;right:1rem;bottom:1rem;z-index:60;font-size:.66rem;letter-spacing:.12em;opacity:.5;text-transform:uppercase}
  .ribbon{display:inline-block;font-size:.66rem;letter-spacing:.2em;text-transform:uppercase;color:var(--accent);border:1px solid var(--card-bd);padding:.35rem .8rem;border-radius:2rem;margin-bottom:1.4rem}
  .hero-cta{display:flex;gap:1rem;flex-wrap:wrap;margin-top:2.4rem}
  .scrolldown{position:absolute;right:clamp(1.25rem,4vw,3rem);bottom:2rem;z-index:3;font-size:.7rem;letter-spacing:.3em;text-transform:uppercase;opacity:.7}
</style>
${cdn}
</head>
<body${ vanta ? ` data-vanta="${vanta}"`:'' }>
${grain}
<nav class="sitenav" aria-label="Reference site switcher">
  <a${ prevHref ? ` href="${prevHref}"`:' class="disabled"' }>&larr; Prev</a>
  <a href="${backHref}">Gallery</a>
  <span class="pos">${pos} / ${total}</span>
  <a${ nextHref ? ` href="${nextHref}"`:' class="disabled"' }>Next &rarr;</a>
</nav>
<span class="reftag">${refTag}</span>

<nav class="nav">
  <div class="brand">${c.brand}</div>
  <div class="links">
    <a href="#work">Work</a><a href="#about">About</a><a href="#stats">Results</a><a href="#contact">Contact</a>
  </div>
  <a href="#contact" class="btn btn-ghost magnetic" style="padding:.7rem 1.4rem">${c.cta}</a>
</nav>

<header class="hero">
  ${heroBg}
  <div class="wrap">
    <span class="ribbon">${badge}</span>
    <div class="eyebrow" data-reveal>${c.kicker}</div>
    <h1>${c.h1}</h1>
    <p class="lead" data-reveal data-reveal-d="2" style="margin-top:1.6rem">${c.sub}</p>
    <div class="hero-cta" data-reveal data-reveal-d="3">
      <a href="#contact" class="btn btn-primary magnetic">${c.cta}</a>
      <a href="#work" class="btn btn-ghost magnetic">View work</a>
    </div>
  </div>
  <div class="scrolldown">Scroll down &darr;</div>
</header>

<section class="sec" id="work">
  <div class="wrap">
    <div class="sec-head">
      <div class="eyebrow" data-reveal>What we do</div>
      <h2 class="clip-line">${c.svc[0]}, ${c.svc[1]} &amp; ${c.svc[2]}.</h2>
    </div>
    <div class="grid g3">
      ${c.svc.map((s,i)=>`<article class="card tilt" data-reveal data-reveal-d="${i+1}">
        <div class="eyebrow">0${i+1}</div>
        <h3 style="margin:1rem 0 .7rem">${s}</h3>
        <p class="muted">${c.svcd[i]}</p>
      </article>`).join('\n      ')}
    </div>
  </div>
</section>

<div class="marquee"><div class="track">
  <span>${c.brand}</span><span>•</span><span>${c.kicker}</span><span>•</span><span>${c.brand}</span><span>•</span><span>${c.kicker}</span><span>•</span>
  <span>${c.brand}</span><span>•</span><span>${c.kicker}</span><span>•</span><span>${c.brand}</span><span>•</span><span>${c.kicker}</span><span>•</span>
</div></div>

<section class="sec" id="about">
  <div class="wrap grid g2" style="align-items:center">
    <div data-reveal>
      <div class="eyebrow">The studio</div>
      <h2 style="margin:.8rem 0 1.2rem">A reference build, faithful to the source reel.</h2>
      <p class="lead">${c.sub} This page recreates the <strong>${refTag}</strong> aesthetic from the research library — palette, type pairing, section rhythm and the signature motion.</p>
    </div>
    <div class="tilt card" data-reveal data-reveal-d="2" style="aspect-ratio:1;display:flex;align-items:center;justify-content:center">
      <div style="font-family:var(--font-display);font-size:clamp(2rem,5vw,3.4rem);text-align:center;line-height:1.1">${c.brand}<br><span class="muted" style="font-size:.9rem;letter-spacing:.2em">${c.kicker}</span></div>
    </div>
  </div>
</section>

<section class="sec" id="stats">
  <div class="wrap">
    <div class="stats">
      ${c.stats.map((s)=>{
        const m = String(s[0]).match(/^([^\d]*)([\d.,]+)(.*)$/);
        if(m){ const pre=m[1], num=m[2].replace(/,/g,''), suf=m[3];
          return `<div class="stat" data-reveal><div class="num" data-count="${num}" data-prefix="${pre}" data-suffix="${suf}">${pre}0${suf}</div><div class="lbl">${s[1]}</div></div>`; }
        return `<div class="stat" data-reveal><div class="num">${s[0]}</div><div class="lbl">${s[1]}</div></div>`;
      }).join('\n      ')}
    </div>
  </div>
</section>

<section class="sec" id="contact">
  <div class="wrap" style="text-align:center">
    <div class="eyebrow" data-reveal>Get in touch</div>
    <h2 class="clip-line" style="margin:1rem auto 2rem;max-width:18ch">${c.cta}.</h2>
    <a href="#" class="btn btn-primary magnetic" data-reveal data-reveal-d="2">${c.cta}</a>
  </div>
</section>

<footer class="foot">
  <div class="wrap row">
    <div><div class="brand" style="font-family:var(--font-display);font-size:1.2rem">${c.brand}</div>
      <p class="muted" style="margin-top:.6rem;font-size:.85rem">${c.kicker}</p></div>
    <div class="muted" style="font-size:.8rem;max-width:30ch">Reference build · ${refTag} · part of the SathiDeals / reno AI website library.</div>
  </div>
</footer>

<script src="../shared/lib.js"></script>
</body>
</html>`;
}

/* ---------- emit ---------- */
let manifest = { styles:[], reels:[] };
function styleObj(id){ return STYLES.find(s=>s.id===id); }

fs.mkdirSync(path.join(ROOT,'reels'),{recursive:true});
fs.mkdirSync(path.join(ROOT,'reels-realestate'),{recursive:true});

/* Build one ordered chain across ALL 64 builds so every page links to the
   next/prev — styles → styles-RE → reels → reels-RE. Each job carries its
   relative path + the page() options; prev/next are wired after the list
   is assembled. */
const jobs = [];

STYLES.forEach(s=>{
  const common = { vars:s.vars, disp:s.disp, body:s.body, threeD:!!s.threeD,
    vanta:s.vanta||'', light:!!s.light, brutal:!!s.brutal, editorial:!!s.editorial };
  jobs.push({ rel:`styles/${s.id}.html`,
    opts:{ ...common, title:`${s.g.brand} — ${s.name}`, c:s.g,
      refTag:`Style · ${s.name}`, badge:`Reference · ${s.refs}`,
      backHref:'../index.html' } });
  jobs.push({ rel:`styles-realestate/${s.id}.html`,
    opts:{ ...common, title:`${s.re.brand} — ${s.name} (Real Estate)`, c:s.re,
      refTag:`Style · ${s.name} · RE`, badge:`Real-estate variant · ${s.refs}`,
      backHref:'../index.html' } });
  manifest.styles.push({ id:s.id, name:s.name, refs:s.refs, tag:s.tag,
    accent:s.vars['--accent'], g:s.g.brand, re:s.re.brand });
});

REELS.forEach(r=>{
  const s = styleObj(r.style);
  const common = { vars:s.vars, disp:s.disp, body:s.body, threeD:!!s.threeD,
    vanta:s.vanta||'', light:!!s.light, brutal:!!s.brutal, editorial:!!s.editorial };
  const slug = String(r.n).padStart(2,'0')+'-'+r.site.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  const gc = { ...s.g, brand:r.site.toUpperCase(), kicker:s.g.kicker };
  jobs.push({ rel:`reels/${slug}.html`,
    opts:{ ...common, title:`Reel ${r.n} — ${r.site}`, c:gc,
      refTag:`Reel ${r.n} · ${r.site}`,
      badge:`Reel ${r.n} · ${s.name} · ${r.tech}`, backHref:'../index.html' } });
  jobs.push({ rel:`reels-realestate/${slug}.html`,
    opts:{ ...common, title:`Reel ${r.n} — ${r.site} (Real Estate)`, c:{ ...s.re },
      refTag:`Reel ${r.n} · ${r.site} · RE`,
      badge:`Reel ${r.n} RE variant · ${s.name}`, backHref:'../index.html' } });
  manifest.reels.push({ n:r.n, site:r.site, slug, style:s.id, styleName:s.name,
    tech:r.tech, accent:s.vars['--accent'] });
});

// relative path from job A's dir to job B (all dirs are one level under ROOT)
function relTo(from, to){ return '../' + to; }
const total = jobs.length;
jobs.forEach((job, i)=>{
  const prev = jobs[i-1], next = jobs[i+1];
  fs.writeFileSync(path.join(ROOT, job.rel),
    page({ ...job.opts,
      prevHref: prev ? relTo(job.rel, prev.rel) : '',
      nextHref: next ? relTo(job.rel, next.rel) : '',
      pos: i+1, total }));
});

fs.writeFileSync(path.join(ROOT,'manifest.json'), JSON.stringify(manifest,null,2));
console.log('Generated', total, 'pages, all cross-linked (prev/next/gallery). manifest.json written.');
