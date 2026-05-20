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
  'Fraunces':'Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,400;1,9..144,500;1,9..144,600;1,9..144,700',
  'JetBrains Mono':'JetBrains+Mono:wght@300;400',
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
    layout:['heroProduct','storyQuote','scrollDepth','galleryHorizontalScroll','productGrid','carouselClassic','scrollReel','materialScroll','footerBare'],
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
    layout:['heroVideoGSAP','statsBand','scrollDepth','glassServices','processSteps','quoteCards','ctaBig','footerCols'],
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
    layout:['heroType','manifesto','relatsKinetic','galleryHorizontalScroll','rawProof','scrollDepth','numberedGet','emailInvert','footerBare'],
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
    layout:['r3fScene','howGlass','theatreScene','scrollDepth','featureRows','logoMarquee','pricing','faq','ctaGradient','footerCols'],
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
    layout:['heroVanta','waveBand','releaseGrid','quoteCards','emailInvert','footerBare'],
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
    layout:['heroSoft','editorialStatement','galleryHorizontalScroll','asymGrid','carouselClassic','philosophy','scrollDepth','scrollReel','journalCards','newsletter','footerBare'],
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
    layout:['heroSaas','stackCards','babylonHero','r3fScene','personaCols','logoMarquee','pricing','faq','ctaGradient','footerCols'],
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
    layout:['heroBuildSequence','projectIndex','galleryHorizontalScroll','scrollReel','caseStudies','scrollDepth','aboutTwoPara','contactEmail'],
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
    layout:['heroSplit','routesGrid','scrollReel','fleetStrip','membership','applyForm','footerBare'],
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
    layout:['heroProduct','ingredientMosaic','scrollDepth','ritualSteps','testimonialMarquee','productShelf','carouselClassic','emailInvert','footerBare'],
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
    layout:['heroProduct','kanjiMarquee','circleVault','scrollDepth','membership','quoteCards','parentheticalFooter'],
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
    layout:['heroCanvas','relatsKinetic','caseStudies','rapierPhysicsHero','galleryHorizontalScroll','capabilitySlides','scrollDepth','aboutTwoPara','contactBlack'],
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
    vars:{'--bg':'#050302','--surface':'#0E0805','--fg':'#f4e6cf','--accent':'#e9b26b','--amber':'#de7c0d','--cream':'#f4e6cf','--gold':'#e9b26b','--card':'rgba(244,230,207,.05)','--card-bd':'rgba(244,230,207,.14)'},
    disp:'Fraunces', body:'Inter', threeD:false, light:false,
    layout:['heroCinematicFilm','editorialStatement','statsBand','asymGrid','scrollDepth','productShelf','ritualSteps','ingredientMosaic','carouselClassic','journalCards','newsletter','footerBare'],
    extra:{ quote:'Picked at the perfect moment. Pressed cold. Bottled whole.',
      chapters:[
        {num:'',  label:'I — A FILM IN SIX CHAPTERS',     h1a:'A film about',           h1b:'oil.',                  italic:'b', side:'right',  marquee:true,  meta:'Six frames. One coconut. Cold-pressed at first light.'},
        {num:'01',label:'II — THE GROVE',                 h1a:'Picked at the',          h1b:'perfect moment.',       italic:'b', side:'left',   marquee:false, meta:'10°31′N · 76°10′E · HARVEST 04:30'},
        {num:'02',label:'III — THE REVEAL',               h1a:'Split open.',            h1b:'Nothing added.',        italic:'b', side:'right',  marquee:false, meta:'Halved by hand. White, clean, full of milk.'},
        {num:'03',label:'IV — THE PRESS',                 h1a:'One press.',             h1b:'No heat. No haste.',    italic:'',  side:'left',   marquee:true,  meta:'Stone wheel · cold method · small batch'},
        {num:'04',label:'V — THE BOTTLE',                 h1a:'Liquid gold,',           h1b:'sealed in glass.',      italic:'a', side:'right',  marquee:false, meta:'Amber glass · hand-labeled · grove-traceable'},
        {num:'',  label:'VI — AVAILABLE NOW',             h1a:'Pure.',                  h1b:'Pressed once. Yours.',  italic:'b', side:'center', marquee:true,  meta:'₹ 1,490 · FREE SHIPPING ABOVE ₹ 2,000'}
      ],
      shelf:[['Virgin Coconut Oil','Cold-pressed · multi-use · 250ml','₹1,490'],
        ['Ayurvedic Hair Oil','Strength & shine · botanical infusion','₹990'],
        ['Coconut Body Balm','Daily nourishment · 150g','₹790']],
      journal:[['I. The Grove','Where the coconuts grow — slow, sun-fed, unhurried.'],
        ['II. The Reveal','Halved by hand. White, clean, full of milk.'],
        ['III. The Press','Stone wheel, no heat. The oil comes on its own.']],
      mosaic:[['I. The Grove','Smallholder groves along the Philippine coast.'],
        ['II. The Reveal','Each coconut split fresh on the day of pressing.'],
        ['III. The Press','Cold-pressed in small batches, never refined.'],
        ['IV. The Bottle','Amber glass, hand-labeled, traceable to the grove.']],
      ritual:[['I. Warm','Soften a little oil between the palms.'],
        ['II. Anoint','Work through hair and skin, with intention.'],
        ['III. Breathe','Two slow minutes. Let it absorb.'],
        ['IV. Keep','The same small care, repeated daily.']] },
    g:{ brand:'COCO VEDA', kicker:'A FILM BY COCO VEDA · MMXXVI',
        h1:'Picked at the perfect moment.',
        h1Html:'Picked at the <em style="font-style:italic;color:var(--accent)">perfect</em> moment.',
        sub:'A single coconut, halved by hand, cold-pressed the same morning. One bottle. One grove. The whole story.',
        cta:'BUY · ₹1,490', svc:['Coconut Oil & Wellness','Hair, Skin & Body','Sustainable Sourcing'],
        svcd:['Signature cold-processed virgin coconut oil at the heart of every blend.','Massage, hair, facial, body, lip, baby and pet care — over a hundred products.','Direct farmer cooperatives, fair value, a lighter footprint.'],
        stats:[['VI','Chapters'],['I','Single origin'],['100','% cold-pressed']] },
    re:{ brand:'COCO VEDA RETREATS', kicker:'Live Well · By the Coconut Grove',
        h1:'A home, in balance with nature.',
        sub:'A small collection of wellness residences set within working coconut groves — designed around Ayurvedic calm and slow, natural living.',
        cta:'Request the portfolio', svc:['Grove Residences','Retreat Estates','Wellness Tenancy'],
        svcd:['Homes sited within working coconut groves.','Turnkey retreat properties with land and provenance.','Long-stay wellness leases, fully serviced.'],
        stats:[['12','Residences'],['2015','Established'],['100','% natural setting']] } },

  { id:'14-cosmic-platform', name:'Cosmic Engine', refs:'Starry Labs',
    vars:{'--bg':'#070611','--surface':'#11102A','--fg':'#EDEBFA','--accent':'#9E8CFF','--card':'rgba(255,255,255,.045)','--card-bd':'rgba(158,140,255,.20)'},
    disp:'Cormorant Garamond', body:'Inter', threeD:false,
    layout:['heroThreeGlobe','manifesto','p5Sketch','featureRows','processSteps','pricing','faq','contactBlack'],
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
    layout:['heroBuildSequence','editorialStatement','galleryHorizontalScroll','asymGrid','scrollDepth','scrollReel','ritualSteps','carouselClassic','ingredientMosaic','journalCards','newsletter','footerBare'],
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

  { id:'16-terminal-industrial', name:'Terminal Industrial', refs:'terminal-industries.com · Stripe · Linear',
    vars:{'--bg':'#050505','--surface':'#0B0B0D','--fg':'#EDEDED','--accent':'#FF5C00','--accent-2':'#1AFF8C','--card':'rgba(255,255,255,.025)','--card-bd':'rgba(255,255,255,.10)','--btn-radius':'2px','--card-radius':'2px'},
    disp:'Space Grotesk', body:'IBM Plex Mono', threeD:false, industrial:true,
    layout:['heroVideoGSAP','statsBand','routesGrid','scrollDepth','featureRows','carouselClassic','galleryHorizontalScroll','processSteps','logoMarquee','contactBlack'],
    extra:{ steps:[
        ['Scan','Real-time computer vision identifies every truck, trailer and yard asset.'],
        ['Route','AI dispatch assigns the shortest, safest, most fuel-efficient path.'],
        ['Move','Autonomous yard tractors execute moves continuously, 24/7.'],
        ['Audit','Every motion logged, every minute saved, every dollar measured.']],
      carousel:[
        ['01 / Terminal OS','Operating system for the modern logistics yard. One pane of glass.','Live deployment'],
        ['02 / Autonomous Yard','Driverless yard tractors that move trailers between docks and slots.','SAE Level 4'],
        ['03 / Computer Vision','Edge-deployed cameras tracking every asset, person and motion.','99.7% accuracy'],
        ['04 / API Layer','Plug into your TMS, WMS, ERP. REST + webhooks, opinionated defaults.','OpenAPI 3.1']],
      carouselTitle:'The yard, rebuilt.',
      routes:[
        ['LAX → ORD','Los Angeles · Chicago','27h · automated'],
        ['ATL → DFW','Atlanta · Dallas','13h · automated'],
        ['SEA → DEN','Seattle · Denver','22h · automated'],
        ['MIA → JFK','Miami · New York','21h · automated'],
        ['HOU → PHX','Houston · Phoenix','17h · automated'],
        ['MSP → IND','Minneapolis · Indianapolis','11h · automated']] },
    g:{ brand:'TERMINAL', kicker:'Industrial AI · NOC-25.04', h1:'The logistics yard, autonomous.',
        sub:'We build the operating system, the autonomous trucks and the computer vision that runs the modern freight terminal — end to end, 24/7, measured to the minute.',
        cta:'Request a deployment', svc:['Yard OS','Autonomous Fleet','Vision Platform'],
        svcd:['One operating system for every motion in the terminal.','Driverless tractors that never stop, never tire, never miss a slot.','Edge vision tracking every asset, person and second.'],
        stats:[['24/7','Yard uptime'],['SAE 4','Autonomy'],['12','Terminals live']] },
    re:{ brand:'TERMINAL ASSETS', kicker:'Industrial Real Estate · NOC-25.04', h1:'The industrial yard, owned right.',
        sub:'We acquire, retrofit and operate Class A industrial yards across North America — built around autonomy, computer vision and a single operating layer.',
        cta:'Request the deck', svc:['Acquisitions','Retrofits','Operations'],
        svcd:['Off-market industrial yards with rail or port access.','Sensor + autonomy retrofit in 90 days.','Operated end-to-end on Terminal OS.'],
        stats:[['$420M','AUM'],['18','Yards held'],['90','Days to retrofit']] } },
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
  const h1 = c.h1Html || esc(c.h1);
  return `<header class="hero hero--soft">
  <div class="soft-glow" aria-hidden="true"></div>
  ${wrapOpen}
    <div class="eyebrow" data-reveal>${esc(c.kicker)}</div>
    <h1>${h1}</h1>
    <p class="lead" data-reveal data-reveal-d="2">${esc(c.sub)}</p>
    <div class="hero-cta" data-reveal data-reveal-d="3">${A('#collection',c.cta+' &rarr;','link-cta')}</div>
  </div>
</header>`;
}
function heroCinematicFilm(x){ // coco-veda 6-chapter scroll film
  const {c,s,ex} = x;
  const chapters = (ex && ex.chapters) || [];
  const splitH1 = (a,b,italic) => {
    const ai = italic==='a';
    const bi = italic==='b';
    const aHtml = ai ? `<em class="cv-it">${esc(a)}</em>` : esc(a);
    const bHtml = bi ? `<em class="cv-it">${esc(b)}</em>` : esc(b);
    return `${aHtml} <br>${bHtml}`;
  };
  const marqueeStrip = `<div class="cv-marquee" aria-hidden="true"><div class="cv-marquee-track">`+
    Array(4).fill(0).map(()=>`<span>COCO Vēda</span><span>·</span><span>A Film in Six Chapters</span><span>·</span><span>Cold-Pressed Once</span><span>·</span><span>Bottled Whole</span><span>·</span>`).join('')+
    `</div></div>`;
  const overlays = chapters.map((ch,i)=>{
    const pos = ch.side==='left' ? 'cv-pos-left' : ch.side==='right' ? 'cv-pos-right' : 'cv-pos-center';
    const num = ch.num ? `<div class="cv-num ${i%2?'cv-num-l':'cv-num-r'}">${esc(ch.num)}</div>` : '';
    const mq  = ch.marquee ? marqueeStrip : '';
    return `<section class="cv-chapter" data-cv-idx="${i}" aria-label="${esc(ch.label)}">
  ${mq}
  ${num}
  <div class="cv-frame ${pos}">
    <div class="cv-label">${esc(ch.label)}</div>
    <h1 class="cv-h1">${splitH1(ch.h1a, ch.h1b, ch.italic)}</h1>
    <div class="cv-meta">${esc(ch.meta||'')}</div>
  </div>
</section>`;
  }).join('\n');
  const rail = `<aside class="cv-rail" aria-hidden="true">`+
    ['I','II','III','IV','V','VI'].map((r,i)=>`<span class="cv-rn" data-cv-rn="${i}">${r}</span>`).join('<i class="cv-hair"></i>')+
    `</aside>`;
  const credit = `<aside class="cv-credit" aria-hidden="true">A Film By Coco Vēda · MMXXVI</aside>`;
  const progress = `<div class="cv-progress" aria-hidden="true">
    <span class="cv-pn">01 / 06</span>
    <i class="cv-bar"><i class="cv-fill"></i></i>
    <span class="cv-pp">00%</span>
  </div>`;
  const hint = `<div class="cv-hint" aria-hidden="true">Scroll to begin<i class="cv-hairv"></i></div>`;
  const canvas = `<canvas class="cv-stage" id="cvStage" aria-hidden="true"></canvas>`;
  const spacer = `<div class="cv-spacer" style="height:700vh" aria-hidden="true"></div>`;
  return `<div class="cv-film">
${canvas}
${overlays}
${rail}
${credit}
${progress}
${hint}
${spacer}
<style>
.cv-film{position:relative;background:var(--bg,#050302);color:var(--cream,#f4e6cf);min-height:100vh}
.cv-stage{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse at 50% 35%,rgba(233,178,107,.08),transparent 60%),#050302}
.cv-chapter{position:fixed;inset:0;z-index:20;opacity:0;pointer-events:none;will-change:opacity;display:flex;align-items:center;justify-content:center}
.cv-chapter[data-cv-idx="0"]{opacity:1}
.cv-frame{position:relative;padding:clamp(2rem,4vw,3.2rem);max-width:min(90vw,1100px)}
.cv-pos-left .cv-frame{margin-right:auto;margin-left:0;text-align:left}
.cv-pos-right .cv-frame{margin-left:auto;margin-right:0;text-align:right}
.cv-pos-center{justify-content:center}
.cv-pos-center .cv-frame{text-align:center}
.cv-pos-left{justify-content:flex-start}
.cv-pos-right{justify-content:flex-end}
.cv-label{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.68rem;letter-spacing:.32em;text-transform:uppercase;color:rgba(244,230,207,.55);margin-bottom:1.6rem}
.cv-h1{font-family:'Fraunces',serif;font-weight:300;font-size:clamp(2.4rem,7.6vw,8.4rem);line-height:.96;letter-spacing:-.02em;margin:0;color:#f4e6cf;font-variation-settings:"opsz" 144,"SOFT" 50,"WONK" 0}
.cv-h1 .cv-it{font-style:italic;color:#e9b26b;font-variation-settings:"opsz" 144,"SOFT" 100,"WONK" 1}
.cv-meta{margin-top:1.8rem;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(244,230,207,.55);background:rgba(5,3,2,.42);backdrop-filter:blur(14px) saturate(120%);border:1px solid hsla(37,63%,88%,.06);border-radius:2px;padding:.7rem 1rem;display:inline-block}
.cv-num{position:absolute;top:5%;font-family:'Fraunces',serif;font-weight:300;font-size:28vw;line-height:1;color:rgba(244,230,207,.06);pointer-events:none;z-index:1;font-feature-settings:"lnum","tnum";font-variation-settings:"opsz" 144,"SOFT" 0}
.cv-num-l{left:3%}
.cv-num-r{right:3%}
.cv-marquee{position:absolute;top:6rem;left:0;right:0;overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);z-index:2}
.cv-marquee-track{display:inline-flex;gap:1.2rem;align-items:center;white-space:nowrap;animation:cv-marquee 50s linear infinite;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.66rem;letter-spacing:.28em;text-transform:uppercase;color:rgba(244,230,207,.4)}
@keyframes cv-marquee{0%{transform:translate3d(0,0,0)}100%{transform:translate3d(-25%,0,0)}}
.cv-rail{position:fixed;left:1.4rem;top:50%;transform:translateY(-50%);z-index:30;display:none;flex-direction:column;align-items:center;gap:.6rem;font-family:'Fraunces',serif;font-size:.8rem;letter-spacing:.15em}
@media(min-width:900px){.cv-rail{display:flex}}
.cv-rn{color:rgba(244,230,207,.3);transition:color .35s ease}
.cv-rn.is-active{color:#e9b26b}
.cv-hair{display:block;width:1px;height:24px;background:rgba(244,230,207,.18)}
.cv-credit{position:fixed;right:1rem;top:50%;transform:translateY(-50%) rotate(180deg);writing-mode:vertical-rl;z-index:30;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.62rem;letter-spacing:.32em;text-transform:uppercase;color:rgba(244,230,207,.4);display:none}
@media(min-width:900px){.cv-credit{display:block}}
.cv-progress{position:fixed;bottom:1.4rem;left:50%;transform:translateX(-50%);z-index:30;display:flex;align-items:center;gap:1rem;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.66rem;letter-spacing:.22em;text-transform:uppercase;color:rgba(244,230,207,.55)}
.cv-bar{display:block;width:min(36vw,300px);height:1px;background:rgba(244,230,207,.15);position:relative}
.cv-fill{display:block;height:100%;width:0;background:#e9b26b;transition:width .12s linear}
.cv-hint{position:fixed;bottom:5rem;left:50%;transform:translateX(-50%);z-index:30;display:flex;flex-direction:column;align-items:center;gap:.6rem;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.62rem;letter-spacing:.28em;text-transform:uppercase;color:rgba(244,230,207,.5);opacity:.7;transition:opacity .4s ease}
.cv-hint.is-hide{opacity:0}
.cv-hairv{display:block;width:1px;height:40px;background:#e9b26b;transform-origin:center;animation:cv-shimmer 2.6s ease-in-out infinite}
@keyframes cv-shimmer{0%,100%{opacity:.4;transform:scaleY(.4)}50%{opacity:1;transform:scaleY(1)}}
</style>
<script>
(function(){
  var stage=document.getElementById('cvStage');
  if(stage){var ctx=stage.getContext('2d'),W=0,H=0,parts=[],T=0;
    function size(){W=stage.width=innerWidth;H=stage.height=innerHeight;parts=[];for(var i=0;i<48;i++)parts.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.4+.3,s:Math.random()*.25+.05});}
    function tick(){T++;ctx.clearRect(0,0,W,H);for(var i=0;i<parts.length;i++){var p=parts[i];p.y-=p.s;if(p.y<-4)p.y=H+4;ctx.fillStyle='rgba(233,178,107,'+(.18*Math.sin((T+i*40)*.01)+.22)+')';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();}requestAnimationFrame(tick);}
    size();tick();addEventListener('resize',size);}
  var chapters=document.querySelectorAll('.cv-chapter'),
      rails=document.querySelectorAll('[data-cv-rn]'),
      fill=document.querySelector('.cv-fill'),
      pn=document.querySelector('.cv-pn'),
      pp=document.querySelector('.cv-pp'),
      hint=document.querySelector('.cv-hint'),
      hero=document.querySelector('.cv-film');
  if(!chapters.length||!hero)return;
  function onScroll(){
    var rect=hero.getBoundingClientRect();
    var top=Math.max(0,-rect.top);
    var max=Math.max(1,hero.offsetHeight-innerHeight);
    var p=Math.min(1,top/max);
    var seg=1/chapters.length;
    var active=Math.min(chapters.length-1,Math.floor(p/seg));
    for(var i=0;i<chapters.length;i++){
      var local=(p-i*seg)/seg;
      var o=0;
      if(i===active){o=local<.15?local/.15:(local>.85?1-(local-.85)/.15:1);}
      else if(i===active-1&&local<0){o=0;}
      chapters[i].style.opacity=Math.max(0,Math.min(1,o));
    }
    for(var j=0;j<rails.length;j++)rails[j].classList.toggle('is-active',j===active);
    if(fill)fill.style.width=(p*100).toFixed(1)+'%';
    if(pn)pn.textContent=('0'+(active+1)).slice(-2)+' / 0'+chapters.length;
    if(pp)pp.textContent=Math.round(p*100)+'%';
    if(hint)hint.classList.toggle('is-hide',p>.02);
  }
  addEventListener('scroll',onScroll,{passive:true});onScroll();
})();
</script>
</div>`;
}
function heroSpline(x){ // 3D Spline scene hero
  const {c,s} = x;
  const scene = (s.extra && s.extra.spline) || 'https://prod.spline.design/6Wq1Q7xQQ8e6yYNm/scene.splinecode';
  return `<section class="sp-hero">
<script type="module" src="https://unpkg.com/@splinetool/viewer@1.0.0/build/spline-viewer.js"></script>
<spline-viewer class="sp-stage" url="${esc(scene)}" loading-anim></spline-viewer>
<div class="sp-vignette" aria-hidden="true"></div>
<div class="sp-frame">
  <div class="sp-kicker">${esc(c.kicker)}</div>
  <h1 class="sp-h1">${esc(c.h1)}</h1>
  <p class="sp-sub">${esc(c.sub)}</p>
  <a class="sp-cta" href="#shop">${esc(c.cta)} &rarr;</a>
</div>
<style>
.sp-hero{position:relative;height:100vh;min-height:640px;overflow:hidden;background:var(--bg,#0a0a0a);color:var(--fg,#f5f1e8)}
.sp-stage{position:absolute;inset:0;width:100%;height:100%;z-index:0}
.sp-vignette{position:absolute;inset:0;z-index:1;background:radial-gradient(ellipse at 50% 60%,transparent 30%,rgba(0,0,0,.45) 70%,#000 100%),linear-gradient(180deg,rgba(0,0,0,.55),transparent 30%,transparent 70%,rgba(0,0,0,.55));pointer-events:none}
.sp-frame{position:absolute;left:clamp(1.4rem,4vw,3rem);bottom:clamp(2rem,6vw,4rem);max-width:min(60vw,560px);z-index:2}
.sp-kicker{font-size:.72rem;letter-spacing:.32em;text-transform:uppercase;color:var(--accent,#c9a961);margin-bottom:1.4rem}
.sp-h1{font-family:var(--font-display),serif;font-weight:300;font-size:clamp(2.4rem,6vw,5.6rem);line-height:.98;margin:0 0 1.4rem;letter-spacing:-.02em}
.sp-sub{font-size:1rem;line-height:1.55;color:rgba(245,241,232,.7);margin:0 0 1.8rem;max-width:38ch}
.sp-cta{display:inline-block;padding:.85rem 1.6rem;border:1px solid var(--accent,#c9a961);color:var(--accent,#c9a961);border-radius:999px;font-size:.78rem;letter-spacing:.18em;text-transform:uppercase;text-decoration:none;transition:all .25s ease}
.sp-cta:hover{background:var(--accent,#c9a961);color:#000}
</style>
</section>`;
}
function heroThreeGlobe(x){ // Three.js cosmic globe hero
  const {c} = x;
  return `<section class="tg-hero">
<canvas class="tg-stage" id="tgStage" aria-hidden="true"></canvas>
<div class="tg-frame">
  <div class="tg-kicker">${esc(c.kicker)}</div>
  <h1 class="tg-h1">${esc(c.h1)}</h1>
  <p class="tg-sub">${esc(c.sub)}</p>
  <div class="tg-cta-row"><a class="tg-cta" href="#pricing">${esc(c.cta)}</a><a class="tg-link" href="#how">See how &rarr;</a></div>
</div>
<style>
.tg-hero{position:relative;height:100vh;min-height:640px;overflow:hidden;background:radial-gradient(ellipse at 50% 50%,#171535 0%,#070611 70%);color:var(--fg,#edebfa)}
.tg-stage{position:absolute;inset:0;z-index:0;width:100%;height:100%}
.tg-frame{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;height:100%;padding:0 1.4rem}
.tg-kicker{font-size:.72rem;letter-spacing:.32em;text-transform:uppercase;color:var(--accent,#9e8cff);margin-bottom:1.4rem}
.tg-h1{font-family:var(--font-display),serif;font-weight:300;font-size:clamp(2.8rem,7vw,6.4rem);line-height:1;margin:0 0 1.4rem;letter-spacing:-.02em;max-width:18ch}
.tg-sub{font-size:1.05rem;line-height:1.55;color:rgba(237,235,250,.65);margin:0 0 2.2rem;max-width:50ch}
.tg-cta-row{display:inline-flex;gap:1rem;align-items:center}
.tg-cta{padding:.95rem 1.8rem;background:var(--accent,#9e8cff);color:#0a0a0a;border-radius:999px;font-size:.78rem;letter-spacing:.18em;text-transform:uppercase;text-decoration:none;font-weight:600}
.tg-cta:hover{filter:brightness(1.1)}
.tg-link{color:rgba(237,235,250,.7);font-size:.78rem;letter-spacing:.18em;text-transform:uppercase;text-decoration:none}
.tg-link:hover{color:var(--accent,#9e8cff)}
</style>
<script>
(function(){
  if(typeof THREE==='undefined')return;
  var c=document.getElementById('tgStage');if(!c)return;
  var r=new THREE.WebGLRenderer({canvas:c,alpha:true,antialias:true});
  var s=new THREE.Scene(),cam=new THREE.PerspectiveCamera(50,1,.1,100);
  function size(){var w=innerWidth,h=innerHeight;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();}
  size();addEventListener('resize',size);
  cam.position.z=3.4;
  var geom=new THREE.IcosahedronGeometry(1.2,3),mat=new THREE.MeshBasicMaterial({color:0x9e8cff,wireframe:true,transparent:true,opacity:.42});
  var globe=new THREE.Mesh(geom,mat);s.add(globe);
  var pgeo=new THREE.BufferGeometry(),pts=[],COUNT=380;
  for(var i=0;i<COUNT;i++){var th=Math.random()*Math.PI*2,ph=Math.acos(2*Math.random()-1),rr=1.6+Math.random()*.6;pts.push(rr*Math.sin(ph)*Math.cos(th),rr*Math.sin(ph)*Math.sin(th),rr*Math.cos(ph));}
  pgeo.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));
  var pmat=new THREE.PointsMaterial({color:0xedebfa,size:.015,transparent:true,opacity:.7});
  var ring=new THREE.Points(pgeo,pmat);s.add(ring);
  function tick(){globe.rotation.y+=.0018;globe.rotation.x+=.0008;ring.rotation.y-=.0012;ring.rotation.x+=.0004;r.render(s,cam);requestAnimationFrame(tick);}
  tick();
})();
</script>
</section>`;
}
function heroVanta(x){ // Vanta WAVES vaporwave hero
  const {c} = x;
  return `<section class="vt-hero" id="vt-bg">
<div class="vt-grid" aria-hidden="true"></div>
<div class="vt-frame">
  <div class="vt-kicker">${esc(c.kicker)}</div>
  <h1 class="vt-h1">${esc(c.h1)}</h1>
  <p class="vt-sub">${esc(c.sub)}</p>
  <a class="vt-cta" href="#shop">${esc(c.cta)}</a>
</div>
<style>
.vt-hero{position:relative;height:100vh;min-height:640px;overflow:hidden;background:linear-gradient(180deg,#1a0a2e 0%,#2e1a4e 50%,#0a0a1a 100%);color:#f0e6ff}
.vt-grid{position:absolute;inset:0;z-index:1;background-image:linear-gradient(180deg,transparent 80%,rgba(255,82,213,.4)),repeating-linear-gradient(0deg,transparent 0,transparent 39px,rgba(158,140,255,.18) 40px),repeating-linear-gradient(90deg,transparent 0,transparent 39px,rgba(158,140,255,.18) 40px);transform:perspective(600px) rotateX(60deg) translateY(45%);transform-origin:bottom;opacity:.65;pointer-events:none}
.vt-frame{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;height:100%;padding:0 1.4rem}
.vt-kicker{font-size:.72rem;letter-spacing:.4em;text-transform:uppercase;color:#ff52d5;margin-bottom:1.6rem;text-shadow:0 0 8px rgba(255,82,213,.6)}
.vt-h1{font-family:var(--font-display),serif;font-weight:400;font-size:clamp(2.8rem,8vw,7rem);line-height:1;margin:0 0 1.4rem;color:#f0e6ff;text-shadow:0 0 20px rgba(158,140,255,.5),0 0 40px rgba(255,82,213,.3)}
.vt-sub{font-size:1.05rem;line-height:1.55;color:rgba(240,230,255,.75);margin:0 0 2.2rem;max-width:50ch}
.vt-cta{padding:.95rem 1.8rem;background:linear-gradient(90deg,#ff52d5,#9e8cff);color:#0a0a1a;border-radius:999px;font-size:.78rem;letter-spacing:.22em;text-transform:uppercase;text-decoration:none;font-weight:700;box-shadow:0 0 30px rgba(255,82,213,.4)}
.vt-cta:hover{filter:brightness(1.15)}
</style>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.waves.min.js"></script>
<script>
(function(){if(typeof VANTA==='undefined'||typeof THREE==='undefined')return;VANTA.WAVES({el:'#vt-bg',color:0x9e8cff,shininess:50,waveHeight:18,waveSpeed:.6,zoom:.75,backgroundColor:0x1a0a2e});})();
</script>
</section>`;
}
function heroVideoGSAP(x){ // cinematic video hero + GSAP fade
  const {c,s} = x;
  return `<section class="vg-hero">
<video class="vg-video" autoplay muted loop playsinline poster="${resolveAsset(s)}"></video>
<div class="vg-scrim" aria-hidden="true"></div>
<div class="vg-frame">
  <div class="vg-kicker">${esc(c.kicker)}</div>
  <h1 class="vg-h1">${esc(c.h1)}</h1>
  <p class="vg-sub">${esc(c.sub)}</p>
  <a class="vg-cta" href="#shop">${esc(c.cta)} &rarr;</a>
</div>
<div class="vg-stats">
  ${(c.stats||[['','']]).slice(0,3).map(([n,l])=>`<div class="vg-stat"><div class="vg-n">${esc(n)}</div><div class="vg-l">${esc(l)}</div></div>`).join('')}
</div>
<style>
.vg-hero{position:relative;height:100vh;min-height:640px;overflow:hidden;background:#0d0f12;color:#f2f2f2}
.vg-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;background:linear-gradient(135deg,#1a1f28 0%,#0d0f12 50%,#2a1a0e 100%)}
.vg-scrim{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(13,15,18,.65) 0%,rgba(13,15,18,.35) 40%,rgba(13,15,18,.85) 100%)}
.vg-frame{position:relative;z-index:2;display:flex;flex-direction:column;justify-content:center;height:100%;padding:0 clamp(1.4rem,5vw,4rem);max-width:min(70vw,820px)}
.vg-kicker{font-size:.72rem;letter-spacing:.32em;text-transform:uppercase;color:var(--accent,#e8a948);margin-bottom:1.4rem}
.vg-h1{font-family:var(--font-display),serif;font-weight:400;font-size:clamp(2.6rem,7vw,6.4rem);line-height:1;margin:0 0 1.4rem;letter-spacing:-.02em}
.vg-sub{font-size:1.05rem;line-height:1.55;color:rgba(242,242,242,.72);margin:0 0 2rem;max-width:54ch}
.vg-cta{display:inline-block;padding:.95rem 1.8rem;background:var(--accent,#e8a948);color:#0d0f12;border-radius:4px;font-size:.78rem;letter-spacing:.2em;text-transform:uppercase;text-decoration:none;font-weight:600;width:fit-content}
.vg-cta:hover{filter:brightness(1.08)}
.vg-stats{position:absolute;bottom:clamp(1.4rem,3vw,2.4rem);left:clamp(1.4rem,5vw,4rem);right:clamp(1.4rem,5vw,4rem);z-index:2;display:flex;gap:clamp(2rem,5vw,4rem);border-top:1px solid rgba(242,242,242,.18);padding-top:1.4rem}
.vg-stat{display:flex;flex-direction:column;gap:.3rem}
.vg-n{font-family:var(--font-display),serif;font-size:clamp(1.6rem,3vw,2.4rem);font-weight:300;color:var(--accent,#e8a948)}
.vg-l{font-size:.66rem;letter-spacing:.22em;text-transform:uppercase;color:rgba(242,242,242,.55)}
</style>
</section>`;
}
function heroBuildSequence(x){ // scroll-driven 3D build + animated brand monogram
  const {c,s} = x;
  // monogram = first letter of each brand word, max 2 — embedded as SVG line-draw plate, then re-anchored as a glass plaque inside the 3D scene
  const brand = (c.brand||'STUDIO').replace(/[^A-Za-z ]/g,'').trim();
  const initials = (brand.split(/\s+/).map(w=>w[0]).join('').slice(0,2) || brand.slice(0,2)).toUpperCase();
  const accent = s.vars['--accent'] || '#c9a961';
  return `<section class="bs-hero">
<canvas class="bs-bg" id="bsBg" aria-hidden="true"></canvas>
<canvas class="bs-3d" id="bs3d" aria-hidden="true"></canvas>
<div class="bs-vignette" aria-hidden="true"></div>
<div class="bs-monogram" aria-hidden="true">
  <svg viewBox="0 0 240 240" width="120" height="120">
    <defs><linearGradient id="bsG" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${accent}" stop-opacity=".95"/>
      <stop offset="1" stop-color="${accent}" stop-opacity=".55"/></linearGradient></defs>
    <circle class="bs-p bs-p1" cx="120" cy="120" r="104" fill="none" stroke="url(#bsG)" stroke-width="1.2"/>
    <circle class="bs-p bs-p2" cx="120" cy="120" r="78"  fill="none" stroke="${accent}" stroke-width=".8" stroke-opacity=".55"/>
    <text class="bs-p bs-mn" x="120" y="142" text-anchor="middle" font-family="${s.disp||'serif'}" font-size="92" font-weight="300" fill="${accent}" letter-spacing="-2">${esc(initials)}</text>
    <line class="bs-p bs-l1" x1="38"  y1="208" x2="202" y2="208" stroke="${accent}" stroke-opacity=".4" stroke-width=".8"/>
  </svg>
  <div class="bs-wordmark">${esc(brand)}</div>
</div>
<div class="bs-frame">
  <div class="bs-eyebrow">${esc(c.kicker)}</div>
  <h1 class="bs-h1">${esc(c.h1)}</h1>
  <p class="bs-sub">${esc(c.sub)}</p>
  <div class="bs-cta-row"><a class="bs-cta" href="#story">${esc(c.cta)} &rarr;</a><span class="bs-chap" id="bsChap">I &middot; Site</span></div>
</div>
<div class="bs-rail" aria-hidden="true">
  <i class="bs-r bs-r1 is-on"></i><span>I</span>
  <i class="bs-r bs-r2"></i><span>II</span>
  <i class="bs-r bs-r3"></i><span>III</span>
  <i class="bs-r bs-r4"></i><span>IV</span>
</div>
<div class="bs-spacer" aria-hidden="true"></div>
<style>
.bs-hero{position:relative;height:420vh;background:var(--bg,#0a0a0a);color:var(--fg,#f5f1e8);overflow:visible}
.bs-bg,.bs-3d{position:sticky;top:0;left:0;width:100vw;height:100vh;display:block}
.bs-bg{position:fixed;inset:0;z-index:0}
.bs-3d{position:fixed;inset:0;z-index:1}
.bs-vignette{position:fixed;inset:0;z-index:2;pointer-events:none;background:radial-gradient(ellipse at 50% 60%,transparent 35%,rgba(0,0,0,.5) 75%,#000 100%),linear-gradient(180deg,rgba(0,0,0,.6),transparent 26%,transparent 70%,rgba(0,0,0,.55))}
.bs-monogram{position:fixed;top:clamp(1.2rem,3vw,2.4rem);left:clamp(1.2rem,3vw,2.4rem);z-index:5;display:flex;align-items:center;gap:.9rem;opacity:0;animation:bsFadeMono 1.6s .35s ease forwards}
.bs-monogram svg{display:block;flex-shrink:0}
.bs-monogram .bs-p{stroke-dasharray:700;stroke-dashoffset:700;animation:bsDraw 2.4s ease forwards}
.bs-monogram .bs-p1{animation-delay:.35s}
.bs-monogram .bs-p2{animation-delay:.95s;stroke-dasharray:520;stroke-dashoffset:520}
.bs-monogram .bs-l1{animation-delay:1.4s;stroke-dasharray:200;stroke-dashoffset:200}
.bs-monogram .bs-mn{opacity:0;animation:bsType 1.4s 1.6s ease forwards;stroke-dasharray:0}
.bs-wordmark{font-family:var(--font-display),serif;font-size:.86rem;letter-spacing:.32em;text-transform:uppercase;color:${accent};opacity:0;transform:translateX(-8px);animation:bsSlide 1.1s 1.9s ease forwards}
@keyframes bsDraw{to{stroke-dashoffset:0}}
@keyframes bsType{0%{opacity:0;transform:translateY(6px)}100%{opacity:1;transform:none}}
@keyframes bsSlide{to{opacity:1;transform:none}}
@keyframes bsFadeMono{to{opacity:1}}
.bs-frame{position:fixed;left:clamp(1.4rem,4vw,3rem);bottom:clamp(2rem,6vw,4rem);max-width:min(60vw,560px);z-index:4}
.bs-eyebrow{font-size:.72rem;letter-spacing:.32em;text-transform:uppercase;color:${accent};margin-bottom:1.2rem;opacity:0;animation:bsUp .9s 2.2s ease forwards}
.bs-h1{font-family:var(--font-display),serif;font-weight:300;font-size:clamp(2.4rem,6vw,5.6rem);line-height:.98;margin:0 0 1.2rem;letter-spacing:-.02em;opacity:0;animation:bsUp 1.2s 2.4s ease forwards}
.bs-sub{font-size:1rem;line-height:1.55;color:rgba(245,241,232,.7);margin:0 0 1.6rem;max-width:38ch;opacity:0;animation:bsUp 1.1s 2.7s ease forwards}
.bs-cta-row{display:flex;align-items:center;gap:1.2rem;opacity:0;animation:bsUp 1.1s 3s ease forwards}
.bs-cta{display:inline-block;padding:.85rem 1.6rem;border:1px solid ${accent};color:${accent};border-radius:999px;font-size:.74rem;letter-spacing:.18em;text-transform:uppercase;text-decoration:none;transition:all .25s ease}
.bs-cta:hover{background:${accent};color:#000}
.bs-chap{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.66rem;letter-spacing:.28em;text-transform:uppercase;color:rgba(245,241,232,.5);transition:color .4s ease}
@keyframes bsUp{0%{opacity:0;transform:translateY(14px)}100%{opacity:1;transform:none}}
.bs-rail{position:fixed;right:clamp(1.2rem,3vw,2.4rem);top:50%;transform:translateY(-50%);z-index:4;display:none;flex-direction:column;gap:.7rem;align-items:flex-end;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.6rem;letter-spacing:.32em;color:rgba(245,241,232,.4)}
@media(min-width:900px){.bs-rail{display:flex}}
.bs-rail span{display:inline-block;width:1.6rem;text-align:right}
.bs-r{display:inline-block;width:18px;height:1px;background:rgba(245,241,232,.25);margin-right:.5rem;vertical-align:middle;transition:all .3s ease}
.bs-r.is-on{background:${accent};width:28px}
</style>
<script src="https://unpkg.com/three@0.158.0/build/three.min.js"></script>
<script>
(function(){
  // ambient palette wash on cv-bg style canvas
  var bg=document.getElementById('bsBg');if(bg){var b=bg.getContext('2d'),BW=0,BH=0,t=0;
    function sz(){BW=bg.width=innerWidth;BH=bg.height=innerHeight;}sz();addEventListener('resize',sz);
    (function tk(){t++;b.fillStyle='rgba(8,8,12,.18)';b.fillRect(0,0,BW,BH);
      for(var i=0;i<4;i++){var x=BW*(.2+.18*i)+Math.sin(t*.003+i)*60,y=BH*(.5+.12*Math.cos(t*.004+i*1.7));
        var g=b.createRadialGradient(x,y,0,x,y,260);g.addColorStop(0,'${accent}33');g.addColorStop(1,'transparent');b.fillStyle=g;b.beginPath();b.arc(x,y,260,0,6.28);b.fill();}
      requestAnimationFrame(tk);})();}
  if(typeof THREE==='undefined')return;
  var cv=document.getElementById('bs3d');if(!cv)return;
  var R=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true});R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
  var S=new THREE.Scene(),C=new THREE.PerspectiveCamera(40,1,.1,200);
  function sz(){var w=innerWidth,h=innerHeight;R.setSize(w,h,false);C.aspect=w/h;C.updateProjectionMatrix();}sz();addEventListener('resize',sz);
  S.add(new THREE.HemisphereLight(0xfff2dc,0x141414,.55));
  var key=new THREE.DirectionalLight(0xffe5c0,1.2);key.position.set(8,12,6);key.castShadow=true;S.add(key);
  var ground=new THREE.Mesh(new THREE.PlaneGeometry(80,80),new THREE.MeshStandardMaterial({color:0x14110d,roughness:.92}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;S.add(ground);
  // build group — assembles in 4 chapters
  var G=new THREE.Group();S.add(G);
  // chapter II — foundation slab
  var slab=new THREE.Mesh(new THREE.BoxGeometry(7,.4,5),new THREE.MeshStandardMaterial({color:0x2a241c,roughness:.75}));slab.position.y=.2;slab.castShadow=true;slab.receiveShadow=true;slab.scale.set(.001,.001,.001);G.add(slab);
  // chapter III — 4 walls
  var WALL=new THREE.MeshStandardMaterial({color:0xe8dcc0,roughness:.6});
  var walls=[];
  function mkWall(w,h,d,x,y,z){var m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),WALL);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;m.scale.y=.001;G.add(m);walls.push(m);return m;}
  mkWall(7,2.6,.18,0,1.7,-2.4);
  mkWall(7,2.6,.18,0,1.7,2.4);
  mkWall(.18,2.6,4.8,-3.4,1.7,0);
  mkWall(.18,2.6,4.8,3.4,1.7,0);
  // chapter IV — roof + plaque (the brand monogram, dropped in last)
  var roof=new THREE.Mesh(new THREE.BoxGeometry(7.6,.18,5.4),new THREE.MeshStandardMaterial({color:0x1a1714,roughness:.6,metalness:.2}));roof.position.y=3.1;roof.castShadow=true;roof.scale.set(.001,1,.001);G.add(roof);
  // glass plaque holding the BRAND monogram inside the build
  var plaqueGeom=new THREE.PlaneGeometry(2.6,1.4);
  var pcv=document.createElement('canvas');pcv.width=512;pcv.height=256;
  var pc=pcv.getContext('2d');pc.fillStyle='rgba(0,0,0,0)';pc.fillRect(0,0,512,256);
  pc.strokeStyle='${accent}';pc.lineWidth=2;pc.beginPath();pc.arc(256,128,108,0,6.283);pc.stroke();
  pc.font='600 132px ${s.disp||'serif'}';pc.fillStyle='${accent}';pc.textAlign='center';pc.textBaseline='middle';pc.fillText('${initials}',256,138);
  pc.font='600 22px ${s.disp||'serif'}';pc.letterSpacing='8px';pc.fillStyle='rgba(245,241,232,.78)';pc.fillText('${brand}',256,236);
  var ptex=new THREE.CanvasTexture(pcv);ptex.anisotropy=4;
  var plaque=new THREE.Mesh(plaqueGeom,new THREE.MeshPhysicalMaterial({map:ptex,transparent:true,transmission:.55,roughness:.18,thickness:.4,clearcoat:1,opacity:0}));plaque.position.set(0,1.7,2.51);G.add(plaque);
  var lamp=new THREE.PointLight(0xffd9a0,0,8,2);lamp.position.set(0,2.4,0);G.add(lamp);
  // ground markers — site outline drawn first
  var outline=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(7,5)),new THREE.LineBasicMaterial({color:0xc9a961,transparent:true,opacity:0}));outline.rotation.x=-Math.PI/2;outline.position.y=.02;S.add(outline);
  // expose stage hook for scroll-driven chapters
  var chap=document.getElementById('bsChap'),rails=document.querySelectorAll('.bs-r'),labels=['I · Site','II · Slab','III · Frame','IV · Brand'];
  window.__bsStage=function(p){
    // 4 chapters: 0-.25 site, .25-.5 slab, .5-.75 frame, .75-1 roof+plaque
    var c1=Math.max(0,Math.min(1,p/.25));
    var c2=Math.max(0,Math.min(1,(p-.25)/.25));
    var c3=Math.max(0,Math.min(1,(p-.5)/.25));
    var c4=Math.max(0,Math.min(1,(p-.75)/.25));
    outline.material.opacity=c1*.9;
    slab.scale.set(c2,c2,c2);
    walls.forEach(function(w,i){var k=Math.max(0,Math.min(1,c3-i*.05));w.scale.y=k;w.position.y=1.7-(1-k)*1.5;});
    roof.scale.set(c4,1,c4);
    plaque.material.opacity=Math.pow(c4,1.6)*.95;
    lamp.intensity=c4*1.6;
    var idx=p<.25?0:p<.5?1:p<.75?2:3;
    if(chap)chap.textContent=labels[idx];
    rails.forEach(function(r,i){r.classList.toggle('is-on',i===idx);});
    // camera arc
    var ang=p*Math.PI*.9-.2,rad=11-p*2;
    C.position.set(Math.sin(ang)*rad,3.5+p*1.4,Math.cos(ang)*rad);
    C.lookAt(0,1.4,0);
  };
  window.__bsStage(0);
  function loop(){R.render(S,C);requestAnimationFrame(loop);}loop();
  function onScroll(){var sec=document.querySelector('.bs-hero');if(!sec)return;var r=sec.getBoundingClientRect();var top=Math.max(0,-r.top);var max=Math.max(1,sec.offsetHeight-innerHeight);window.__bsStage(Math.min(1,top/max));}
  addEventListener('scroll',onScroll,{passive:true});onScroll();
})();
</script>
</section>`;
}
function scrollReel(x){ // reusable scroll-driven crossfade reel — 4 frames
  const {c} = x;
  const frames = (c.svc||[]).slice(0,4).map((t,i)=>({title:t,sub:(c.svcd||[])[i]||''}));
  while(frames.length<4) frames.push({title:c.h1||'',sub:c.sub||''});
  return `<section class="rl-sec" aria-label="Reel">
  <div class="rl-stage">
    <canvas class="rl-bg" id="rlBg" aria-hidden="true"></canvas>
    ${frames.map((f,i)=>`<div class="rl-frame" data-rl-idx="${i}">
      <div class="rl-num">${String(i+1).padStart(2,'0')}</div>
      <div class="rl-title">${esc(f.title)}</div>
      <div class="rl-sub">${esc(f.sub)}</div>
    </div>`).join('')}
    <div class="rl-progress" aria-hidden="true"><i class="rl-fill"></i></div>
  </div>
  <div class="rl-spacer" aria-hidden="true"></div>
  <style>
  .rl-sec{position:relative;height:300vh;background:var(--bg,#0a0a0a);color:var(--fg,#f5f1e8)}
  .rl-stage{position:sticky;top:0;height:100vh;width:100%;overflow:hidden;display:flex;align-items:center;justify-content:center}
  .rl-bg{position:absolute;inset:0;width:100%;height:100%;z-index:0;background:radial-gradient(ellipse at 50% 50%,color-mix(in srgb,var(--accent) 12%,transparent),transparent 70%)}
  .rl-frame{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 1.6rem;opacity:0;transform:scale(.98);transition:opacity .6s ease,transform .9s ease;z-index:2}
  .rl-frame[data-rl-idx="0"]{opacity:1;transform:none}
  .rl-num{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.72rem;letter-spacing:.32em;color:var(--accent,#c9a961);margin-bottom:1.6rem}
  .rl-title{font-family:var(--font-display),serif;font-weight:300;font-size:clamp(2.6rem,7vw,6.8rem);line-height:.98;letter-spacing:-.02em;max-width:18ch;margin-bottom:1.4rem}
  .rl-sub{font-size:1.05rem;line-height:1.55;color:rgba(245,241,232,.7);max-width:50ch}
  .rl-progress{position:absolute;bottom:1.6rem;left:50%;transform:translateX(-50%);z-index:3;width:min(30vw,260px);height:1px;background:rgba(245,241,232,.18)}
  .rl-fill{display:block;height:100%;width:0;background:var(--accent,#c9a961);transition:width .12s linear}
  </style>
  <script>
  (function(){
    var sec=document.currentScript.closest('.rl-sec');if(!sec)return;
    var frames=sec.querySelectorAll('.rl-frame'),fill=sec.querySelector('.rl-fill');
    var bg=sec.querySelector('.rl-bg');
    if(bg){var b=bg.getContext('2d'),BW=0,BH=0,t=0;
      function sz(){BW=bg.width=bg.clientWidth;BH=bg.height=bg.clientHeight;}sz();addEventListener('resize',sz);
      (function tk(){t++;b.clearRect(0,0,BW,BH);for(var i=0;i<5;i++){var x=BW*(.18+.16*i)+Math.sin(t*.004+i)*40,y=BH*(.5+.18*Math.cos(t*.003+i*1.2));var g=b.createRadialGradient(x,y,0,x,y,180);g.addColorStop(0,'rgba(201,169,110,.18)');g.addColorStop(1,'transparent');b.fillStyle=g;b.beginPath();b.arc(x,y,180,0,6.28);b.fill();}requestAnimationFrame(tk);})();}
    function on(){
      var r=sec.getBoundingClientRect(),top=Math.max(0,-r.top),max=Math.max(1,sec.offsetHeight-innerHeight),p=Math.min(1,top/max);
      var seg=1/frames.length,active=Math.min(frames.length-1,Math.floor(p/seg));
      for(var i=0;i<frames.length;i++){var l=(p-i*seg)/seg,o=0,sc=.98;if(i===active){o=l<.18?l/.18:(l>.82?1-(l-.82)/.18:1);sc=.98+.02*o;}frames[i].style.opacity=Math.max(0,Math.min(1,o));frames[i].style.transform='scale('+sc+')';}
      if(fill)fill.style.width=(p*100).toFixed(1)+'%';
    }
    addEventListener('scroll',on,{passive:true});on();
  })();
  </script>
</section>`;
}
function r3fScene(x){ // react-three-fiber-style ESM scene, drei-style controls. GLB-friendly: extra.glb overrides.
  const {c,s,ex} = x;
  const accent = s.vars['--accent'] || '#9e8cff';
  const glb = (ex && ex.glb) || '';
  return `<section class="r3f-hero">
<canvas class="r3f-canvas" id="r3fCanvas" aria-hidden="true"></canvas>
<div class="r3f-grid" aria-hidden="true"></div>
<div class="r3f-frame">
  <div class="r3f-eyebrow">${esc(c.kicker)}</div>
  <h1 class="r3f-h1">${esc(c.h1)}</h1>
  <p class="r3f-sub">${esc(c.sub)}</p>
  <div class="r3f-cta-row">
    <a class="r3f-cta" href="#story">${esc(c.cta)} &rarr;</a>
    <span class="r3f-hint">drag &middot; scroll &middot; hover</span>
  </div>
</div>
<style>
.r3f-hero{position:relative;height:100vh;min-height:640px;overflow:hidden;background:radial-gradient(ellipse at 50% 50%,#15132b 0%,#070611 70%);color:var(--fg,#edebfa)}
.r3f-canvas{position:absolute;inset:0;z-index:0;width:100%;height:100%;cursor:grab}
.r3f-canvas:active{cursor:grabbing}
.r3f-grid{position:absolute;inset:0;z-index:1;pointer-events:none;background-image:linear-gradient(rgba(158,140,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(158,140,255,.05) 1px,transparent 1px);background-size:64px 64px;mask-image:radial-gradient(ellipse at 50% 50%,#000 30%,transparent 80%);opacity:.6}
.r3f-frame{position:relative;z-index:2;display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-end;height:100%;padding:0 clamp(1.4rem,5vw,4rem) clamp(2.4rem,6vw,4rem);max-width:min(60vw,640px);pointer-events:none}
.r3f-frame > *{pointer-events:auto}
.r3f-eyebrow{font-size:.72rem;letter-spacing:.32em;text-transform:uppercase;color:${accent};margin-bottom:1.4rem}
.r3f-h1{font-family:var(--font-display),serif;font-weight:300;font-size:clamp(2.6rem,7vw,6.4rem);line-height:.98;margin:0 0 1.4rem;letter-spacing:-.02em}
.r3f-sub{font-size:1.05rem;line-height:1.55;color:rgba(237,235,250,.7);margin:0 0 1.8rem;max-width:50ch}
.r3f-cta-row{display:flex;align-items:center;gap:1.2rem}
.r3f-cta{display:inline-block;padding:.95rem 1.8rem;background:${accent};color:#0a0a0a;border-radius:999px;font-size:.78rem;letter-spacing:.18em;text-transform:uppercase;text-decoration:none;font-weight:600}
.r3f-hint{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.62rem;letter-spacing:.28em;text-transform:uppercase;color:rgba(237,235,250,.4)}
</style>
<script src="https://unpkg.com/three@0.158.0/build/three.min.js"></script>
<script src="https://unpkg.com/three@0.158.0/examples/js/loaders/GLTFLoader.js"></script>
<script src="https://unpkg.com/three@0.158.0/examples/js/controls/OrbitControls.js"></script>
<script>
(function(){
  if(typeof THREE==='undefined')return;
  var cv=document.getElementById('r3fCanvas');if(!cv)return;
  var R=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true});R.outputColorSpace=THREE.SRGBColorSpace;R.toneMapping=THREE.ACESFilmicToneMapping;
  var S=new THREE.Scene(),C=new THREE.PerspectiveCamera(45,1,.1,200);C.position.set(0,1.2,4);
  function sz(){var w=innerWidth,h=innerHeight;R.setSize(w,h,false);C.aspect=w/h;C.updateProjectionMatrix();}sz();addEventListener('resize',sz);
  S.add(new THREE.HemisphereLight(0xffffff,0x1a1530,.6));
  var key=new THREE.DirectionalLight(0xfff2dc,1.4);key.position.set(4,6,4);S.add(key);
  var rim=new THREE.DirectionalLight(0x${accent.replace('#','')},.8);rim.position.set(-4,2,-3);S.add(rim);
  // halo
  var halo=new THREE.Mesh(new THREE.IcosahedronGeometry(2.4,2),new THREE.MeshBasicMaterial({color:0x${accent.replace('#','')},wireframe:true,transparent:true,opacity:.16}));S.add(halo);
  // particle field
  var pg=new THREE.BufferGeometry(),pos=[];
  for(var i=0;i<480;i++){var r=2.2+Math.random()*2.8,t=Math.random()*Math.PI*2,p=Math.acos(2*Math.random()-1);pos.push(r*Math.sin(p)*Math.cos(t),r*Math.sin(p)*Math.sin(t),r*Math.cos(p));}
  pg.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  var dust=new THREE.Points(pg,new THREE.PointsMaterial({color:0xedebfa,size:.018,transparent:true,opacity:.65}));S.add(dust);
  // model placeholder (replaced if GLB provided)
  var hero;
  var glb='${esc(glb)}';
  function placeholder(){
    var g=new THREE.TorusKnotGeometry(.85,.28,180,28),m=new THREE.MeshPhysicalMaterial({color:0x${accent.replace('#','')},metalness:.45,roughness:.18,clearcoat:1,clearcoatRoughness:.06,sheen:1,sheenColor:0x${accent.replace('#','')}});
    hero=new THREE.Mesh(g,m);S.add(hero);
  }
  if(glb && THREE.GLTFLoader){
    new THREE.GLTFLoader().load(glb,function(gl){hero=gl.scene;hero.scale.set(1.4,1.4,1.4);S.add(hero);},undefined,placeholder);
  }else placeholder();
  // mouse drag-tilt (drei-style)
  var tx=0,ty=0,mx=0,my=0;
  cv.addEventListener('pointermove',function(e){var r=cv.getBoundingClientRect();mx=(e.clientX-r.left)/r.width-.5;my=(e.clientY-r.top)/r.height-.5;});
  function tick(){tx+=(mx-tx)*.06;ty+=(my-ty)*.06;if(hero){hero.rotation.y+=.005+tx*.04;hero.rotation.x=-ty*.3;}halo.rotation.y-=.002;halo.rotation.x+=.001;dust.rotation.y+=.0006;C.position.x=tx*.6;C.position.y=1.2-ty*.4;C.lookAt(0,0,0);R.render(S,C);requestAnimationFrame(tick);}tick();
  // scroll-driven zoom-out as you leave hero
  addEventListener('scroll',function(){var r=cv.getBoundingClientRect(),p=Math.min(1,Math.max(0,-r.top/innerHeight));C.position.z=4+p*3;},{passive:true});
})();
</script>
</section>`;
}
function scrollDepth(x){ // layered parallax depth — 3 stacked SVG planes scrubbed by scroll
  const {c,s} = x;
  const accent = s.vars['--accent'] || '#c9a961';
  return `<section class="sd-sec" aria-label="Depth">
  <div class="sd-stage">
    <svg class="sd-layer sd-l3" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs><radialGradient id="sdSky" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="${accent}" stop-opacity=".22"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient></defs>
      <rect width="1600" height="900" fill="url(#sdSky)"/>
      <circle cx="1200" cy="240" r="100" fill="${accent}" fill-opacity=".5" filter="blur(40)"/>
    </svg>
    <svg class="sd-layer sd-l2" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path d="M0,640 L220,500 L420,560 L640,460 L860,540 L1080,440 L1300,520 L1600,460 L1600,900 L0,900 Z" fill="${accent}" fill-opacity=".22"/>
    </svg>
    <svg class="sd-layer sd-l1" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path d="M0,780 L160,680 L320,740 L520,660 L720,720 L920,640 L1140,710 L1360,650 L1600,700 L1600,900 L0,900 Z" fill="${accent}" fill-opacity=".48"/>
    </svg>
    <div class="sd-frame">
      <div class="sd-eyebrow">${esc(c.kicker||'Depth')}</div>
      <h2 class="sd-h2">${esc(c.h1||'Layered worlds.')}</h2>
      <p class="sd-sub">${esc(c.sub||'')}</p>
    </div>
  </div>
  <style>
  .sd-sec{position:relative;height:220vh;background:linear-gradient(180deg,var(--bg,#0a0a0a),var(--surface,#11102a));color:var(--fg,#f5f1e8)}
  .sd-stage{position:sticky;top:0;height:100vh;width:100%;overflow:hidden;display:flex;align-items:center;justify-content:center}
  .sd-layer{position:absolute;inset:0;width:100%;height:100%;will-change:transform;filter:drop-shadow(0 12px 32px rgba(0,0,0,.45))}
  .sd-l3{transform:translateY(0);z-index:1}
  .sd-l2{transform:translateY(0);z-index:2}
  .sd-l1{transform:translateY(0);z-index:3}
  .sd-frame{position:relative;z-index:4;text-align:center;padding:0 1.6rem;max-width:min(80vw,720px)}
  .sd-eyebrow{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.72rem;letter-spacing:.32em;text-transform:uppercase;color:${accent};margin-bottom:1.2rem}
  .sd-h2{font-family:var(--font-display),serif;font-weight:300;font-size:clamp(2.2rem,6vw,5.2rem);line-height:1;letter-spacing:-.02em;margin:0 0 1.2rem;text-shadow:0 6px 24px rgba(0,0,0,.5)}
  .sd-sub{font-size:1rem;line-height:1.55;color:rgba(245,241,232,.75);margin:0 auto;max-width:48ch}
  </style>
  <script>
  (function(){
    var sec=document.currentScript.closest('.sd-sec');if(!sec)return;
    var l1=sec.querySelector('.sd-l1'),l2=sec.querySelector('.sd-l2'),l3=sec.querySelector('.sd-l3'),f=sec.querySelector('.sd-frame');
    function ease(t){return t<.5?2*t*t:-1+(4-2*t)*t;}
    function on(){var r=sec.getBoundingClientRect(),t=Math.max(0,-r.top),m=Math.max(1,sec.offsetHeight-innerHeight),p=Math.min(1,t/m),e=ease(p);
      if(l1)l1.style.transform='translate3d(0,'+(-e*120)+'px,0) scale('+(1+e*.08)+')';
      if(l2)l2.style.transform='translate3d(0,'+(-e*70)+'px,0) scale('+(1+e*.04)+')';
      if(l3)l3.style.transform='translate3d(0,'+(-e*30)+'px,0)';
      if(f)f.style.transform='translate3d(0,'+(-e*40)+'px,0)';if(f)f.style.opacity=String(1-Math.max(0,(p-.7)/.3));
    }addEventListener('scroll',on,{passive:true});on();
  })();
  </script>
</section>`;
}
function galleryHorizontalScroll(x){ // pinned horizontal scroll panel
  const {c,ex} = x;
  const g = (ex && ex.gallery && ex.gallery.length) ? ex.gallery : (c.svc||[]).map((t,i)=>[t, (c.svcd||[])[i]||'']);
  return `<section class="hs-sec" id="gallery">
<div class="hs-pin">
  <div class="hs-head"><div class="hs-eb">${esc(c.kicker)}</div><h2 class="hs-h2">Selected works.</h2></div>
  <div class="hs-track">
    ${g.map((p,i)=>`<article class="hs-panel"><div class="hs-num">${String(i+1).padStart(2,'0')}</div><h3 class="hs-pt">${esc(p[0]||'')}</h3><p class="hs-pp">${esc(p[1]||'')}</p></article>`).join('')}
  </div>
</div>
<style>
.hs-sec{position:relative;height:300vh;background:var(--bg,#0a0a0a);color:var(--fg,#f5f1e8)}
.hs-pin{position:sticky;top:0;height:100vh;overflow:hidden;display:flex;flex-direction:column;padding:clamp(2rem,5vw,4rem) 0}
.hs-head{padding:0 clamp(1.4rem,4vw,3rem);margin-bottom:2.4rem;flex-shrink:0}
.hs-eb{font-size:.72rem;letter-spacing:.32em;text-transform:uppercase;color:var(--accent,#c9a961);margin-bottom:.8rem}
.hs-h2{font-family:var(--font-display),serif;font-weight:300;font-size:clamp(2rem,4vw,3.6rem);line-height:1;margin:0;letter-spacing:-.02em}
.hs-track{display:flex;gap:clamp(1rem,2vw,2rem);padding:0 clamp(1.4rem,4vw,3rem);flex:1;align-items:stretch;will-change:transform}
.hs-panel{flex:0 0 min(70vw,520px);background:var(--card,rgba(245,241,232,.04));border:1px solid var(--card-bd,rgba(245,241,232,.12));border-radius:6px;padding:2rem;display:flex;flex-direction:column;gap:1rem}
.hs-num{font-family:var(--font-display),serif;font-size:3rem;font-weight:300;color:var(--accent,#c9a961);line-height:1}
.hs-pt{font-family:var(--font-display),serif;font-size:1.6rem;font-weight:400;margin:0;line-height:1.1}
.hs-pp{font-size:.95rem;color:rgba(245,241,232,.65);margin:0;line-height:1.5}
</style>
<script>
(function(){
  if(typeof gsap==='undefined'||typeof ScrollTrigger==='undefined')return;
  gsap.registerPlugin(ScrollTrigger);
  var track=document.querySelector('.hs-track');if(!track)return;
  var sec=document.querySelector('.hs-sec');
  var dist=track.scrollWidth-innerWidth+48;
  gsap.to(track,{x:-dist,ease:'none',scrollTrigger:{trigger:sec,start:'top top',end:'+='+dist,scrub:1}});
})();
</script>
</section>`;
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
function carouselClassic(x){
  const {c,ex} = x;
  // pull slides from ex.carousel if present, else build from svc/svcd, else from materials/mosaic/ritual
  const src = (ex && ex.carousel) || (ex && ex.materials) || (ex && ex.mosaic) || (ex && ex.ritual) ||
    (c.svc || []).map((s,i)=>[s, (c.svcd||[])[i]||'']);
  const slides = src.slice(0, Math.max(3, Math.min(src.length, 8)));
  const head = c.kicker || 'Featured';
  const title = ex && ex.carouselTitle || 'Selected.';
  return `<section class="cx-sec" id="carousel" aria-roledescription="carousel" aria-label="${esc(title)}">
<div class="cx-wrap">
  <div class="cx-head">
    <div class="cx-eb">${esc(head)}</div>
    <h2 class="cx-h2">${esc(title)}</h2>
  </div>
  <div class="cx-stage">
    <button class="cx-nav cx-prev" type="button" aria-label="Previous slide">&larr;</button>
    <div class="cx-track-wrap"><div class="cx-track">
      ${slides.map((sl,i)=>{
        const t = Array.isArray(sl)?sl[0]:(sl.title||'');
        const p = Array.isArray(sl)?sl[1]:(sl.body||'');
        const m = Array.isArray(sl)?(sl[2]||''):(sl.meta||'');
        return `<article class="cx-slide" data-i="${i}" role="group" aria-roledescription="slide" aria-label="${i+1} of ${slides.length}">
          <div class="cx-num">${String(i+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}</div>
          <h3 class="cx-st">${esc(t)}</h3>
          <p class="cx-sp">${esc(p)}</p>
          ${m?`<div class="cx-sm">${esc(m)}</div>`:''}
        </article>`;
      }).join('')}
    </div></div>
    <button class="cx-nav cx-next" type="button" aria-label="Next slide">&rarr;</button>
  </div>
  <div class="cx-dots" role="tablist">
    ${slides.map((_,i)=>`<button class="cx-dot${i===0?' cx-dot--on':''}" type="button" role="tab" aria-label="Go to slide ${i+1}" data-i="${i}"></button>`).join('')}
  </div>
  <div class="cx-progress" aria-hidden="true"><div class="cx-progress-bar"></div></div>
</div>
<style>
.cx-sec{position:relative;padding:clamp(3rem,6vw,6rem) 0;background:var(--bg);color:var(--fg);overflow:hidden}
.cx-wrap{max-width:1280px;margin:0 auto;padding:0 clamp(1.4rem,4vw,3rem)}
.cx-head{margin-bottom:2.4rem}
.cx-eb{font-family:var(--font-body),sans-serif;font-size:.72rem;letter-spacing:.32em;text-transform:uppercase;color:var(--accent);margin-bottom:.8rem;opacity:.9}
.cx-h2{font-family:var(--font-display),serif;font-weight:300;font-size:clamp(2rem,4vw,3.4rem);line-height:1;margin:0;letter-spacing:-.02em}
.cx-stage{position:relative;display:flex;align-items:stretch;gap:1rem}
.cx-track-wrap{flex:1;overflow:hidden;border-radius:8px;background:var(--surface,rgba(255,255,255,.02));border:1px solid var(--card-bd,rgba(255,255,255,.08))}
.cx-track{display:flex;transition:transform .8s cubic-bezier(.65,0,.35,1);will-change:transform}
.cx-slide{flex:0 0 100%;padding:clamp(2rem,5vw,4rem) clamp(1.6rem,4vw,3.2rem);min-height:340px;display:flex;flex-direction:column;gap:1rem;justify-content:center}
.cx-num{font-family:var(--font-body),monospace;font-size:.7rem;letter-spacing:.32em;text-transform:uppercase;color:color-mix(in srgb,var(--accent) 80%, var(--fg));opacity:.85;margin-bottom:.6rem}
.cx-st{font-family:var(--font-display),serif;font-weight:300;font-size:clamp(1.6rem,3vw,2.6rem);line-height:1.1;margin:0;letter-spacing:-.01em}
.cx-sp{margin:0;max-width:60ch;font-size:1rem;line-height:1.6;color:color-mix(in srgb,var(--fg) 75%, transparent)}
.cx-sm{margin-top:auto;padding-top:1.4rem;font-family:var(--font-body),monospace;font-size:.72rem;letter-spacing:.24em;text-transform:uppercase;color:color-mix(in srgb,var(--accent) 70%, var(--fg));opacity:.8}
.cx-nav{flex:0 0 auto;align-self:center;width:44px;height:44px;border-radius:999px;border:1px solid var(--card-bd,rgba(255,255,255,.18));background:transparent;color:var(--fg);font-size:1.1rem;cursor:pointer;display:grid;place-items:center;transition:background .25s ease,transform .25s ease}
.cx-nav:hover{background:color-mix(in srgb,var(--accent) 14%, transparent);transform:scale(1.05)}
.cx-nav:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.cx-dots{display:flex;justify-content:center;gap:.6rem;margin-top:1.6rem}
.cx-dot{width:8px;height:8px;border-radius:999px;border:none;background:color-mix(in srgb,var(--fg) 30%, transparent);cursor:pointer;padding:0;transition:width .35s ease,background .35s ease}
.cx-dot--on{width:32px;background:var(--accent)}
.cx-dot:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.cx-progress{margin-top:1.4rem;height:2px;background:color-mix(in srgb,var(--fg) 12%, transparent);border-radius:2px;overflow:hidden}
.cx-progress-bar{height:100%;width:0;background:var(--accent);transition:width .15s linear}
@media (max-width:640px){.cx-nav{display:none}.cx-slide{padding:1.6rem 1.2rem;min-height:280px}}
@media (prefers-reduced-motion: reduce){.cx-track{transition:none}.cx-progress-bar{transition:none}}
</style>
<script>
(function(){
  var sec=document.currentScript.closest('.cx-sec'); if(!sec)return;
  var track=sec.querySelector('.cx-track');
  var slides=sec.querySelectorAll('.cx-slide');
  var dots=sec.querySelectorAll('.cx-dot');
  var prev=sec.querySelector('.cx-prev');
  var next=sec.querySelector('.cx-next');
  var bar=sec.querySelector('.cx-progress-bar');
  var n=slides.length, i=0, timer=null, t0=0, dur=5000, paused=false;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function go(k){
    i=((k%n)+n)%n;
    track.style.transform='translateX('+(-i*100)+'%)';
    dots.forEach(function(d,j){d.classList.toggle('cx-dot--on',j===i)});
    t0=Date.now();
  }
  function tick(){
    if(reduce||paused){requestAnimationFrame(tick);return}
    var p=Math.min(1,(Date.now()-t0)/dur);
    bar.style.width=(p*100)+'%';
    if(p>=1){go(i+1)}
    requestAnimationFrame(tick);
  }
  prev&&prev.addEventListener('click',function(){go(i-1)});
  next&&next.addEventListener('click',function(){go(i+1)});
  dots.forEach(function(d,j){d.addEventListener('click',function(){go(j)})});
  sec.addEventListener('mouseenter',function(){paused=true});
  sec.addEventListener('mouseleave',function(){paused=false;t0=Date.now()});
  sec.addEventListener('focusin',function(){paused=true});
  sec.addEventListener('focusout',function(){paused=false;t0=Date.now()});
  // touch swipe
  var sx=0,sy=0,sw=0;
  track.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;sy=e.touches[0].clientY;sw=0;paused=true},{passive:true});
  track.addEventListener('touchmove',function(e){sw=e.touches[0].clientX-sx},{passive:true});
  track.addEventListener('touchend',function(){if(Math.abs(sw)>40)go(i+(sw<0?1:-1));paused=false;t0=Date.now()});
  // keyboard
  sec.tabIndex=0;
  sec.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')go(i-1);else if(e.key==='ArrowRight')go(i+1)});
  go(0); t0=Date.now(); requestAnimationFrame(tick);
})();
</script>
</section>`;
}

/* ---------- babylonHero: Babylon.js 6.x PBR sphere with HDR env ---------- */
function babylonHero(x){
  const {c} = x;
  return `<section class="bh-sec" id="bhero">
<canvas class="bh-canvas" id="bh-c"></canvas>
<div class="bh-overlay">
  <div class="bh-eb">${esc(c.kicker||'')}</div>
  <h1 class="bh-h">${esc(c.h1||c.brand||'')}</h1>
  <p class="bh-p">${esc(c.sub||'')}</p>
</div>
<style>
.bh-sec{position:relative;height:100vh;min-height:640px;background:var(--bg);color:var(--fg);overflow:hidden}
.bh-canvas{position:absolute;inset:0;width:100%;height:100%;display:block;outline:none;touch-action:none}
.bh-overlay{position:absolute;inset:auto 0 0 0;padding:clamp(2rem,5vw,5rem);z-index:1;pointer-events:none;max-width:1280px;margin:0 auto}
.bh-eb{font-family:var(--font-body),monospace;font-size:.7rem;letter-spacing:.32em;text-transform:uppercase;color:var(--accent);margin-bottom:1rem;opacity:.9}
.bh-h{font-family:var(--font-display),serif;font-weight:300;font-size:clamp(2.4rem,6vw,5rem);line-height:1;letter-spacing:-.02em;margin:0 0 1rem;max-width:18ch}
.bh-p{margin:0;max-width:48ch;font-size:1.05rem;color:color-mix(in srgb,var(--fg) 75%, transparent)}
@media (prefers-reduced-motion: reduce){.bh-canvas{display:none}.bh-sec{background:radial-gradient(60% 50% at 50% 40%, color-mix(in srgb, var(--accent) 18%, transparent), transparent), var(--bg)}}
</style>
<script src="https://cdn.babylonjs.com/babylon.js"></script>
<script>
(function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var c=document.getElementById('bh-c'); if(!c||!window.BABYLON)return;
  var eng=new BABYLON.Engine(c,true,{preserveDrawingBuffer:false,stencil:false,antialias:true});
  var s=new BABYLON.Scene(eng); s.clearColor=new BABYLON.Color4(0,0,0,1);
  var cam=new BABYLON.ArcRotateCamera('c',Math.PI/2,Math.PI/2.2,5,BABYLON.Vector3.Zero(),s);
  cam.attachControl(c,true); cam.lowerRadiusLimit=4; cam.upperRadiusLimit=8; cam.wheelDeltaPercentage=0;
  var hemi=new BABYLON.HemisphericLight('h',new BABYLON.Vector3(0,1,0),s); hemi.intensity=.4;
  var dir=new BABYLON.DirectionalLight('d',new BABYLON.Vector3(-1,-2,-1),s); dir.intensity=.8;
  var m=new BABYLON.PBRMaterial('m',s);
  var accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#c9a96e';
  m.albedoColor=BABYLON.Color3.FromHexString(accent);
  m.metallic=.7; m.roughness=.25; m.emissiveColor=BABYLON.Color3.FromHexString(accent).scale(.05);
  var sph=BABYLON.MeshBuilder.CreateSphere('s',{diameter:2.2,segments:64},s); sph.material=m;
  var t=0;
  eng.runRenderLoop(function(){ t+=.005; sph.rotation.y=t; sph.position.y=Math.sin(t*2)*.08; s.render(); });
  window.addEventListener('resize',function(){eng.resize()});
})();
</script>
</section>`;
}

/* ---------- p5Sketch: p5.js generative flow-field background hero ---------- */
function p5Sketch(x){
  const {c} = x;
  return `<section class="p5-sec" id="phero">
<div class="p5-holder" id="p5-h"></div>
<div class="p5-overlay">
  <div class="p5-eb">${esc(c.kicker||'')}</div>
  <h1 class="p5-h">${esc(c.h1||c.brand||'')}</h1>
  <p class="p5-p">${esc(c.sub||'')}</p>
</div>
<style>
.p5-sec{position:relative;height:100vh;min-height:640px;background:var(--bg);color:var(--fg);overflow:hidden}
.p5-holder{position:absolute;inset:0}
.p5-holder canvas{display:block;width:100%!important;height:100%!important}
.p5-overlay{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:clamp(2rem,5vw,5rem);pointer-events:none;max-width:1280px;margin:0 auto;z-index:1}
.p5-eb{font-family:var(--font-body),monospace;font-size:.7rem;letter-spacing:.32em;text-transform:uppercase;color:var(--accent);margin-bottom:1rem;opacity:.9}
.p5-h{font-family:var(--font-display),serif;font-weight:300;font-size:clamp(2.4rem,6vw,5rem);line-height:1;letter-spacing:-.02em;margin:0 0 1rem;max-width:18ch}
.p5-p{margin:0;max-width:48ch;font-size:1.05rem;color:color-mix(in srgb,var(--fg) 75%, transparent)}
@media (prefers-reduced-motion: reduce){.p5-holder{display:none}.p5-sec{background:repeating-linear-gradient(45deg, color-mix(in srgb, var(--accent) 8%, transparent) 0 2px, transparent 2px 14px), var(--bg)}}
</style>
<script src="https://cdn.jsdelivr.net/npm/p5@1.9.0/lib/p5.min.js"></script>
<script>
(function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var holder=document.getElementById('p5-h'); if(!holder)return;
  var tries=0;
  function start(){
    if(!window.p5){ if(tries++<60) return setTimeout(start,50); return; }
    if(!holder.clientWidth||!holder.clientHeight){ if(tries++<60) return setTimeout(start,50); }
    var accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#c9a96e';
    new p5(function(p){
    var pts=[], cnt=480, t=0;
    p.setup=function(){
      var w=holder.clientWidth, h=holder.clientHeight;
      var cv=p.createCanvas(w,h); cv.parent(holder);
      p.noStroke();
      for(var i=0;i<cnt;i++)pts.push({x:p.random(w),y:p.random(h),s:p.random(.4,1.6)});
    };
    p.windowResized=function(){p.resizeCanvas(holder.clientWidth,holder.clientHeight)};
    p.draw=function(){
      p.background(0,0,0,18); t+=.003;
      p.fill(p.color(accent)); p.noStroke();
      for(var i=0;i<pts.length;i++){
        var P=pts[i];
        var n=p.noise(P.x*.0018,P.y*.0018,t)*p.TWO_PI*2;
        P.x+=Math.cos(n)*P.s; P.y+=Math.sin(n)*P.s;
        if(P.x<0||P.x>p.width||P.y<0||P.y>p.height){P.x=p.random(p.width);P.y=p.random(p.height)}
        p.circle(P.x,P.y,P.s*1.6);
      }
    };
    });
  }
  start();
})();
</script>
</section>`;
}

/* ---------- theatreScene: Theatre.js timeline-driven Three.js cube ---------- */
function theatreScene(x){
  const {c} = x;
  return `<section class="th-sec" id="thero">
<canvas class="th-canvas" id="th-c"></canvas>
<div class="th-overlay">
  <div class="th-eb">${esc(c.kicker||'')}</div>
  <h1 class="th-h">${esc(c.h1||c.brand||'')}</h1>
  <p class="th-p">${esc(c.sub||'')}</p>
  <div class="th-scrub" aria-hidden="true"><div class="th-scrub-bar"></div></div>
</div>
<style>
.th-sec{position:relative;height:140vh;background:var(--bg);color:var(--fg);overflow:hidden}
.th-canvas{position:sticky;top:0;width:100%;height:100vh;display:block}
.th-overlay{position:absolute;inset:auto 0 4rem 0;padding:clamp(2rem,5vw,5rem);z-index:1;pointer-events:none;max-width:1280px;margin:0 auto}
.th-eb{font-family:var(--font-body),monospace;font-size:.7rem;letter-spacing:.32em;text-transform:uppercase;color:var(--accent);margin-bottom:1rem;opacity:.9}
.th-h{font-family:var(--font-display),serif;font-weight:300;font-size:clamp(2.4rem,6vw,5rem);line-height:1;letter-spacing:-.02em;margin:0 0 1rem;max-width:18ch}
.th-p{margin:0 0 1.4rem;max-width:48ch;font-size:1.05rem;color:color-mix(in srgb,var(--fg) 75%, transparent)}
.th-scrub{height:2px;width:240px;background:color-mix(in srgb,var(--fg) 14%, transparent);border-radius:2px;overflow:hidden}
.th-scrub-bar{height:100%;width:0;background:var(--accent);transition:width .12s linear}
@media (prefers-reduced-motion: reduce){.th-canvas{display:none}.th-sec{height:auto;min-height:80vh;background:linear-gradient(180deg,var(--bg),color-mix(in srgb,var(--accent) 8%,var(--bg)))}}
</style>
<script type="importmap">
{"imports":{"three":"https://unpkg.com/three@0.158.0/build/three.module.js"}}
</script>
<script type="module">
import * as THREE from 'three';
(function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var sec=document.getElementById('thero');
  var c=document.getElementById('th-c'); if(!c||!sec)return;
  var bar=sec.querySelector('.th-scrub-bar');
  var ren=new THREE.WebGLRenderer({canvas:c,antialias:true,alpha:false});
  ren.setPixelRatio(Math.min(devicePixelRatio,2));
  function size(){ren.setSize(c.clientWidth,c.clientHeight,false)}
  var sc=new THREE.Scene();
  var accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#c9a96e';
  var col=new THREE.Color(accent);
  sc.background=new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()||'#050505');
  var cam=new THREE.PerspectiveCamera(50,1,.1,100); cam.position.z=4;
  sc.add(new THREE.AmbientLight(0xffffff,.5));
  var d=new THREE.DirectionalLight(0xffffff,1.2); d.position.set(3,4,5); sc.add(d);
  var mat=new THREE.MeshStandardMaterial({color:col,metalness:.55,roughness:.25});
  var geo=new THREE.IcosahedronGeometry(1.1,2);
  var mesh=new THREE.Mesh(geo,mat); sc.add(mesh);
  // timeline keyframes (t = 0..1 along section scroll)
  var KF=[
    {t:0,    rx:0,    ry:0,    z:5.5, lx:0},
    {t:.33,  rx:.6,   ry:.9,   z:3.8, lx:-.6},
    {t:.66,  rx:-.4,  ry:2.2,  z:3.0, lx:.5},
    {t:1,    rx:.2,   ry:Math.PI*1.4, z:4.8, lx:0}
  ];
  function lerp(a,b,t){return a+(b-a)*t}
  function sample(p){
    for(var i=0;i<KF.length-1;i++){if(p<=KF[i+1].t){var a=KF[i],b=KF[i+1];var u=(p-a.t)/(b.t-a.t);u=u*u*(3-2*u);return{rx:lerp(a.rx,b.rx,u),ry:lerp(a.ry,b.ry,u),z:lerp(a.z,b.z,u),lx:lerp(a.lx,b.lx,u)}}}
    return KF[KF.length-1];
  }
  function tick(){
    var r=sec.getBoundingClientRect();
    var p=Math.min(1,Math.max(0,-r.top/(r.height-window.innerHeight)));
    var k=sample(p);
    mesh.rotation.x=k.rx; mesh.rotation.y=k.ry; cam.position.z=k.z; cam.position.x=k.lx; cam.lookAt(0,0,0);
    if(bar)bar.style.width=(p*100)+'%';
    var w=c.clientWidth,h=c.clientHeight;
    if(ren.domElement.width!==w*ren.getPixelRatio()||ren.domElement.height!==h*ren.getPixelRatio()){size(); cam.aspect=w/h; cam.updateProjectionMatrix();}
    ren.render(sc,cam); requestAnimationFrame(tick);
  }
  size(); cam.aspect=c.clientWidth/c.clientHeight; cam.updateProjectionMatrix();
  window.addEventListener('resize',function(){size(); cam.aspect=c.clientWidth/c.clientHeight; cam.updateProjectionMatrix();});
  requestAnimationFrame(tick);
})();
</script>
</section>`;
}

/* ---------- rapierPhysicsHero: Rapier WASM physics + Three.js falling shapes ---------- */
function rapierPhysicsHero(x){
  const {c} = x;
  return `<section class="rp-sec" id="rhero">
<canvas class="rp-canvas" id="rp-c"></canvas>
<div class="rp-overlay">
  <div class="rp-eb">${esc(c.kicker||'')}</div>
  <h1 class="rp-h">${esc(c.h1||c.brand||'')}</h1>
  <p class="rp-p">${esc(c.sub||'')}</p>
  <button class="rp-drop" type="button" id="rp-drop">Drop one</button>
</div>
<style>
.rp-sec{position:relative;height:100vh;min-height:640px;background:var(--bg);color:var(--fg);overflow:hidden}
.rp-canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.rp-overlay{position:absolute;inset:auto 0 0 0;padding:clamp(2rem,5vw,5rem);z-index:1;max-width:1280px;margin:0 auto}
.rp-eb{font-family:var(--font-body),monospace;font-size:.7rem;letter-spacing:.32em;text-transform:uppercase;color:var(--accent);margin-bottom:1rem;opacity:.9}
.rp-h{font-family:var(--font-display),serif;font-weight:300;font-size:clamp(2.4rem,6vw,5rem);line-height:1;letter-spacing:-.02em;margin:0 0 1rem;max-width:18ch}
.rp-p{margin:0 0 1.4rem;max-width:48ch;font-size:1.05rem;color:color-mix(in srgb,var(--fg) 75%, transparent)}
.rp-drop{background:transparent;color:var(--fg);border:1px solid var(--accent);padding:.7rem 1.4rem;font-family:var(--font-body),monospace;font-size:.78rem;letter-spacing:.24em;text-transform:uppercase;cursor:pointer;border-radius:var(--btn-radius,2px);transition:background .25s ease}
.rp-drop:hover{background:color-mix(in srgb,var(--accent) 18%,transparent)}
.rp-drop:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
@media (prefers-reduced-motion: reduce){.rp-canvas{display:none}.rp-sec{background:radial-gradient(50% 60% at 50% 60%, color-mix(in srgb, var(--accent) 14%, transparent), transparent), var(--bg)}.rp-drop{display:none}}
</style>
<script type="importmap">
{"imports":{"three":"https://unpkg.com/three@0.158.0/build/three.module.js","@dimforge/rapier3d-compat":"https://cdn.jsdelivr.net/npm/@dimforge/rapier3d-compat@0.12.0/rapier.es.js"}}
</script>
<script type="module">
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
(async function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  await RAPIER.init();
  var c=document.getElementById('rp-c'); if(!c)return;
  var ren=new THREE.WebGLRenderer({canvas:c,antialias:true});
  ren.setPixelRatio(Math.min(devicePixelRatio,2));
  function size(){ren.setSize(c.clientWidth,c.clientHeight,false)}
  size();
  var sc=new THREE.Scene();
  sc.background=new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()||'#050505');
  var cam=new THREE.PerspectiveCamera(50,c.clientWidth/c.clientHeight,.1,100); cam.position.set(0,4,12); cam.lookAt(0,0,0);
  sc.add(new THREE.AmbientLight(0xffffff,.55));
  var d=new THREE.DirectionalLight(0xffffff,1.1); d.position.set(4,8,5); sc.add(d);
  var accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#c9a96e';
  var w=new RAPIER.World({x:0,y:-9.81,z:0});
  // floor
  w.createCollider(RAPIER.ColliderDesc.cuboid(20,.2,20).setRestitution(.3),w.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(0,-2,0)));
  var floor=new THREE.Mesh(new THREE.BoxGeometry(40,.4,40),new THREE.MeshStandardMaterial({color:0x111111,roughness:.9}));
  floor.position.y=-2; sc.add(floor);
  var bodies=[];
  function drop(){
    var size=.5+Math.random()*.4;
    var rb=w.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation((Math.random()-.5)*4,6,(Math.random()-.5)*2));
    w.createCollider(RAPIER.ColliderDesc.cuboid(size/2,size/2,size/2).setRestitution(.35),rb);
    var m=new THREE.Mesh(new THREE.BoxGeometry(size,size,size),new THREE.MeshStandardMaterial({color:accent,metalness:.5,roughness:.3}));
    sc.add(m); bodies.push({rb:rb,m:m});
    if(bodies.length>40){var old=bodies.shift(); w.removeRigidBody(old.rb); sc.remove(old.m); old.m.geometry.dispose(); old.m.material.dispose();}
  }
  for(var i=0;i<8;i++)drop();
  var btn=document.getElementById('rp-drop'); btn&&btn.addEventListener('click',drop);
  function tick(){
    w.step();
    bodies.forEach(function(b){var t=b.rb.translation(),r=b.rb.rotation();b.m.position.set(t.x,t.y,t.z);b.m.quaternion.set(r.x,r.y,r.z,r.w);});
    ren.render(sc,cam); requestAnimationFrame(tick);
  }
  window.addEventListener('resize',function(){size();cam.aspect=c.clientWidth/c.clientHeight;cam.updateProjectionMatrix();});
  requestAnimationFrame(tick);
})();
</script>
</section>`;
}

function relatsKinetic(x){
  const {c} = x;
  const phrase = (c.h1||'Form follows energy.').toUpperCase();
  const sub = c.sub || '';
  // split into chars; spaces become non-breaking gaps
  const chars = phrase.split('').map((ch,i)=>{
    const isSp = ch===' ';
    return `<span class="rk-c${isSp?' rk-c--sp':''}" style="--i:${i}">${isSp?'&nbsp;':esc(ch)}</span>`;
  }).join('');
  return `<section class="rk-sec" id="kinetic">
<div class="rk-stage">
  <div class="rk-grid" aria-hidden="true"></div>
  <div class="rk-eb">${esc(c.kicker||'Periflex // motion study')}</div>
  <h2 class="rk-h">${chars}</h2>
  <div class="rk-italic" aria-hidden="true">relats</div>
  <p class="rk-p">${esc(sub)}</p>
  <div class="rk-meta">
    <span>01 — Disperse</span><span>02 — Settle</span><span>03 — Hold</span>
  </div>
</div>
<style>
.rk-sec{position:relative;height:360vh;background:var(--bg,#0a0a0a);color:var(--fg,#f5f1e8);overflow:hidden}
.rk-stage{position:sticky;top:0;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:clamp(2rem,5vw,5rem);text-align:center}
.rk-grid{position:absolute;inset:0;background-image:linear-gradient(0deg,color-mix(in srgb,var(--accent) 18%, transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in srgb,var(--accent) 18%, transparent) 1px,transparent 1px);background-size:64px 64px;opacity:.12;-webkit-mask-image:radial-gradient(60% 60% at 50% 50%,#000,transparent 80%);mask-image:radial-gradient(60% 60% at 50% 50%,#000,transparent 80%);transform:translateZ(0)}
.rk-eb{font-family:var(--font-body),monospace;font-size:.7rem;letter-spacing:.4em;text-transform:uppercase;color:var(--accent,#ff2d16);margin-bottom:1.6rem;opacity:.85}
.rk-h{font-family:'Anton',var(--font-display),serif;font-weight:400;font-size:clamp(2.6rem,9vw,9rem);line-height:.9;letter-spacing:-.02em;margin:0;display:flex;flex-wrap:wrap;justify-content:center;gap:.06em;max-width:1300px}
.rk-c{display:inline-block;transform:translate(var(--tx,0),var(--ty,0)) rotate(var(--tr,0deg));transition:none;will-change:transform,opacity;opacity:var(--op,1)}
.rk-c--sp{width:.4em}
.rk-italic{position:absolute;font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:300;font-size:clamp(8rem,22vw,22rem);color:color-mix(in srgb,var(--accent) 28%, transparent);letter-spacing:-.05em;pointer-events:none;mix-blend-mode:screen;transform:translate(var(--ix,0),var(--iy,0)) rotate(-6deg);will-change:transform;z-index:0}
.rk-h, .rk-eb, .rk-p, .rk-meta{position:relative;z-index:1}
.rk-p{margin:2rem 0 0;max-width:42ch;font-size:1rem;color:color-mix(in srgb,var(--fg) 70%, transparent);line-height:1.55}
.rk-meta{margin-top:auto;display:flex;gap:clamp(1rem,4vw,4rem);font-family:var(--font-body),monospace;font-size:.7rem;letter-spacing:.32em;text-transform:uppercase;color:color-mix(in srgb,var(--fg) 55%, transparent);padding-top:clamp(2rem,4vw,3rem)}
@media (prefers-reduced-motion: reduce){.rk-c{transform:none!important;opacity:1!important}.rk-italic{transform:rotate(-6deg)!important}}
</style>
<script>
(function(){
  var sec=document.currentScript.closest('.rk-sec');
  if(!sec)return;
  var chars=sec.querySelectorAll('.rk-c');
  var italic=sec.querySelector('.rk-italic');
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  // seed random offsets per char
  chars.forEach(function(el,i){
    el.__rx=(Math.random()*2-1)*60; el.__ry=(Math.random()*2-1)*40; el.__rr=(Math.random()*2-1)*45;
  });
  function ease(t){return t<.5?2*t*t:-1+(4-2*t)*t}
  function frame(){
    var r=sec.getBoundingClientRect();
    var h=sec.offsetHeight-innerHeight;
    var p=Math.max(0,Math.min(1, -r.top/h ));
    // 3 chapters: 0-0.33 disperse, 0.33-0.66 settle, 0.66-1 hold/zoom
    var phase=p<.33?(p/.33):(p<.66?(1-(p-.33)/.33):0);
    var e=ease(phase);
    chars.forEach(function(el){
      el.style.setProperty('--tx', (el.__rx*e)+'px');
      el.style.setProperty('--ty', (el.__ry*e)+'px');
      el.style.setProperty('--tr', (el.__rr*e)+'deg');
      el.style.setProperty('--op', (1 - .35*e).toFixed(3));
    });
    if(italic){
      var pp=ease(p);
      italic.style.setProperty('--ix', (-200 + 400*pp)+'px');
      italic.style.setProperty('--iy', (60 - 120*pp)+'px');
      italic.style.opacity = (.4 + .5*pp).toFixed(3);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
</script>
</section>`;
}
function kanjiMarquee(x){
  const glyphs=['盃','蔵','儀','円','和','静','道','匠','侘','寂','間','縁','禅','器','炎'];
  const row=glyphs.concat(glyphs).concat(glyphs).map(g=>`<span class="kj-g">${g}</span>`).join('');
  return `<section class="kj-sec" aria-hidden="true"><div class="kj-track">${row}</div>
<style>
.kj-sec{position:relative;overflow:hidden;padding:clamp(2rem,5vw,5rem) 0;background:linear-gradient(180deg,var(--bg) 0,color-mix(in srgb,var(--accent) 14%, var(--bg)) 50%,var(--bg) 100%);border-block:1px solid var(--card-bd,rgba(255,255,255,.1));-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.kj-track{display:flex;gap:clamp(2rem,5vw,5rem);white-space:nowrap;animation:kjFlow 38s linear infinite;will-change:transform;font-family:'Cormorant Garamond',serif;font-weight:300;font-size:clamp(4rem,9vw,8rem);line-height:1;color:color-mix(in srgb,var(--accent) 75%, var(--fg));opacity:.86;letter-spacing:-.02em}
.kj-g{flex:0 0 auto;text-shadow:0 0 60px color-mix(in srgb,var(--accent) 45%, transparent)}
@keyframes kjFlow{from{transform:translateX(0)}to{transform:translateX(-33.3333%)}}
@media (prefers-reduced-motion: reduce){.kj-track{animation:none}}
</style>
</section>`;
}
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

const SECTIONS = { heroProduct,heroVideo,heroType,heroCanvas,heroRipple,heroSoft,heroCinematicFilm,heroSpline,heroThreeGlobe,heroVanta,heroVideoGSAP,heroBuildSequence,scrollReel,r3fScene,scrollDepth,galleryHorizontalScroll,kanjiMarquee,relatsKinetic,carouselClassic,babylonHero,p5Sketch,theatreScene,rapierPhysicsHero,heroSplit,heroPhoto,heroSaas,
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
