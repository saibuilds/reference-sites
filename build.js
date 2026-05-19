/* ============================================================
   REFERENCE-SITES GENERATOR  v2 — bespoke per-archetype layouts
   Each of the 12 archetypes composes its OWN ordered section list
   (no shared skeleton). Demo/AI tells removed: no ribbon, no reftag,
   no WhatsApp FAB, no "reference build" filler, no library footer.
   Self-contained Scaffold-A (HTML + shared lib.css/lib.js + CDN).
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
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

/* ---------- OWNED VISUAL GENERATOR ----------------------------------------
   No external hotlinks (Coverr/Unsplash 404 + hotlink-block = broken boxes,
   the worst "unfinished/AI" tell). Each archetype gets a deterministic,
   self-contained SVG tuned to its palette + mood. If a real raster exists at
   assets/<id>-hero.{jpg,png,webp} — dropped by a credentialed Higgsfield /
   nano-banana run — it is preferred automatically, no code change needed.
   GEN_PROMPT is the exact brief such a run should use ("learning what it
   needs"): a future credentialed session calls the generate-image MCP with
   GEN_PROMPT[id] and writes assets/<id>-hero.jpg.                           */
const MOTIF = { '01-luxury-dark':'bloom','02-cinematic-video':'horizon','03-dark-brutalist':'slab',
  '04-3d-spline-webgl':'mesh','05-vaporwave':'sun','06-soft-editorial':'soft','07-saas-glass':'mesh',
  '08-architecture-editorial':'tonal','09-aviation-luxury':'horizon','10-food-beauty-dtc':'organic',
  '11-japanese-web3':'organic','12-experimental-dev':'slab','13-wellness-botanical':'organic',
  '14-cosmic-platform':'cosmos','15-resort-residences':'tonal' };
const GEN_PROMPT = {
  '01-luxury-dark':'Cinematic macro of a haute-horlogerie movement, single warm gold key light on near-black, extreme restraint, museum lighting, no text',
  '02-cinematic-video':'Wide cinematic aerial of a cargo vessel at dawn, deep teal-black water, warm horizon glow, anamorphic, film grain, no text',
  '03-dark-brutalist':'High-contrast brutalist photographic abstraction, hard black-and-white diagonal light, raw concrete, single red accent, no text',
  '04-3d-spline-webgl':'Glossy iridescent 3D abstract render, cyan glass and chrome, soft studio gradient, real-time engine look, no text',
  '05-vaporwave':'Retro synthwave horizon, large gradient sun behind scanline bands, magenta-to-orange, perspective grid, no text',
  '06-soft-editorial':'Soft editorial fashion still life, warm sand and cream tones, diffuse window light, slow-fashion calm, no text',
  '07-saas-glass':'Abstract frosted-glass product UI floating on a violet mesh gradient, soft depth blur, premium SaaS, no text',
  '08-architecture-editorial':'Moody architectural photograph, concrete and timber against landscape, overcast tonal light, large negative space, no text',
  '09-aviation-luxury':'Private jet on tarmac at golden hour, low horizon, long vapor trail, warm gold-on-charcoal, no text',
  '10-food-beauty-dtc':'Luxury single-origin product macro on dark slate, dewy texture, warm amber rim light, editorial DTC, no text',
  '11-japanese-web3':'Minimal Japanese ink-wash on warm dark paper, single ember-orange gesture, ma negative space, no text',
  '12-experimental-dev':'Generative shader abstraction, raw red-on-black geometry, terminal aesthetic, experimental dev lab, no text',
  '13-wellness-botanical':'Soft natural still life of a halved coconut and green botanicals on warm cream linen, diffuse daylight, Ayurvedic wellness, editorial DTC, no text',
  '14-cosmic-platform':'Deep-space astrophotograph, faint star field with a luminous violet nebula bloom and thin orbital rings around one bright point, NASA-grade celestial calm, no text',
  '15-resort-residences':'Cinematic dusk photograph of a low stone-and-timber luxury resort villa half-hidden in coastal trees above a private bay, warm lantern glow, calm sea, no people, no text' };
function artSVG(id,p){
  const m = MOTIF[id]||'mesh', { bg,surface,accent,fg } = p, W=1600,H=1000;
  const defs = `<defs>
<linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg}"/><stop offset=".55" stop-color="${surface}"/><stop offset="1" stop-color="${bg}"/></linearGradient>
<radialGradient id="a" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="${accent}" stop-opacity=".55"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
<linearGradient id="lk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${accent}" stop-opacity="0"/><stop offset=".5" stop-color="${accent}" stop-opacity=".10"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></linearGradient>
<radialGradient id="v" cx="50%" cy="46%" r="75%"><stop offset="0" stop-color="${bg}" stop-opacity="0"/><stop offset=".66" stop-color="${bg}" stop-opacity="0"/><stop offset="1" stop-color="${bg}" stop-opacity=".62"/></radialGradient>
<filter id="s" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="70"/></filter>
<filter id="gg" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="26"/></filter>
<filter id="g"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .04 0"/></filter></defs>`;
  const atmo = `<ellipse cx="320" cy="250" rx="520" ry="420" fill="url(#a)" filter="url(#s)" opacity=".5"/><ellipse cx="1300" cy="800" rx="560" ry="460" fill="url(#a)" filter="url(#s)" opacity=".36"/>`;
  let layer='';
  if(m==='bloom') layer=`<ellipse cx="1010" cy="430" rx="430" ry="430" fill="url(#a)" filter="url(#s)"/>
${[230,300,370,440,520].map(r=>`<circle cx="1010" cy="430" r="${r}" fill="none" stroke="${accent}" stroke-opacity=".13"/>`).join('')}
<circle cx="1010" cy="430" r="34" fill="${accent}" opacity=".5" filter="url(#gg)"/><circle cx="1010" cy="430" r="7" fill="${fg}"/>`;
  else if(m==='slab') layer=`<g transform="rotate(-18 800 500)">
<rect x="120" y="120" width="1360" height="150" fill="${fg}" opacity=".06"/>
<rect x="-80" y="426" width="1760" height="124" fill="${accent}" opacity=".16"/>
<rect x="-80" y="430" width="1760" height="116" fill="${accent}" opacity=".85"/>
<rect x="260" y="690" width="1080" height="90" fill="${fg}" opacity=".08"/></g>`;
  else if(m==='sun') layer=`<circle cx="800" cy="560" r="322" fill="url(#a)" filter="url(#gg)"/><circle cx="800" cy="560" r="300" fill="${accent}"/>
${[0,1,2,3,4,5].map(i=>`<rect x="500" y="${430+i*46}" width="600" height="22" fill="${bg}"/>`).join('')}
<g stroke="${accent}" stroke-opacity=".5">${[-5,-3,-1,1,3,5].map(i=>`<line x1="800" y1="640" x2="${800+i*420}" y2="1000"/>`).join('')}${[700,800,920].map(y=>`<line x1="0" y1="${y}" x2="1600" y2="${y}"/>`).join('')}</g>`;
  else if(m==='tonal') layer=`${[0,1,2,3,4].map(i=>`<rect x="0" y="${i*200}" width="1600" height="200" fill="${i%2?accent:fg}" opacity="${0.045+i*0.014}"/>`).join('')}
<rect x="1080" y="0" width="2" height="1000" fill="${fg}" opacity=".10"/>
<ellipse cx="1180" cy="300" rx="640" ry="520" fill="url(#a)" filter="url(#s)" opacity=".5"/>`;
  else if(m==='horizon') layer=`<rect x="0" y="660" width="1600" height="340" fill="${fg}" opacity=".06"/>
<rect x="0" y="612" width="1600" height="60" fill="${accent}" opacity=".05" filter="url(#gg)"/>
<ellipse cx="1120" cy="652" rx="460" ry="280" fill="url(#a)" filter="url(#s)"/>
<line x1="0" y1="660" x2="1600" y2="660" stroke="${accent}" stroke-opacity=".35"/>
<ellipse cx="1120" cy="690" rx="300" ry="34" fill="${accent}" opacity=".10" filter="url(#gg)"/>
<path d="M180 880 Q 760 560 1480 240" stroke="${fg}" stroke-opacity=".16" stroke-width="3" fill="none"/>`;
  else if(m==='organic') layer=`<path d="M520 180 C 880 80 1280 240 1300 520 C 1320 800 980 920 700 860 C 420 800 280 560 360 380 C 410 270 430 215 520 180 Z" fill="url(#a)" filter="url(#s)"/>
<path d="M600 300 C 820 230 1080 340 1100 540 C 1115 720 900 800 720 760" fill="${accent}" opacity=".06" filter="url(#gg)"/>
<path d="M560 260 C 820 200 1140 320 1150 540 C 1160 760 900 840 690 790" fill="none" stroke="${accent}" stroke-opacity=".25" stroke-width="2"/>`;
  else if(m==='soft') layer=`<ellipse cx="820" cy="420" rx="600" ry="460" fill="url(#a)" filter="url(#s)"/><ellipse cx="560" cy="640" rx="360" ry="300" fill="${accent}" opacity=".05" filter="url(#s)"/>`;
  else if(m==='cosmos'){ const HS=(i,k)=>{const v=Math.sin(i*12.9898+k*78.233)*43758.5453;return v-Math.floor(v);};
    const stars=Array.from({length:140},(_,i)=>`<circle cx="${(HS(i,1)*1600)|0}" cy="${(HS(i,2)*1000)|0}" r="${(0.3+HS(i,3)*1.8).toFixed(2)}" opacity="${(0.12+HS(i,4)*0.6).toFixed(2)}"/>`).join('');
    layer=`<g fill="${fg}">${stars}</g>
<ellipse cx="1040" cy="470" rx="560" ry="560" fill="url(#a)" filter="url(#s)"/>
<g fill="none" stroke="${accent}" stroke-opacity=".22" transform="rotate(-17 1040 470)">${[170,255,345,455].map(r=>`<ellipse cx="1040" cy="470" rx="${r}" ry="${Math.round(r*0.6)}"/>`).join('')}</g>
<circle cx="1040" cy="470" r="40" fill="${accent}" opacity=".4" filter="url(#gg)"/><circle cx="1040" cy="470" r="6" fill="${fg}"/>`; }
  else layer=`<g fill="none">${Array.from({length:9},(_,r)=>Array.from({length:14},(_,c)=>`<circle cx="${80+c*112}" cy="${90+r*100}" r="2.4" fill="${accent}" fill-opacity=".32"/>`).join('')).join('')}</g>
<ellipse cx="430" cy="360" rx="360" ry="360" fill="url(#a)" filter="url(#s)"/><ellipse cx="1180" cy="660" rx="340" ry="340" fill="url(#a)" filter="url(#s)" opacity=".7"/><ellipse cx="880" cy="520" rx="260" ry="260" fill="${accent}" opacity=".05" filter="url(#s)"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img">${defs}<rect width="${W}" height="${H}" fill="url(#b)"/>${atmo}${layer}<rect width="${W}" height="${H}" fill="url(#lk)"/><rect width="${W}" height="${H}" fill="url(#v)"/><rect width="${W}" height="${H}" filter="url(#g)" opacity=".5"/></svg>`;
}
function resolveAsset(s){
  for(const ext of ['jpg','png','webp']){
    if(fs.existsSync(path.join(ROOT,'assets',`${s.id}-hero.${ext}`))) return `../assets/${s.id}-hero.${ext}`;
  }
  return `../assets/${s.id}.svg`;
}

/* ---------- 15 STYLE ARCHETYPES ----------
   Each style declares: palette vars, fonts, flags, a bespoke `layout`
   (ordered section keys), and content for generic (g) + real-estate (re).
   `extra` holds archetype-level texture copy reused by both variants. */
const STYLES = [
  { id:'01-luxury-dark', name:'Luxury Dark', refs:'Cartier · Obsidian Dew · OF Sakazuki',
    vars:{'--bg':'#0A0A0A','--surface':'#161412','--fg':'#F5F0E8','--accent':'#C9A96E','--card':'rgba(255,255,255,.035)','--card-bd':'rgba(201,169,110,.18)'},
    disp:'Cormorant Garamond', body:'Inter', threeD:true,
    layout:['heroProduct','storyQuote','productGrid','materialScroll','footerBare'],
    extra:{ quote:'A single complication. A lifetime of restraint.',
      materials:[['Sapphire','Grown over months, faceted by hand to a single axis of light.'],
        ['Rose Gold','Cast in-house from a 5N alloy, warmed by a trace of copper.'],
        ['Alligator','Matte Louisiana skin, hand-burnished, stitched in silk.'],
        ['Movement','618 components, assembled and adjusted by one watchmaker.']] },
    g:{ brand:'MAISON NOIR', kicker:'Haute Horlogerie', h1:'Time, distilled to its purest form.',
        sub:'A single complication. A lifetime of restraint. The atelier collection, hand-finished in Geneva.',
        cta:'Discover the collection', svc:['The Atelier','Bespoke Commission','Private Viewing'],
        svcd:['Every movement assembled by a single master watchmaker.','Your vision, realised across eighteen months of craft.','By appointment at the Geneva salon.'],
        stats:[['18','Months per piece'],['1','Watchmaker each'],['74','Years of house']] },
    re:{ brand:'NOIR ESTATES', kicker:'Private Residences', h1:'Architecture, distilled to its purest form.',
        sub:'A curated portfolio of architecturally significant homes. Discreet. Considered. Rare.',
        cta:'Request the portfolio', svc:['Curated Listings','Bespoke Search','Private Showing'],
        svcd:['A handful of significant residences, never mass-listed.','Your brief, matched across months of market intelligence.','By appointment with a single dedicated advisor.'],
        stats:[['$4.2M','Avg. residence'],['1','Advisor each'],['28','Days to close']] } },

  { id:'02-cinematic-video', name:'Cinematic Video', refs:'Terminal Logistics · Villa · Alpine · Hashgraph',
    vars:{'--bg':'#05050B','--surface':'#0C0C16','--fg':'#F4F6FB','--accent':'#E6B873','--card':'rgba(255,255,255,.05)','--card-bd':'rgba(255,255,255,.10)'},
    disp:'Bebas Neue', body:'DM Sans', threeD:false, video:true,
    layout:['heroVideo','statsBand','glassServices','processSteps','quoteCards','ctaBig','footerCols'],
    extra:{ steps:[['Brief','We map the route, the risk and the window.'],
      ['Engineer','Lanes, modes and contingencies, costed to the hour.'],
      ['Execute','Live tracking, one point of contact, no surprises.'],
      ['Close','Delivered on the promised window — measured, every time.']] },
    g:{ brand:'TERMINAL', kicker:'Global Logistics', h1:'The world moves on schedule.',
        sub:'Freight, forwarding and fulfilment across 140 countries — engineered to never miss a window.',
        cta:'Track a shipment', svc:['Ocean Freight','Air Cargo','Last Mile'],
        svcd:['FCL & LCL across every major lane.','Time-critical air with charter capability.','Same-day delivery in 38 metros.'],
        stats:[['140','Countries'],['2.1M','Shipments / yr'],['99.4','% on-time']] },
    re:{ brand:'MERIDIAN', kicker:'Real Estate Group', h1:'Your next move, on schedule.',
        sub:'Buying, selling and relocation — engineered to close on time, every time.',
        cta:'Book a consultation', svc:['Buy Side','List & Sell','Relocation'],
        svcd:['Off-market access and disciplined negotiation.','Cinematic listing media that moves fast.','End-to-end coordination across cities.'],
        stats:[['1,400','Closings'],['18','Days avg.'],['99','% list-to-sale']] } },

  { id:'03-dark-brutalist', name:'Dark Brutalist', refs:'Guilty Mind · SHAPESHIFT · Sazabi',
    vars:{'--bg':'#000000','--surface':'#000000','--fg':'#FFFFFF','--accent':'#FF2D16','--card':'transparent','--card-bd':'#FFFFFF','--btn-radius':'0','--card-radius':'0'},
    disp:'Anton', body:'IBM Plex Mono', threeD:false, brutal:true,
    layout:['heroType','manifesto','rawProof','numberedGet','emailInvert','footerBare'],
    extra:{ manifesto:['We do not do templates. We do not do safe. We do not do "on brand" when the brand is boring.',
      'Every system we ship is built to be remembered, then argued about, then copied.',
      'If it blends in, we failed. It will not blend in.'] },
    g:{ brand:'GUILTY/MIND', kicker:'Creative Studio — EST 2019', h1:'WE BREAK THE GRID ON PURPOSE',
        sub:'no filler. just teeth.', cta:'START A PROJECT', svc:['BRAND','MOTION','BUILD'],
        svcd:['Identity systems that do not blend in.','Loud, deliberate, frame-perfect motion.','Interfaces engineered to be remembered.'],
        stats:[['52','PROJECTS'],['11','AWARDS'],['0','TEMPLATES']] },
    re:{ brand:'BLACK/DOOR', kicker:'Property Studio — EST 2019', h1:'WE SELL HOMES ON PURPOSE',
        sub:'no fluff. just sold.', cta:'LIST WITH US', svc:['SELL','BUY','STAGE'],
        svcd:['Listing campaigns that do not blend in.','Aggressive, data-led buyer representation.','Staging engineered to be remembered.'],
        stats:[['340','SOLD'],['$210M','VOLUME'],['0','BORING LISTINGS']] } },

  { id:'04-3d-spline-webgl', name:'3D / WebGL', refs:'Spline Ice Cube · E.C.H.O. · JoyJam',
    vars:{'--bg':'#070A12','--surface':'#0E1322','--fg':'#EAF0FF','--accent':'#5BE0FF','--card':'rgba(255,255,255,.04)','--card-bd':'rgba(91,224,255,.18)'},
    disp:'Space Grotesk', body:'Inter', threeD:true,
    layout:['heroCanvas','howGlass','featureRows','logoMarquee','pricing','faq','ctaGradient','footerCols'],
    extra:{ faq:[['Does it run in the browser?','Yes — WebGL2, 60fps target, no plugin, no app.'],
      ['Can we bring our own 3D?','glTF / USDZ in, optimised automatically on upload.'],
      ['What about mobile?','Adaptive LOD; the same scene degrades gracefully to phones.']],
      tiers:[['Studio','$0','One scene, watermark, community support'],
        ['Pro','$49','Unlimited scenes, no watermark, analytics'],
        ['Scale','Talk','SLA, dedicated GPU, on-prem export']] },
    g:{ brand:'ECHO LABS', kicker:'Interactive Engineering', h1:'Built in three dimensions.',
        sub:'We design real-time 3D product experiences — configurators, portals and worlds that respond to you.',
        cta:'See the engine', svc:['Realtime 3D','Configurators','WebGL Worlds'],
        svcd:['60fps product scenes in the browser.','Pick, rotate, customise — instantly.','Immersive brand environments.'],
        stats:[['60','fps target'],['12','Engines shipped'],['4','Awwwards']] },
    re:{ brand:'DIMENSION', kicker:'Immersive Property', h1:'Tour homes in three dimensions.',
        sub:'Interactive 3D walkthroughs and configurable floorplans — buyers explore before they ever visit.',
        cta:'Launch a 3D tour', svc:['3D Walkthroughs','Floorplan Config','Virtual Staging'],
        svcd:['Photoreal scenes that load in-browser.','Reconfigure rooms and finishes live.','Stage empty homes in real time.'],
        stats:[['60','fps tours'],['320','Homes scanned'],['3.1x','More inquiries']] } },

  { id:'05-vaporwave', name:'Vaporwave', refs:'Sidewave',
    vars:{'--bg':'#1A0033','--surface':'#2A0A4A','--fg':'#FDF0FF','--accent':'#FF8C00','--card':'rgba(255,255,255,.06)','--card-bd':'rgba(255,0,110,.32)'},
    disp:'Archivo Black', body:'Space Grotesk', threeD:false, ripple:true,
    layout:['heroRipple','waveBand','releaseGrid','quoteCards','emailInvert','footerBare'],
    extra:{ releases:[['001 · Nightdrive','EP · 6 tracks'],['002 · Afterglow','Single'],
      ['003 · Violet Hour','EP · 5 tracks'],['004 · Signal','Single']] },
    g:{ brand:'SIDEWAVE', kicker:'Sound Collective', h1:'Feel the frequency.',
        sub:'An audio-reactive label and live event series. Wave after wave after wave.',
        cta:'Hear the wave', svc:['Releases','Live Sets','Sync'],
        svcd:['Genre-fluid drops every full moon.','Immersive audiovisual live shows.','Music licensing for film & games.'],
        stats:[['48','Releases'],['1.2M','Listeners'],['6','Continents']] },
    re:{ brand:'PULSE', kicker:'Lifestyle Real Estate', h1:'Feel the neighbourhood.',
        sub:'Bold listings for bold buyers — lofts, studios and creative spaces with a heartbeat.',
        cta:'Find your space', svc:['Lofts','Studios','Creative HQ'],
        svcd:['Industrial conversions with character.','Live-work units for makers.','Commercial creative footprints.'],
        stats:[['210','Spaces'],['38','Days avg.'],['6','Districts']] } },

  { id:'06-soft-editorial', name:'Soft Editorial', refs:'Maison de Synergy · Trendship · Bisous',
    vars:{'--bg':'#FAF0EB','--surface':'#F3E2D8','--fg':'#2C1810','--accent':'#B07D63','--card':'rgba(255,255,255,.6)','--card-bd':'rgba(44,24,16,.12)'},
    disp:'Cormorant Garamond', body:'Inter', threeD:false, light:true,
    layout:['heroSoft','editorialStatement','asymGrid','philosophy','journalCards','newsletter','footerBare'],
    extra:{ journal:[['On Slowness','Why a season should take a season.'],
      ['The Cutting Room','Notes from the atelier floor.'],
      ['Kept, Not Consumed','A wardrobe measured in years.']] },
    g:{ brand:'Maison de Synergy', kicker:'Atelier de Mode', h1:'Softness, with intention.',
        sub:'A slow-fashion atelier of considered pieces — made in small batches, made to be kept.',
        cta:'Explore the atelier', svc:['The Collection','Made to Order','The Journal'],
        svcd:['Seasonless essentials in natural fibre.','Cut and finished to your measure.','Notes on craft, slowness and care.'],
        stats:[['12','Pieces / season'],['100','% natural fibre'],['1','Atelier']] },
    re:{ brand:'Maison Living', kicker:'Boutique Real Estate', h1:'A home, with intention.',
        sub:'A boutique advisory for design-led homes — matched slowly, considered carefully.',
        cta:'Begin your search', svc:['Curated Homes','Concierge Search','The Journal'],
        svcd:['Design-forward residences, hand-selected.','A calm, guided buying experience.','Notes on neighbourhoods and living well.'],
        stats:[['40','Homes / year'],['1','Advisor'],['97','% referral']] } },

  { id:'07-saas-glass', name:'SaaS Glass', refs:'JoyJam · GSAP Engine · Hashgraph',
    vars:{'--bg':'#070710','--surface':'#0E0E1C','--fg':'#EEF1FF','--accent':'#7B61FF','--card':'rgba(255,255,255,.05)','--card-bd':'rgba(255,255,255,.12)'},
    disp:'Syne', body:'Inter', threeD:true,
    layout:['heroSaas','stackCards','personaCols','logoMarquee','pricing','faq','ctaGradient','footerCols'],
    extra:{ faq:[['Is there a free tier?','Yes — generous, no card, no expiry.'],
      ['Can I export my data?','One click, open formats, anytime.'],
      ['Do you take a cut of payments?','No platform fee on your revenue.']],
      tiers:[['Free','$0','Up to 3 projects, core analytics'],
        ['Pro','$24','Unlimited, payments, automations'],
        ['Team','$79','Roles, SSO, priority support']] },
    g:{ brand:'JoyJam', kicker:'Creator Platform', h1:'Ship your idea this weekend.',
        sub:'The all-in-one toolkit for creators — pages, payments and analytics, no code required.',
        cta:'Start free', svc:['Pages','Payments','Insights'],
        svcd:['Beautiful pages live in minutes.','Take money globally, day one.','Know exactly what converts.'],
        stats:[['120k','Creators'],['$48M','Paid out'],['4.9','★ rating']] },
    re:{ brand:'ListingOS', kicker:'Real Estate SaaS', h1:'List, market and close — in one place.',
        sub:'The all-in-one platform for modern agents: listings, lead capture and pipeline.',
        cta:'Start free trial', svc:['Listings','Lead Capture','Pipeline'],
        svcd:['Syndicated listings in minutes.','Capture and route every lead.','See every deal to close.'],
        stats:[['9,400','Agents'],['$2.1B','Closed'],['4.9','★ rating']] } },

  { id:'08-architecture-editorial', name:'Architecture Editorial', refs:'Fall Line House · Fifth & Dune · Alpine',
    vars:{'--bg':'#0B0B0A','--surface':'#141413','--fg':'#F0EEEB','--accent':'#9B9086','--card':'rgba(255,255,255,.03)','--card-bd':'rgba(255,255,255,.10)'},
    disp:'DM Serif Display', body:'Inter', threeD:false, editorial:true,
    layout:['heroPhoto','projectIndex','caseStudies','aboutTwoPara','contactEmail'],
    extra:{ projects:[['Cliff House','Sognefjord, NO','2024'],['Forest Pavilion','Nagano, JP','2023'],
      ['Water Cabin','West Coast, NZ','2022'],['Stone Court','Engadin, CH','2021']] },
    g:{ brand:'FALL LINE', kicker:'Architecture Studio', h1:'Houses that listen to the land.',
        sub:'A practice working at the edge — cliffside, forest and water. Selected works, 2014–2026.',
        cta:'View the work', svc:['Residential','Cultural','Landscape'],
        svcd:['Singular homes sited with restraint.','Public buildings that gather people.','Ground that frames the architecture.'],
        stats:[['38','Built works'],['9','Awards'],['12','Years']] },
    re:{ brand:'FALL LINE ESTATES', kicker:'Architectural Real Estate', h1:'Homes that listen to the land.',
        sub:'We represent architecturally significant properties — cliffside, forest and waterfront.',
        cta:'View the listings', svc:['Architectural','Waterfront','Estate Land'],
        svcd:['Design-significant homes, curated.','Rare waterfront with provenance.','Buildable land for a singular vision.'],
        stats:[['$310M','Sold'],['42','Listings'],['12','Years']] } },

  { id:'09-aviation-luxury', name:'Aviation Luxury', refs:'Jesko Jets · Sakazuki',
    vars:{'--bg':'#0C0C0C','--surface':'#161514','--fg':'#F5F2ED','--accent':'#C9A96E','--card':'rgba(245,242,237,.04)','--card-bd':'rgba(201,169,110,.20)','--btn-radius':'999px'},
    disp:'Space Grotesk', body:'Inter', threeD:false, clock:true,
    layout:['heroSplit','routesGrid','fleetStrip','membership','applyForm','footerBare'],
    extra:{ tiers:[['Charter','On-demand','Any city pair, wheels-up in 4h'],
      ['Jet Card','Fixed hours','Locked rate, zero surprises'],
      ['Management','Full ownership','Crew, maintenance, charter revenue']] },
    g:{ brand:'JESKO JETS', kicker:'Private Aviation', h1:'Anywhere. On your hour.',
        sub:'A global private fleet with a single standard of service. Wheels-up in as little as four hours.',
        cta:'Request a flight', svc:['Charter','Jet Card','Management'],
        svcd:['On-demand charter, any city pair.','Fixed-rate hours, zero surprises.','Full ownership management.'],
        stats:[['190','Aircraft'],['4h','To wheels-up'],['24/7','Crew']] },
    re:{ brand:'JESKO ESTATES', kicker:'Private Property Advisory', h1:'Anywhere. On your terms.',
        sub:'A global private-client property desk with a single standard. First viewings in 24 hours.',
        cta:'Request an advisor', svc:['Acquisition','Portfolio','Relocation'],
        svcd:['Off-market acquisition, any market.','Discreet portfolio management.','White-glove global relocation.'],
        stats:[['40','Markets'],['24h','To viewing'],['24/7','Advisor']] } },

  { id:'10-food-beauty-dtc', name:'Food / Beauty DTC', refs:"Casper's Caviar · Obsidian Dew",
    vars:{'--bg':'#080808','--surface':'#161210','--fg':'#F3EBDD','--accent':'#B48226','--card':'rgba(255,255,255,.04)','--card-bd':'rgba(180,130,40,.24)'},
    disp:'Playfair Display', body:'Inter', threeD:true, sticky:true,
    layout:['heroProduct','ingredientMosaic','ritualSteps','testimonialMarquee','productShelf','emailInvert','footerBare'],
    extra:{ mosaic:[['Single Origin','One estuary. One season. One grade.'],
      ['Cured Slow','A 200-year salt cure, never rushed.'],
      ['On Ice in 24h','Hand-packed, shipped cold, traceable.'],
      ['Nothing Added','No borax, no pasteurisation, no shortcuts.']],
      ritual:[['Chill','Tin and spoon, ten minutes, mother-of-pearl only.'],
        ['Open','Lift the lid. Do not stir.'],
        ['Taste','A pea-sized pearl on the back of the hand.'],
        ['Serve','Blini, crème fraîche, nothing louder.']],
      shelf:[['Oscietra','30g','$118'],['Beluga','30g','$240'],['Kaluga','30g','$96']] },
    g:{ brand:"CASPER'S", kicker:'Single-Origin Caviar', h1:'The ocean, at its rarest.',
        sub:'Sustainably farmed Oscietra, cured to a 200-year recipe and shipped on ice within 24 hours.',
        cta:'Shop the tin', svc:['The Caviar','Pairings','Gifting'],
        svcd:['Oscietra, Beluga and Kaluga grades.','Blinis, crème fraîche and service kit.','Hand-packed presentation boxes.'],
        stats:[['24h','To your door'],['1','Single origin'],['200','Year recipe']] },
    re:{ brand:'OBSIDIAN', kicker:'Boutique Listings', h1:'The market, at its rarest.',
        sub:'A small house of exceptional residences, presented with the polish of a luxury product launch.',
        cta:'View the residences', svc:['The Residences','Staging','Private Sale'],
        svcd:['A curated few, never the many.','Magazine-grade presentation.','Quiet, off-market transactions.'],
        stats:[['24h','To private viewing'],['1','Curator'],['100','% discreet']] } },

  { id:'11-japanese-web3', name:'Japanese / Community', refs:'OF Sakazuki',
    vars:{'--bg':'#0C0807','--surface':'#1A100E','--fg':'#F0E6D3','--accent':'#C2670C','--card':'rgba(255,255,255,.04)','--card-bd':'rgba(194,103,12,.28)'},
    disp:'Cormorant Garamond', body:'Space Grotesk', threeD:true, vanta:'fog',
    layout:['heroProduct','circleVault','membership','quoteCards','parentheticalFooter'],
    extra:{ vault:[['盃 · The Circle','A community measured in trust, not headcount.'],
      ['蔵 · The Vault','Curated craft, released slowly, to members first.'],
      ['儀 · The Rituals','Gatherings, seasonal and rare, by introduction.']],
      tiers:[['Allowlist','By introduction','Sponsored by one member'],
        ['Member','Active','Full vault + rituals access'],
        ['Keeper','Lifetime','Stewardship of one ritual']] },
    g:{ brand:'盃 SAKAZUKI', kicker:'( Members Only )', h1:'Connection beyond access.',
        sub:'A private circle for collectors of craft and fire. Membership is by allowlist, by introduction only.',
        cta:'APPLY ALLOWLIST', svc:['The Circle','The Vault','The Rituals'],
        svcd:['A community measured in trust.','Curated craft, released slowly.','Gatherings, seasonal and rare.'],
        stats:[['888','Members'],['1','Allowlist'],['∞','Patience']] },
    re:{ brand:'盃 KINDRED', kicker:'( By Introduction )', h1:'Homes beyond the listing.',
        sub:'A private property circle for discerning buyers. Off-market homes, by introduction only.',
        cta:'REQUEST ENTRY', svc:['The Circle','The Vault','The Viewings'],
        svcd:['A trusted network of buyers & sellers.','Off-market homes, released slowly.','Private viewings, by appointment.'],
        stats:[['88','Members'],['1','Waitlist'],['100','% off-market']] } },

  { id:'12-experimental-dev', name:'Experimental / Dev', refs:'E.C.H.O. · Robert Borghesi · IDOM',
    vars:{'--bg':'#000000','--surface':'#070707','--fg':'#EDEDED','--accent':'#FF3B3B','--card':'rgba(255,255,255,.03)','--card-bd':'rgba(255,59,59,.26)','--btn-radius':'0'},
    disp:'Space Grotesk', body:'IBM Plex Mono', threeD:true, minimal:true,
    layout:['heroCanvas','caseStudies','capabilitySlides','aboutTwoPara','contactBlack'],
    extra:{ caps:[['WebGL / Shaders','Custom GLSL, post-processing, 60fps budgets.'],
      ['Motion Systems','GSAP timelines, scroll choreography, transitions.'],
      ['Creative Tooling','Generative systems, editors, internal toys.'],
      ['Performance','Profiling, LOD, the boring work that makes it fast.']] },
    g:{ brand:'R.B.', kicker:'Creative Developer', h1:'I build the strange ones.',
        sub:'Independent creative developer. WebGL, motion and the experiments other studios will not ship.',
        cta:'Get in touch', svc:['Selected Work','Experiments','Availability'],
        svcd:['Selected client + lab projects.','Open-source shaders and toys.','Available Q3 2026.'],
        stats:[['41','Projects'],['7','FWA'],['1','Human']] },
    re:{ brand:'PLOT.', kicker:'Property × Code', h1:'I build property the strange way.',
        sub:'A one-person studio building experimental real-estate experiences — maps, 3D, data.',
        cta:'Get in touch', svc:['Selected Work','Experiments','Availability'],
        svcd:['Interactive listing + map builds.','Open data + 3D neighbourhood toys.','Available for select projects.'],
        stats:[['41','Builds'],['7','Awards'],['1','Human']] } },

  { id:'13-wellness-botanical', name:'Wellness Botanical', refs:'Coco Veda',
    vars:{'--bg':'#F6F1E7','--surface':'#EAE0CE','--fg':'#2C2A22','--accent':'#6F8F5F','--card':'rgba(255,255,255,.62)','--card-bd':'rgba(44,42,34,.14)'},
    disp:'Cormorant Garamond', body:'Inter', threeD:false, light:true,
    layout:['heroSoft','editorialStatement','asymGrid','ritualSteps','ingredientMosaic','journalCards','newsletter','footerBare'],
    extra:{ quote:'Healing begins when body, mind and spirit return to balance.',
      journal:[['The Coconut, Whole','Why we cold-process, and never refine.'],
        ['From Tree to Hand','A day with our craftswomen in Manila.'],
        ['Ayurveda, Daily','Small rituals, repeated, that actually hold.']],
      mosaic:[['Cold-Processed VCO','Our signature virgin coconut oil, pressed without heat.'],
        ['Single Origin','One archipelago, smallholder groves, full traceability.'],
        ['Handcrafted in Manila','Blended in small batches by expert craftswomen.'],
        ['Farmer Cooperatives','No middlemen — value returns to rural Philippine farmers.']],
      ritual:[['Warm','Soften a little oil between the palms.'],
        ['Anoint','Work through hair and skin, with intention.'],
        ['Breathe','Two slow minutes. Let it absorb.'],
        ['Keep','The same small care, repeated daily.']] },
    g:{ brand:'COCO VEDA', kicker:'Live Healthy · Live Well · Live Natural',
        h1:'Nature, handcrafted into wellness.',
        sub:'Over 100 cold-processed virgin coconut and plant-based products — Ayurveda-inspired, sustainably sourced from Philippine farmer cooperatives, handcrafted in Manila since 2015.',
        cta:'Explore the range', svc:['Coconut Oil & Wellness','Hair, Skin & Body','Sustainable Sourcing'],
        svcd:['Signature cold-processed virgin coconut oil at the heart of every blend.','Massage, hair, facial, body, lip, baby and pet care — over a hundred products.','Direct farmer cooperatives, fair value, a lighter footprint.'],
        stats:[['100+','Handcrafted products'],['2015','Crafting since'],['1','Single origin']] },
    re:{ brand:'COCO VEDA RETREATS', kicker:'Live Well · By the Coconut Grove',
        h1:'A home, in balance with nature.',
        sub:'A small collection of wellness residences set within working coconut groves — designed around Ayurvedic calm and slow, natural living.',
        cta:'Request the portfolio', svc:['Grove Residences','Retreat Estates','Wellness Tenancy'],
        svcd:['Homes sited within working coconut groves.','Turnkey retreat properties with land and provenance.','Long-stay wellness leases, fully serviced.'],
        stats:[['12','Residences'],['2015','Established'],['100','% natural setting']] } },

  { id:'14-cosmic-platform', name:'Cosmic Engine', refs:'Starry Labs',
    vars:{'--bg':'#070611','--surface':'#11102A','--fg':'#EDEBFA','--accent':'#9E8CFF','--card':'rgba(255,255,255,.045)','--card-bd':'rgba(158,140,255,.20)'},
    disp:'Cormorant Garamond', body:'Inter', threeD:false,
    layout:['heroProduct','manifesto','featureRows','processSteps','pricing','faq','contactBlack'],
    extra:{
      manifesto:[
        'Time is not a clock. It is the distance between conscious events — measurable, addressable, computable.',
        'We take the same ephemeris space agencies trust and turn thirty thousand lines of it into patterns you can query.',
        'The kernel stays ours. The API is yours to build on.'],
      steps:[
        ['Resolve','A moment and a place become precise celestial coordinates.'],
        ['Compute','NASA-grade ephemeris resolves every planet, asteroid and lunar node.'],
        ['Pattern','The engine maps positions to the pattern set you requested.'],
        ['Return','One clean JSON answer — fast enough to build a product on.']],
      tiers:[
        ['Explorer','Free','Invite-only beta access to the core endpoints, rate-limited.'],
        ['Builder','Usage','Metered per computation. Full ephemeris, full pattern set.'],
        ['Observatory','Talk','Dedicated throughput, on-prem kernel, direct support.']],
      faq:[
        ['Is this an app I download?','No. dm-ck-core is a computation engine you build on, not a consumer app.'],
        ['How accurate is the astronomy?','The same math space agencies use — every planet, asteroid and lunar node.'],
        ['Can I see the kernel?','The kernel stays proprietary while the API and pricing stabilize.'],
        ['How is it priced?','Usage-based, metered per computation. The beta is invite-only.']] },
    g:{ brand:'STARRY LABS', kicker:'Time is the distance between conscious events',
        h1:'NASA-grade astronomy, as a computation engine.',
        sub:'Thirty thousand lines turning planetary positions into psychological patterns you can query — an AWS for astronomical and esoteric pattern matching. A kernel you build on, not an app. Private beta.',
        cta:'Request beta access', svc:['Astronomical Core','Pattern Computation','Developer API'],
        svcd:['NASA-grade ephemeris tracking every planet, asteroid and lunar node.','Positions resolved into the psychological patterns your product needs.','One stable, usage-priced API — the kernel stays ours, the build is yours.'],
        stats:[['30K','Lines in the kernel'],['9','Bodies + nodes tracked'],['1','API to build on']] },
    re:{ brand:'STARRY LABS', kicker:'Locational timing intelligence',
        h1:'Where and when, computed.',
        sub:'Relocation-grade locational and timing intelligence for property decisions — the same NASA-grade ephemeris, scored for place and moment, delivered as an API.',
        cta:'Request beta access', svc:['Locational Engine','Timing Windows','Developer API'],
        svcd:['Astrocartography-grade scoring for any coordinate on Earth.','The moments a place is most and least favourable, computed.','One stable, usage-priced API to build location products on.'],
        stats:[['30K','Lines in the kernel'],['195','Countries scored'],['1','API to build on']] } },

  { id:'15-resort-residences', name:'Resort & Residences', refs:'Aman · Six Senses',
    vars:{'--bg':'#F5F0E6','--surface':'#E9DFC9','--fg':'#2B2620','--accent':'#9C7B4A','--card':'rgba(255,255,255,.60)','--card-bd':'rgba(43,38,32,.14)'},
    disp:'Cormorant Garamond', body:'Inter', threeD:false, light:true,
    layout:['heroSoft','editorialStatement','asymGrid','ritualSteps','ingredientMosaic','journalCards','newsletter','footerBare'],
    extra:{
      ritual:[
        ['Arrive','A boat, not a lobby. The day slows on the water.'],
        ['Wander','Sand paths, no cars, the architecture half-hidden in the trees.'],
        ['Be fed','One table, produce from the land, nothing on a schedule.'],
        ['Disappear','A villa, the sea, and no real reason to leave it.']],
      mosaic:[
        ['The setting','A private bay reached only by water — no road, no neighbours.'],
        ['The architecture','Low local stone and timber the landscape quietly swallows.'],
        ['The privacy','Twenty-four villas across forty hectares. You will not see the others.'],
        ['The service','One host per villa, anticipating rather than asking.']],
      tiers:[
        ['Garden Villa','from $1,400 / night','One bedroom, plunge pool, walled garden.'],
        ['Bay Pavilion','from $2,600 / night','Two bedrooms, infinity edge, direct sand.'],
        ['The Reserve','On request','The whole headland, fully staffed, exclusive use.']],
      journal:[
        ['Building with the land','Why we moved the resort, and not the trees.'],
        ['The one-table kitchen','A menu decided by the morning catch.'],
        ['Keeping a bay quiet','The case for fewer rooms, forever.']] },
    g:{ brand:'AMARA', kicker:'A coastline kept quiet',
        h1:'A resort that disappears into the land.',
        sub:'A barefoot-luxury resort of twenty-four villas on a private bay — designed around the landscape and the silence, with service that anticipates rather than asks.',
        cta:'Reserve your stay', svc:['Villas & Pavilions','The Spa & Table','The Setting'],
        svcd:['Twenty-four villas and pavilions, each with its own water and walled quiet.','A single table from the land and sea, and a spa built into the rock.','Forty private hectares on a bay reached only by boat.'],
        stats:[['24','Private villas'],['1','Untouched bay'],['40','Hectares, kept wild']] },
    re:{ brand:'AMARA RESIDENCES', kicker:'Own a piece of the quiet',
        h1:'A home, inside the resort.',
        sub:'A limited collection of freehold branded residences within the resort — full hotel service, a managed rental programme, and a bay that stays this quiet on purpose.',
        cta:'Register interest', svc:['The Residences','Ownership & Service','The Investment'],
        svcd:['Eighteen architect-designed homes woven into the resort grounds.','Freehold title, full resort service, optional managed rental.','A scarce, branded, income-producing asset on protected land.'],
        stats:[['18','Branded residences'],['Freehold','Title held'],['365','Days of service']] } },
];

/* ---------- 20 REELS -> archetype + a tasteful per-reel brand ----------
   Reels reuse their archetype layout but get a distinct house name and
   kicker (NOT the raw reel label uppercased — that read as a demo tell). */
const REELS = [
  { n:1,  site:'Cartier Watch',           style:'01-luxury-dark',           brand:'MAISON HORLOGÈRE', kicker:'Haute Horlogerie' },
  { n:2,  site:'Terminal Logistics',      style:'02-cinematic-video',       brand:'TERMINAL',         kicker:'Global Logistics' },
  { n:3,  site:'Guilty Mind',             style:'03-dark-brutalist',        brand:'GUILTY/MIND',      kicker:'Creative Studio' },
  { n:4,  site:'GSAP Animation Engine',   style:'12-experimental-dev',      brand:'KINETIC',          kicker:'Motion Engineering' },
  { n:5,  site:'Sidewave Music',          style:'05-vaporwave',             brand:'SIDEWAVE',         kicker:'Sound Collective' },
  { n:6,  site:'OF Sakazuki',             style:'11-japanese-web3',         brand:'盃 SAKAZUKI',       kicker:'( Members Only )' },
  { n:7,  site:'Obsidian Dew',            style:'10-food-beauty-dtc',       brand:'OBSIDIAN DEW',     kicker:'Volcanic Skincare' },
  { n:8,  site:'Hashgraph Ventures',      style:'02-cinematic-video',       brand:'HASHGRAPH',        kicker:'Venture Capital' },
  { n:9,  site:'Spline Ice Cube',         style:'04-3d-spline-webgl',       brand:'GLACIER',          kicker:'Realtime 3D' },
  { n:10, site:'Fall Line House',         style:'08-architecture-editorial',brand:'FALL LINE',        kicker:'Architecture Studio' },
  { n:11, site:'Relats / Periflex',       style:'03-dark-brutalist',        brand:'PERIFLEX',         kicker:'Industrial Systems' },
  { n:12, site:'Maison de Synergy',       style:'06-soft-editorial',        brand:'Maison de Synergy',kicker:'Atelier de Mode' },
  { n:13, site:'Design Agency',           style:'12-experimental-dev',      brand:'STUDIO INDEX',     kicker:'Design & Code' },
  { n:14, site:'Cartier Watches & Wonders',style:'06-soft-editorial',       brand:'Watches & Wonders',kicker:'Maison Gallery' },
  { n:15, site:'E.C.H.O. / Active Theory',style:'12-experimental-dev',      brand:'E.C.H.O.',         kicker:'Immersive WebGL' },
  { n:16, site:"Casper's Caviar",         style:'10-food-beauty-dtc',       brand:"CASPER'S",         kicker:'Single-Origin Caviar' },
  { n:17, site:'Villa Maravilha',         style:'02-cinematic-video',       brand:'MARAVILHA',        kicker:'Private Villa' },
  { n:18, site:'Jesko Jets',              style:'09-aviation-luxury',       brand:'JESKO JETS',       kicker:'Private Aviation' },
  { n:19, site:'Alpine Chalets',          style:'08-architecture-editorial',brand:'ALPINE',           kicker:'Mountain Residences' },
  { n:20, site:'JoyJam',                  style:'07-saas-glass',            brand:'JoyJam',           kicker:'Creator Platform' },
];

/* ============================================================
   SECTION RENDERERS — each archetype composes a bespoke subset.
   `x` = render context: { c, s, ex, accent, light } where
   c = variant content, s = style, ex = style.extra.
   ============================================================ */
const wrapOpen = '<div class="wrap">';
const A = (href,txt,cls)=>`<a href="${href||'#'}"${cls?` class="${cls}"`:''}>${txt}</a>`;

/* ---- HEROES ---- */
function heroProduct(x){ // luxury / food / japanese — glowing centred product
  const {c,s} = x;
  const visual = s.threeD
    ? `<canvas id="bg3d" aria-hidden="true"></canvas><div class="orb" aria-hidden="true"></div>`
    : `<div class="orb" aria-hidden="true"></div>`;
  return `<header class="hero hero--product">
  ${visual}
  <div class="veil" style="background:radial-gradient(58% 58% at 64% 38%,color-mix(in srgb,var(--accent) 13%,transparent),transparent 70%)"></div>
  ${wrapOpen}
    <div class="eyebrow" data-reveal>${esc(c.kicker)}</div>
    <h1>${esc(c.h1)}</h1>
    <p class="lead" data-reveal data-reveal-d="2">${esc(c.sub)}</p>
    <div class="hero-cta" data-reveal data-reveal-d="3">${A('#story',c.cta+' &rarr;','link-cta')}</div>
  </div>
  <span class="scrollcue" aria-hidden="true">Scroll</span>
</header>`;
}
function heroVideo(x){
  const {c,s} = x;
  return `<header class="hero hero--video">
  <img class="media" src="${resolveAsset(s)}" alt="" aria-hidden="true" loading="eager" decoding="async">
  <div class="scrim"></div>
  ${wrapOpen}
    <div class="eyebrow" data-reveal>${esc(c.kicker)}</div>
    <h1>${esc(c.h1)}</h1>
    <p class="lead" data-reveal data-reveal-d="2">${esc(c.sub)}</p>
    <div class="hero-cta" data-reveal data-reveal-d="3">${A('#contact',c.cta,'btn btn-primary magnetic')}</div>
  </div>
  <div class="hero-badge" data-reveal data-reveal-d="4">${esc(c.stats[0][0])} ${esc(c.stats[0][1])} &middot; ${esc(c.stats[2][0])} ${esc(c.stats[2][1])}</div>
  <span class="scrollcue" aria-hidden="true">Scroll &darr;</span>
</header>`;
}
function heroType(x){ // brutalist — type only
  const {c} = x;
  return `<header class="hero hero--type">
  ${wrapOpen}
    <h1 data-scramble>${esc(c.h1)}</h1>
    <p class="mono-sub" data-reveal>${esc(c.sub)}</p>
    <div class="hero-cta" data-reveal data-reveal-d="2">${A('#join','[ '+c.cta+' ]','btn')}</div>
  </div>
</header>`;
}
function heroCanvas(x){ // spline/experimental — 3D canvas, content layered
  const {c} = x;
  return `<header class="hero hero--canvas">
  <canvas id="bg3d" aria-hidden="true"></canvas>
  <div class="veil" style="background:radial-gradient(50% 50% at 50% 50%,transparent,var(--bg) 78%)"></div>
  ${wrapOpen}
    <div class="eyebrow" data-reveal>${esc(c.kicker)}</div>
    <h1>${esc(c.h1)}</h1>
    <p class="lead" data-reveal data-reveal-d="2">${esc(c.sub)}</p>
    <div class="hero-cta" data-reveal data-reveal-d="3">
      ${A('#contact',c.cta,'btn btn-primary magnetic')} ${A('#work','Selected work','btn btn-ghost magnetic')}
    </div>
  </div>
  <span class="scrollcue" aria-hidden="true">Scroll</span>
</header>`;
}
function heroRipple(x){
  const {c} = x;
  return `<header class="hero hero--ripple">
  <div class="ripple-wrap" aria-hidden="true"><div class="glow"></div>
    <div class="ring r1"></div><div class="ring r2"></div><div class="ring r3"></div><div class="ring r4"></div><div class="ring r5"></div></div>
  ${wrapOpen}
    <div class="eyebrow" data-reveal>${esc(c.kicker)}</div>
    <h1>${esc(c.h1)}</h1>
    <p class="lead" data-reveal data-reveal-d="2">${esc(c.sub)}</p>
    <div class="hero-cta" data-reveal data-reveal-d="3">${A('#listen',c.cta,'btn btn-primary magnetic')}</div>
  </div>
</header>`;
}
function heroSoft(x){
  const {c} = x;
  return `<header class="hero hero--soft">
  <div class="soft-glow" aria-hidden="true"></div>
  ${wrapOpen}
    <div class="eyebrow" data-reveal>${esc(c.kicker)}</div>
    <h1>${esc(c.h1)}</h1>
    <p class="lead" data-reveal data-reveal-d="2">${esc(c.sub)}</p>
    <div class="hero-cta" data-reveal data-reveal-d="3">${A('#collection',c.cta+' &rarr;','link-cta')}</div>
  </div>
</header>`;
}
function heroSplit(x){ // aviation — split + clock + ticker
  const {c,s} = x;
  return `<header class="hero hero--split">
  <div class="split-media" style="background-image:linear-gradient(90deg,var(--bg),transparent 60%),url('${resolveAsset(s)}')" aria-hidden="true"></div>
  ${wrapOpen}
    <div class="eyebrow" data-reveal>${esc(c.kicker)}</div>
    <h1>${esc(c.h1)}</h1>
    <p class="lead" data-reveal data-reveal-d="2">${esc(c.sub)}</p>
    <div class="av-meta" data-reveal data-reveal-d="3">
      <div id="clock" class="av-clock">--:--</div>
      <div class="av-ticker-wrap">Next departure &middot; <span id="ticker" class="av-ticker" data-dests="Tokyo,Dubai,Geneva,London,New York,Seoul,Zurich">Tokyo</span></div>
    </div>
    <div class="hero-cta" data-reveal data-reveal-d="4">${A('#apply',c.cta+' &rarr;','btn btn-primary magnetic')}</div>
  </div>
</header>`;
}
function heroPhoto(x){ // architecture — full-bleed photo + italic overlay
  const {c,s} = x;
  return `<header class="hero hero--photo">
  <img class="media" src="${resolveAsset(s)}" alt="" aria-hidden="true" loading="eager" decoding="async">
  <div class="scrim scrim--soft"></div>
  ${wrapOpen}
    <div class="eyebrow" data-reveal>${esc(c.kicker)}</div>
    <h1>${esc(c.h1)}</h1>
    <p class="lead" data-reveal data-reveal-d="2">${esc(c.sub)}</p>
  </div>
  <span class="scrollcue" aria-hidden="true">Selected works &darr;</span>
</header>`;
}
function heroSaas(x){
  const {c} = x;
  return `<header class="hero hero--saas">
  <div class="mesh" aria-hidden="true"></div>
  ${wrapOpen}
    <div class="eyebrow" data-reveal>${esc(c.kicker)}</div>
    <h1>${esc(c.h1)}</h1>
    <p class="lead" data-reveal data-reveal-d="2">${esc(c.sub)}</p>
    <div class="hero-cta" data-reveal data-reveal-d="3">
      ${A('#pricing',c.cta,'btn btn-primary magnetic')} ${A('#how','See how','btn btn-ghost magnetic')}
    </div>
    <div class="device" data-reveal data-reveal-d="4" aria-hidden="true"><div class="device-screen"></div></div>
  </div>
</header>`;
}

/* ---- BODY SECTIONS ---- */
function sectionHead(eyebrow,title){
  return `<div class="sec-head"><div class="eyebrow" data-reveal>${esc(eyebrow)}</div><h2 class="clip-line">${esc(title)}</h2></div>`;
}
function storyQuote(x){ const {c,ex}=x; return `<section class="sec" id="story"><div class="wrap grid g2 story">
  <blockquote class="big-quote" data-reveal>${esc(ex.quote)}</blockquote>
  <div data-reveal data-reveal-d="2"><p class="lead">${esc(c.sub)}</p><p class="muted" style="margin-top:1.2rem">${esc(c.svcd[0])}</p></div>
</div></section>`; }
function productGrid(x){ const {c}=x; return `<section class="sec" id="work"><div class="wrap">
  ${sectionHead('The house','What we keep rare.')}
  <div class="grid g3">${c.svc.map((s,i)=>`<article class="prod" data-reveal data-reveal-d="${i+1}"><span class="prod-i">0${i+1}</span><h3>${esc(s)}</h3><p class="muted">${esc(c.svcd[i])}</p></article>`).join('')}</div>
</div></section>`; }
function materialScroll(x){ const {ex}=x; const items=ex.materials||[]; return `<section class="sec sec--flush" id="material"><div class="wrap">${sectionHead('Material','Made of few things, chosen well.')}</div>
  <div class="hscroll"><div class="hscroll-track">${items.map((m,i)=>`<article class="hpanel" data-reveal data-reveal-d="${(i%4)+1}"><div class="hpanel-n">${String(i+1).padStart(2,'0')}</div><h3>${esc(m[0])}</h3><p class="muted">${esc(m[1])}</p></article>`).join('')}</div></div>
</section>`; }
function statsBand(x){ const {c}=x; return `<section class="sec statsband" id="stats"><div class="wrap"><div class="stats">${c.stats.map(st=>{
  const m=String(st[0]).match(/^([^\d]*)([\d.,]+)(.*)$/);
  return m?`<div class="stat" data-reveal><div class="num" data-count="${m[2].replace(/,/g,'')}" data-prefix="${m[1]}" data-suffix="${m[3]}">${m[1]}0${m[3]}</div><div class="lbl">${esc(st[1])}</div></div>`
  :`<div class="stat" data-reveal><div class="num">${esc(st[0])}</div><div class="lbl">${esc(st[1])}</div></div>`;}).join('')}</div></div></section>`; }
function glassServices(x){ const {c}=x; return `<section class="sec" id="work"><div class="wrap">${sectionHead('Capabilities',`${c.svc[0]}, ${c.svc[1]} & ${c.svc[2]}.`)}
  <div class="grid g3">${c.svc.map((s,i)=>`<article class="glass" data-reveal data-reveal-d="${i+1}"><h3>${esc(s)}</h3><p class="muted">${esc(c.svcd[i])}</p><span class="arrow">&rarr;</span></article>`).join('')}</div></div></section>`; }
function processSteps(x){ const {ex}=x; const st=ex.steps||[]; return `<section class="sec" id="process"><div class="wrap">${sectionHead('How it works','One window. No surprises.')}
  <ol class="steps">${st.map((s,i)=>`<li class="step" data-reveal data-reveal-d="${(i%4)+1}"><span class="step-n">${i+1}</span><h3>${esc(s[0])}</h3><p class="muted">${esc(s[1])}</p></li>`).join('')}</ol></div></section>`; }
function quoteCards(x){ const {c}=x; const q=[[c.svcd[0],c.brand],[c.svcd[1],c.kicker],[c.svcd[2],c.brand]]; return `<section class="sec" id="proof"><div class="wrap">${sectionHead('In their words','Trusted where it matters.')}
  <div class="grid g3">${q.map((t,i)=>`<figure class="qcard" data-reveal data-reveal-d="${i+1}"><blockquote>${esc(t[0])}</blockquote><figcaption class="muted">— ${esc(t[1])}</figcaption></figure>`).join('')}</div></div></section>`; }
function ctaBig(x){ const {c}=x; return `<section class="sec cta-big" id="contact"><div class="wrap" style="text-align:center">
  <h2 class="clip-line" style="margin:0 auto 2rem;max-width:16ch">Ready when you are.</h2>
  ${A('#',c.cta,'btn btn-primary magnetic')}</div></section>`; }
function ctaGradient(x){ const {c}=x; return `<section class="sec cta-grad" id="contact"><div class="wrap" style="text-align:center">
  <div class="eyebrow" data-reveal>Get started</div>
  <h2 class="clip-line grad-text" style="margin:.6rem auto 2rem;max-width:18ch">${esc(c.h1)}</h2>
  ${A('#',c.cta,'btn btn-primary magnetic')}</div></section>`; }
function manifesto(x){ const {ex}=x; return `<section class="sec manifesto" id="about"><div class="wrap narrow">
  ${ex.manifesto.map((p,i)=>`<p class="manifesto-p" data-reveal data-reveal-d="${(i%3)+1}">${esc(p)}</p>`).join('')}
</div></section>`; }
function rawProof(x){ const {c}=x; const items=[c.svcd[0],c.svcd[1],c.svcd[2],c.sub]; return `<section class="sec" id="proof"><div class="wrap narrow">
  ${items.map((t,i)=>`<p class="raw-q" data-reveal data-reveal-d="${(i%3)+1}">"${esc(t)}" <span class="raw-by">— CLIENT ${String(i+1).padStart(3,'0')}</span></p>`).join('')}</div></section>`; }
function numberedGet(x){ const {c}=x; return `<section class="sec" id="work"><div class="wrap narrow">
  <h2 class="clip-line" style="margin-bottom:2.4rem">WHAT YOU GET</h2>
  <ol class="big-list">${c.svc.map((s,i)=>`<li data-reveal data-reveal-d="${(i%3)+1}"><span>${String(i+1).padStart(2,'0')}</span>${esc(s)} — ${esc(c.svcd[i])}</li>`).join('')}</ol></div></section>`; }
function emailInvert(x){ const {c}=x; return `<section class="sec email-cap" id="join"><div class="wrap" style="text-align:center">
  <h2 class="clip-line" style="margin:0 auto 1.6rem;max-width:14ch">${esc(c.cta)}.</h2>
  <form class="email-row" onsubmit="return false"><input type="email" placeholder="you@email.com" aria-label="Email" required><button class="btn btn-primary" type="submit">Join</button></form></div></section>`; }
function featureRows(x){ const {c}=x; return `<section class="sec" id="work"><div class="wrap">${sectionHead('What you build','From idea to live.')}
  ${c.svc.map((s,i)=>`<div class="frow${i%2?' frow--rev':''}" data-reveal><div class="frow-txt"><div class="eyebrow">0${i+1}</div><h3>${esc(s)}</h3><p class="muted">${esc(c.svcd[i])}</p></div><div class="frow-vis" aria-hidden="true"></div></div>`).join('')}</div></section>`; }
function logoMarquee(x){ const {c}=x; const w=[c.brand,c.kicker,c.svc[0],c.svc[1],c.svc[2]]; const row=w.concat(w).concat(w).map(t=>`<span>${esc(t)}</span><span class="dot">·</span>`).join(''); return `<div class="logo-mq" aria-hidden="true"><div class="logo-mq-track">${row}</div></div>`; }
function pricing(x){ const {ex,c}=x; const t=ex.tiers||[['Starter','$0',c.svcd[0]],['Pro','$24',c.svcd[1]],['Scale','Talk',c.svcd[2]]]; return `<section class="sec" id="pricing"><div class="wrap">${sectionHead('Pricing','Simple, by design.')}
  <div class="grid g3 price-grid">${t.map((p,i)=>`<article class="price${i===1?' price--hot':''}" data-reveal data-reveal-d="${i+1}"><div class="price-name">${esc(p[0])}</div><div class="price-amt">${esc(p[1])}</div><p class="muted">${esc(p[2])}</p><a href="#" class="btn ${i===1?'btn-primary':'btn-ghost'} magnetic">${esc(c.cta)}</a></article>`).join('')}</div></div></section>`; }
function faq(x){ const {ex}=x; const f=ex.faq||[]; return `<section class="sec" id="faq"><div class="wrap narrow">${sectionHead('Questions','The short answers.')}
  <div class="faq">${f.map((q,i)=>`<details class="faq-i" data-reveal data-reveal-d="${(i%3)+1}"${i===0?' open':''}><summary>${esc(q[0])}</summary><p class="muted">${esc(q[1])}</p></details>`).join('')}</div></div></section>`; }
function personaCols(x){ const {c}=x; return `<section class="sec" id="who"><div class="wrap">${sectionHead('Built for',`For ${c.svc[0].toLowerCase()}, ${c.svc[1].toLowerCase()} & ${c.svc[2].toLowerCase()}.`)}
  <div class="grid g3">${c.svc.map((s,i)=>`<article class="persona" data-reveal data-reveal-d="${i+1}"><h3>${esc(s)}</h3><p class="muted">${esc(c.svcd[i])}</p></article>`).join('')}</div></div></section>`; }
function stackCards(x){ const {c}=x; return `<section class="sec stack-sec" id="how"><div class="wrap">${sectionHead('The product','Everything, in one place.')}
  <div class="stack">${c.svc.map((s,i)=>`<article class="stack-c" data-reveal style="--i:${i}"><div class="eyebrow">0${i+1}</div><h3>${esc(s)}</h3><p class="muted">${esc(c.svcd[i])}</p></article>`).join('')}</div></div></section>`; }
function editorialStatement(x){ const {c}=x; return `<section class="sec" id="collection"><div class="wrap narrow" style="text-align:center">
  <p class="ed-statement" data-reveal>${esc(c.sub)}</p></div></section>`; }
function asymGrid(x){ const {c}=x; return `<section class="sec" id="work"><div class="wrap">${sectionHead('The collection','Considered, not seasonal.')}
  <div class="asym">${c.svc.map((s,i)=>`<figure class="asym-i asym-${i+1}" data-reveal data-reveal-d="${(i%3)+1}"><div class="asym-vis" aria-hidden="true"></div><figcaption><span>0${i+1}</span> ${esc(s)}</figcaption></figure>`).join('')}</div></div></section>`; }
function philosophy(x){ const {c,ex}=x; return `<section class="sec" id="about"><div class="wrap narrow">
  <p class="ed-statement" data-reveal>${esc(ex.quote||c.svcd[0])}</p>
  <p class="lead" data-reveal data-reveal-d="2" style="margin-top:1.6rem">${esc(c.sub)}</p></div></section>`; }
function journalCards(x){ const {ex}=x; const j=ex.journal||[]; return `<section class="sec" id="journal"><div class="wrap">${sectionHead('The journal','Notes, slowly.')}
  <div class="grid g3">${j.map((a,i)=>`<article class="jcard" data-reveal data-reveal-d="${i+1}"><div class="jcard-vis" aria-hidden="true"></div><h3>${esc(a[0])}</h3><p class="muted">${esc(a[1])}</p></article>`).join('')}</div></div></section>`; }
function newsletter(x){ return `<section class="sec" id="letter"><div class="wrap narrow" style="text-align:center">
  <h2 class="clip-line" style="margin:0 auto 1rem;max-width:20ch">A letter, for those who pay attention.</h2>
  <form class="email-row" onsubmit="return false"><input type="email" placeholder="your email" aria-label="Email" required><button class="btn btn-primary" type="submit">Subscribe</button></form></div></section>`; }
function projectIndex(x){ const {ex,s}=x; const p=ex.projects||[]; const img=resolveAsset(s); return `<section class="sec" id="work"><div class="wrap">${sectionHead('Index','Selected works.')}
  <ul class="proj-list">${p.map((r,i)=>`<li class="proj-row" data-reveal data-reveal-d="${(i%4)+1}" data-img="${img}"><span class="proj-i">${String(i+1).padStart(2,'0')}</span><span class="proj-t">${esc(r[0])}</span><span class="proj-loc muted">${esc(r[1])}</span><span class="proj-y muted">${esc(r[2])}</span></li>`).join('')}</ul></div></section>`; }
function caseStudies(x){ const {s,c}=x; const img=resolveAsset(s); const items=c.svc; return `<section class="sec sec--flush" id="cases">${items.map((t,i)=>`<article class="case" data-reveal style="background-image:linear-gradient(180deg,transparent,var(--bg)),url('${img}')"><div class="wrap"><div class="eyebrow">Project ${String(i+1).padStart(2,'0')}</div><h2>${esc(t)}</h2><p class="lead">${esc(c.svcd[i]||c.sub)}</p></div></article>`).join('')}</section>`; }
function capabilitySlides(x){ const {ex}=x; const cap=ex.caps||[]; return `<section class="sec sec--flush" id="capabilities"><div class="wrap">${sectionHead('Capabilities','What I actually do.')}</div>
  <div class="hscroll"><div class="hscroll-track">${cap.map((m,i)=>`<article class="hpanel" data-reveal data-reveal-d="${(i%4)+1}"><div class="hpanel-n">${String(i+1).padStart(2,'0')}</div><h3>${esc(m[0])}</h3><p class="muted">${esc(m[1])}</p></article>`).join('')}</div></div></section>`; }
function aboutTwoPara(x){ const {c}=x; return `<section class="sec" id="about"><div class="wrap narrow">${sectionHead('Studio','Two paragraphs, no more.')}
  <p class="lead" data-reveal>${esc(c.sub)}</p>
  <p class="muted" data-reveal data-reveal-d="2" style="margin-top:1.2rem">${esc(c.svcd[0])} ${esc(c.svcd[1])}</p></div></section>`; }
function contactEmail(x){ const {c}=x; const slug=(c.brand||'studio').toLowerCase().replace(/[^a-z0-9]+/g,''); return `<footer class="foot foot--email"><div class="wrap" style="text-align:center">
  <div class="eyebrow">Contact</div>
  <a class="big-mail" href="mailto:studio@${slug}.com">studio@${slug}.com</a>
  <div class="muted foot-meta">${esc(c.brand)} — ${esc(c.kicker)}</div></div></footer>`; }
function contactBlack(x){ const {c}=x; return `<footer class="foot foot--black" id="contact"><div class="wrap narrow">
  <h2 class="clip-line">${esc(c.cta)}.</h2>
  <form class="email-row" onsubmit="return false"><input type="email" placeholder="you@studio.dev" aria-label="Email" required><button class="btn btn-primary" type="submit">Send</button></form>
  <div class="muted foot-meta">${esc(c.brand)} — ${esc(c.kicker)}</div></div></footer>`; }
function routesGrid(x){ const {c}=x; return `<section class="sec" id="services"><div class="wrap">${sectionHead('The service',`${c.svc[0]} · ${c.svc[1]} · ${c.svc[2]}`)}
  <div class="routes">${c.svc.map((s,i)=>`<div class="route" data-reveal data-reveal-d="${i+1}"><h3>${esc(s)}</h3><p class="muted">${esc(c.svcd[i])}</p></div>`).join('')}</div></div></section>`; }
function fleetStrip(x){ const {s}=x; return `<section class="sec--flush fleet" aria-hidden="true"><div class="fleet-img" style="background-image:url('${resolveAsset(s)}')"></div></section>`; }
function membership(x){ const {ex,c}=x; const t=ex.tiers||[]; return `<section class="sec" id="membership"><div class="wrap">${sectionHead('Membership','By standard, not by volume.')}
  <div class="grid g3">${t.map((p,i)=>`<article class="tier${i===1?' tier--hot':''}" data-reveal data-reveal-d="${i+1}"><div class="tier-name">${esc(p[0])}</div><div class="tier-tag muted">${esc(p[1])}</div><p class="muted">${esc(p[2])}</p></article>`).join('')}</div>
  <div style="text-align:center;margin-top:3rem">${A('#apply',c.cta+' &rarr;','btn btn-primary magnetic')}</div></div></section>`; }
function applyForm(x){ const {c}=x; return `<section class="sec" id="apply"><div class="wrap narrow" style="text-align:center">
  <h2 class="clip-line" style="margin:0 auto 2rem;max-width:16ch">Begin your application.</h2>
  <form class="apply" onsubmit="return false"><input placeholder="Full name" aria-label="Name" required><input type="email" placeholder="Email" aria-label="Email" required><button class="btn btn-primary" type="submit">${esc(c.cta)}</button></form></div></section>`; }
function ingredientMosaic(x){ const {ex}=x; const m=ex.mosaic||[]; return `<section class="sec" id="story"><div class="wrap">${sectionHead('What it is','Few things. The right things.')}
  <div class="mosaic">${m.map((it,i)=>`<figure class="mtile m${i+1}" data-reveal data-reveal-d="${(i%4)+1}"><div class="mtile-vis" aria-hidden="true"></div><figcaption><strong>${esc(it[0])}</strong><span class="muted">${esc(it[1])}</span></figcaption></figure>`).join('')}</div></div></section>`; }
function ritualSteps(x){ const {ex}=x; const r=ex.ritual||[]; return `<section class="sec" id="ritual"><div class="wrap">${sectionHead('The ritual','How it is served.')}
  <ol class="ritual">${r.map((s,i)=>`<li data-reveal data-reveal-d="${(i%4)+1}"><span class="ritual-n">${String(i+1).padStart(2,'0')}</span><div><h3>${esc(s[0])}</h3><p class="muted">${esc(s[1])}</p></div></li>`).join('')}</ol></div></section>`; }
function testimonialMarquee(x){ const {c}=x; const w=[c.svcd[0],c.svcd[1],c.svcd[2]]; const row=w.concat(w).map(t=>`<span>${esc(t)}</span><span class="dot">✦</span>`).join(''); return `<div class="tmq" aria-hidden="true"><div class="tmq-track">${row}</div></div>`; }
function productShelf(x){ const {ex,c}=x; const sh=ex.shelf||[[c.svc[0],'',''],[c.svc[1],'',''],[c.svc[2],'','']]; return `<section class="sec" id="shop"><div class="wrap">${sectionHead('The shelf','Hand-packed, shipped cold.')}
  <div class="grid g3">${sh.map((p,i)=>`<article class="shelf" data-reveal data-reveal-d="${i+1}"><div class="shelf-vis" aria-hidden="true"></div><h3>${esc(p[0])}</h3><div class="shelf-meta"><span class="muted">${esc(p[1])}</span><span class="shelf-price">${esc(p[2])}</span></div><a href="#" class="btn btn-ghost magnetic">Add to bag</a></article>`).join('')}</div></div></section>`; }
function circleVault(x){ const {ex}=x; const v=ex.vault||[]; return `<section class="sec" id="circle"><div class="wrap">${sectionHead('Within','Three rooms.')}
  <div class="grid g3">${v.map((it,i)=>`<article class="vault" data-reveal data-reveal-d="${i+1}"><h3 class="vault-t">${esc(it[0])}</h3><p class="muted">${esc(it[1])}</p></article>`).join('')}</div></div></section>`; }
function parentheticalFooter(x){ const {c}=x; return `<footer class="foot foot--paren"><div class="wrap" style="text-align:center">
  <div class="brand-mark">${esc(c.brand)}</div>
  <div class="paren-links"><a href="#">(X)</a> <a href="#">(IG)</a> <a href="#">(OS)</a></div>
  <div class="muted foot-meta">${esc(c.kicker)}</div></div></footer>`; }
function footerCols(x){ const {c}=x; return `<footer class="foot"><div class="wrap row">
  <div><div class="brand-mark">${esc(c.brand)}</div><p class="muted foot-meta">${esc(c.kicker)}</p></div>
  <div class="foot-nav">${c.svc.map(s=>A('#',esc(s))).join('')}</div></div></footer>`; }
function footerBare(x){ const {c}=x; const slug=(c.brand||'studio').toLowerCase().replace(/[^a-z0-9]+/g,''); return `<footer class="foot foot--bare"><div class="wrap" style="text-align:center">
  <div class="brand-mark">${esc(c.brand)}</div>
  <a class="big-mail" href="mailto:hello@${slug}.com">hello@${slug}.com</a>
  <div class="paren-links"><a href="#">Instagram</a></div></div></footer>`; }

const SECTIONS = { heroProduct,heroVideo,heroType,heroCanvas,heroRipple,heroSoft,heroSplit,heroPhoto,heroSaas,
  storyQuote,productGrid,materialScroll,statsBand,glassServices,processSteps,quoteCards,ctaBig,ctaGradient,
  manifesto,rawProof,numberedGet,emailInvert,featureRows,logoMarquee,pricing,faq,personaCols,stackCards,
  editorialStatement,asymGrid,philosophy,journalCards,newsletter,projectIndex,caseStudies,capabilitySlides,
  aboutTwoPara,contactEmail,contactBlack,routesGrid,fleetStrip,membership,applyForm,ingredientMosaic,
  ritualSteps,testimonialMarquee,productShelf,circleVault,parentheticalFooter,footerCols,footerBare,
  waveBand:(x)=>`<section class="sec wave-sec" aria-hidden="true"><div class="wrap"><div class="wave"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div></div></section>`,
  releaseGrid:(x)=>{ const {ex}=x; const r=ex.releases||[]; return `<section class="sec" id="listen"><div class="wrap">${sectionHead('Releases','Wave after wave.')}<div class="grid g2">${r.map((a,i)=>`<article class="rel" data-reveal data-reveal-d="${(i%4)+1}"><div class="rel-vis" aria-hidden="true"></div><div><h3>${esc(a[0])}</h3><p class="muted">${esc(a[1])}</p></div></article>`).join('')}</div></div></section>`; },
  howGlass:(x)=>{ const {c}=x; return `<section class="sec" id="how"><div class="wrap">${sectionHead('How it works','Three steps to live.')}<div class="grid g3">${c.svc.map((s,i)=>`<article class="glass" data-reveal data-reveal-d="${i+1}"><div class="eyebrow">Step ${i+1}</div><h3>${esc(s)}</h3><p class="muted">${esc(c.svcd[i])}</p></article>`).join('')}</div></div></section>`; },
};

/* ---------- page assembly ---------- */
function navBar(c){
  return `<nav class="nav"><div class="brand">${esc(c.brand)}</div>
  <div class="links"><a href="#work">Work</a><a href="#about">About</a><a href="#contact">Contact</a></div>
  ${A('#contact',esc(c.cta),'btn btn-ghost magnetic nav-cta')}</nav>`;
}
function switcher(prev,next,back,pos,total){
  return `<nav class="sitenav" aria-label="Library switcher">
  <a${prev?` href="${prev}"`:' class="disabled"'} aria-label="Previous">&larr;</a>
  <a href="${back}">Index</a><span class="pos">${pos} / ${total}</span>
  <a${next?` href="${next}"`:' class="disabled"'} aria-label="Next">&rarr;</a></nav>`;
}
function page(o){
  const { title, desc, s, c, prevHref, nextHref, backHref, pos, total } = o;
  const cssVars = Object.entries(s.vars).map(([k,v])=>`${k}:${v}`).join(';');
  const fonts = fontHref([s.disp, s.body]);
  const threeD = !!s.threeD;
  const cdn = `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>${threeD?`
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>`:''}`;
  const x = { c, s, ex:s.extra||{}, accent:s.vars['--accent'], light:!!s.light };
  const bodyCls=[ s.brutal&&'brutal', s.light&&'light', s.minimal&&'minimal' ].filter(Boolean).join(' ');
  const heroKey = s.layout[0];
  const heroHTML = SECTIONS[heroKey](x);
  const restHTML = s.layout.slice(1).map(k=>SECTIONS[k]?SECTIONS[k](x):'').join('\n');
  const hasFooter = /footer|contactEmail|contactBlack|parentheticalFooter/i.test(s.layout[s.layout.length-1]);
  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fonts}">
<link rel="stylesheet" href="../shared/lib.css">
<style>:root{${cssVars};--font-display:'${s.disp}';--font-body:'${s.body}'}</style>
${cdn}
</head>
<body${bodyCls?` class="${bodyCls}"`:''}${s.vanta?` data-vanta="${s.vanta}"`:''}>
<div id="loader"><div class="lLogo">${esc(c.brand)}</div><div class="lTrack"><div class="lBar"></div></div></div>
<div id="cur" aria-hidden="true"></div><div id="cur2" aria-hidden="true"></div>
<img id="preview-img" alt="" aria-hidden="true">
${switcher(prevHref,nextHref,backHref,pos,total)}
${navBar(c)}
${heroHTML}
<main>
${restHTML}
</main>
${hasFooter?'':footerBare(x)}
<script src="../shared/lib.js"></script>
</body></html>`;
}

/* ---------- emit ---------- */
let manifest = { styles:[], reels:[] };
const styleObj = id => STYLES.find(s=>s.id===id);
fs.mkdirSync(path.join(ROOT,'reels'),{recursive:true});
fs.mkdirSync(path.join(ROOT,'reels-realestate'),{recursive:true});
fs.mkdirSync(path.join(ROOT,'assets'),{recursive:true});
STYLES.forEach(s=>{
  const svg = path.join(ROOT,'assets',`${s.id}.svg`);
  if(!fs.existsSync(path.join(ROOT,'assets',`${s.id}-hero.jpg`)))
    fs.writeFileSync(svg, artSVG(s.id,{ bg:s.vars['--bg'], surface:s.vars['--surface'],
      accent:s.vars['--accent'], fg:s.vars['--fg'] }));
});
const jobs = [];

STYLES.forEach(s=>{
  jobs.push({ rel:`styles/${s.id}.html`, s, c:s.g,
    title:`${s.g.brand} — ${s.g.kicker}`, desc:`${s.g.kicker}. ${s.g.sub}`, back:'../index.html' });
  jobs.push({ rel:`styles-realestate/${s.id}.html`, s, c:s.re,
    title:`${s.re.brand} — ${s.re.kicker}`, desc:`${s.re.kicker}. ${s.re.sub}`, back:'../index.html' });
  manifest.styles.push({ id:s.id, name:s.name, refs:s.refs,
    accent:s.vars['--accent'], g:s.g.brand, re:s.re.brand });
});
REELS.forEach(r=>{
  const s = styleObj(r.style);
  const slug = String(r.n).padStart(2,'0')+'-'+r.site.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  const gc = { ...s.g, brand:r.brand, kicker:r.kicker };
  const rc = { ...s.re };
  jobs.push({ rel:`reels/${slug}.html`, s, c:gc,
    title:`${r.brand} — ${r.kicker}`, desc:`${r.kicker}. ${gc.sub}`, back:'../index.html' });
  jobs.push({ rel:`reels-realestate/${slug}.html`, s, c:rc,
    title:`${rc.brand} — ${rc.kicker}`, desc:`${rc.kicker}. ${rc.sub}`, back:'../index.html' });
  manifest.reels.push({ n:r.n, site:r.site, slug, style:s.id, styleName:s.name, accent:s.vars['--accent'] });
});

const total = jobs.length;
jobs.forEach((job,i)=>{
  const prev = jobs[i-1], next = jobs[i+1];
  fs.writeFileSync(path.join(ROOT, job.rel), page({
    title:job.title, desc:job.desc, s:job.s, c:job.c,
    prevHref: prev?('../'+prev.rel):'', nextHref: next?('../'+next.rel):'',
    backHref:job.back, pos:i+1, total }));
});
fs.writeFileSync(path.join(ROOT,'manifest.json'), JSON.stringify(manifest,null,2));
console.log('Generated', total, 'pages — bespoke per-archetype layouts, no demo chrome. manifest.json written.');
