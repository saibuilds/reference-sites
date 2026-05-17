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

  /* ---- scroll reveal (IntersectionObserver) ---- */
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  },{ threshold:.16, rootMargin:'0px 0px -8% 0px' });
  document.querySelectorAll('[data-reveal],.clip-line').forEach(function(el){ io.observe(el); });

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

  /* ---- count-to counters ---- */
  var cio = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return;
      var el=e.target, end=parseFloat(el.dataset.count), dur=1400, t0=null,
          suf=el.dataset.suffix||'', pre=el.dataset.prefix||'';
      function step(ts){ if(!t0)t0=ts; var p=Math.min(1,(ts-t0)/dur);
        el.textContent=pre+Math.floor((1-Math.pow(1-p,3))*end).toLocaleString()+suf;
        if(p<1) requestAnimationFrame(step); }
      requestAnimationFrame(step); cio.unobserve(el);
    });
  },{threshold:.6});
  document.querySelectorAll('[data-count]').forEach(function(el){ cio.observe(el); });

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
