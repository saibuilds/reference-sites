/* ============================================================
   SHARED REFERENCE LIBRARY JS — faithful to 02-REEL-FINDINGS.md
   Lenis + GSAP ScrollTrigger + Three.js orb + magnetic + tilt
   + scroll reveal + count-to + nav scroll state.
   GSAP/Lenis/Three loaded via CDN by each page (optional/guarded).
   ============================================================ */
(function(){
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ---- Lenis smooth scroll ---- */
  var lenis = null;
  if (window.Lenis && !reduce){
    lenis = new Lenis({ duration:1.15, easing:function(t){return Math.min(1,1.001-Math.pow(2,-10*t));}, smoothWheel:true });
    function raf(t){ lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (window.gsap && window.ScrollTrigger){
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function(t){ lenis.raf(t*1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ---- nav scroll state ---- */
  var nav = document.querySelector('.nav');
  if (nav){
    var onScroll=function(){ nav.classList.toggle('scrolled', window.scrollY>40); };
    onScroll(); addEventListener('scroll', onScroll, {passive:true});
  }

  /* ---- hero headline word reveal ---- */
  document.querySelectorAll('.hero h1').forEach(function(h){
    if (h.dataset.split) return; h.dataset.split='1';
    var html = h.innerHTML.split(/(\s+)/).map(function(w){
      return /\s+/.test(w)? w : '<span class="word"><span>'+w+'</span></span>';
    }).join('');
    h.innerHTML = html;
    var spans = h.querySelectorAll('.word span');
    if (window.gsap && !reduce){
      gsap.to(spans,{ y:'0%', duration:1.1, ease:'expo.out', stagger:.07, delay:.25 });
    } else { spans.forEach(function(s){ s.style.transform='none'; }); }
  });

  /* ---- scroll reveal (IntersectionObserver + fail-safe) ----
     Reveal is progressive enhancement: content MUST become visible even if
     IO never fires (0-viewport webviews, Lenis transform desync, throttled
     timers). Multiple independent triggers, none depending on setTimeout. */
  function show(el){ el.classList.add('in'); }
  function liveEls(){ return [].slice.call(document.querySelectorAll('[data-reveal]:not(.in),.clip-line:not(.in)')); }
  function vh(){ return window.innerHeight || document.documentElement.clientHeight || 0; }
  function inView(el){
    var r = el.getBoundingClientRect(), h = vh();
    if (!h) return true;                       // viewport unknown -> show
    return r.top < h * 0.94 && r.bottom > -40;
  }
  function sweep(){
    var els = liveEls(), i;
    for (i=0;i<els.length;i++){ if (inView(els[i])) show(els[i]); }
    return els.length;                         // remaining hidden count
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting){ show(e.target); io.unobserve(e.target); } });
    },{ threshold:.16, rootMargin:'0px 0px -8% 0px' });
    liveEls().forEach(function(el){ io.observe(el); });
  }
  // Independent triggers — any one of these guarantees visibility:
  addEventListener('scroll', sweep, {passive:true});
  addEventListener('resize', sweep, {passive:true});
  addEventListener('load', sweep);
  sweep();                                     // initial in-view pass
  // rAF poll for the first ~3.5s: catches late layout / collapsed viewport
  // without relying on setTimeout (which throttles in background tabs).
  var t0 = (window.performance && performance.now) ? performance.now() : Date.now();
  (function poll(){
    var now = (window.performance && performance.now) ? performance.now() : Date.now();
    var remaining = sweep();
    if (now - t0 < 3500 && remaining > 0) requestAnimationFrame(poll);
    else if (remaining > 0) liveEls().forEach(show);   // final hard guarantee
  })();

  /* ---- GSAP ScrollTrigger parallax ---- */
  if (window.gsap && window.ScrollTrigger && !reduce){
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('[data-parallax]').forEach(function(el){
      var amt = parseFloat(el.dataset.parallax)||80;
      gsap.to(el,{ y:amt, ease:'none',
        scrollTrigger:{ trigger:el, start:'top bottom', end:'bottom top', scrub:true } });
    });
  }

  /* ---- magnetic buttons (translate x*0.3,y*0.3) ---- */
  if (!reduce) document.querySelectorAll('.magnetic').forEach(function(b){
    b.addEventListener('mousemove', function(e){
      var r=b.getBoundingClientRect();
      b.style.transform='translate('+(e.clientX-r.left-r.width/2)*.3+'px,'+(e.clientY-r.top-r.height/2)*.3+'px)';
    });
    b.addEventListener('mouseleave', function(){ b.style.transform='translate(0,0)'; });
  });

  /* ---- 3D tilt card (perspective 800px, max 15deg) ---- */
  if (!reduce) document.querySelectorAll('.tilt').forEach(function(c){
    c.addEventListener('mousemove', function(e){
      var r=c.getBoundingClientRect();
      var rx=(.5-(e.clientY-r.top)/r.height)*15, ry=((e.clientX-r.left)/r.width-.5)*15;
      c.style.transform='perspective(800px) rotateX('+rx+'deg) rotateY('+ry+'deg)';
    });
    c.addEventListener('mouseleave', function(){ c.style.transform='perspective(800px) rotateX(0) rotateY(0)'; });
  });

  /* ---- count-to counters (with same fail-safe as reveal) ---- */
  function runCount(el){
    if (el.dataset.counted) return; el.dataset.counted='1';
    var end=parseFloat(el.dataset.count), dur=1400, t0=null,
        suf=el.dataset.suffix||'', pre=el.dataset.prefix||'';
    if (reduce || isNaN(end)){ el.textContent=pre+(isNaN(end)?'':end.toLocaleString())+suf; return; }
    function step(ts){ if(!t0)t0=ts; var p=Math.min(1,(ts-t0)/dur);
      el.textContent=pre+Math.floor((1-Math.pow(1-p,3))*end).toLocaleString()+suf;
      if(p<1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  var counters=[].slice.call(document.querySelectorAll('[data-count]'));
  if ('IntersectionObserver' in window){
    var cio = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ runCount(e.target); cio.unobserve(e.target); } });
    },{threshold:.6});
    counters.forEach(function(el){ cio.observe(el); });
  }
  // Fail-safe: run any counter that's in view (or if viewport is unknown).
  function countSweep(){ counters.forEach(function(el){ if(!el.dataset.counted && inView(el)) runCount(el); }); }
  addEventListener('scroll', countSweep, {passive:true});
  addEventListener('load', countSweep);
  countSweep();
  (function cpoll(){
    var now=(window.performance&&performance.now)?performance.now():Date.now();
    countSweep();
    if (now - t0 < 3500 && counters.some(function(el){return !el.dataset.counted;})) requestAnimationFrame(cpoll);
    else counters.forEach(function(el){ if(!el.dataset.counted) runCount(el); });
  })();

  /* ---- Three.js wireframe orb (Icosahedron 2,15 — mouse-reactive lerp) ---- */
  var host = document.querySelector('canvas#bg3d');
  if (host && window.THREE && !reduce){
    try{
      var sc=new THREE.Scene(),
          cam=new THREE.PerspectiveCamera(60, host.clientWidth/host.clientHeight,.1,100);
      cam.position.z=6;
      var rdr=new THREE.WebGLRenderer({canvas:host,alpha:true,antialias:true});
      rdr.setPixelRatio(Math.min(devicePixelRatio,2));
      function size(){ rdr.setSize(host.clientWidth,host.clientHeight,false);
        cam.aspect=host.clientWidth/host.clientHeight; cam.updateProjectionMatrix(); }
      size(); addEventListener('resize',size);
      var col=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#C9A96E';
      var geo=new THREE.IcosahedronGeometry(2,15),
          mat=new THREE.MeshPhongMaterial({color:new THREE.Color(col),wireframe:true,transparent:true,opacity:.5}),
          orb=new THREE.Mesh(geo,mat);
      sc.add(orb);
      sc.add(new THREE.PointLight(0xffffff,1.4)).position?.set(5,5,5);
      var pl=new THREE.PointLight(0xffffff,1.2); pl.position.set(5,5,5); sc.add(pl);
      sc.add(new THREE.AmbientLight(0xffffff,.4));
      var mx=0,my=0,tx=0,ty=0;
      addEventListener('mousemove',function(e){ mx=(e.clientX/innerWidth-.5); my=(e.clientY/innerHeight-.5); });
      (function loop(){ requestAnimationFrame(loop);
        tx+=(mx-tx)*.05; ty+=(my-ty)*.05;
        orb.rotation.y+=.0026+tx*.05; orb.rotation.x+=.0014+ty*.05;
        rdr.render(sc,cam);
      })();
    }catch(e){ /* WebGL unavailable — silent */ }
  }

  /* ---- Vanta optional (NET/WAVES/FOG) via data-vanta ---- */
  var v=document.querySelector('[data-vanta]');
  if (v && window.VANTA && !reduce){
    var k=v.dataset.vanta, fn=VANTA[k.toUpperCase()];
    if (fn) fn({ el:v, color:parseInt((getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#C9A96E').replace('#','0x')), backgroundColor:parseInt((getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()||'#080808').replace('#','0x')) });
  }
})();
