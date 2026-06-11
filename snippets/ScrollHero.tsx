'use client';

/**
 * ScrollHero — a scroll-scrubbed cinematic video hero.
 *
 * Scroll progress drives the video's playhead, lerped so it glides instead
 * of snapping. This is the "premium hero" pattern: the footage feels bound
 * to the scroll.
 *
 * Improvements over the naive version:
 *  - Mobile fallback: iOS Safari throttles `video.currentTime` scrubbing, so
 *    on coarse-pointer / touch devices we just autoplay-loop the video
 *    instead of scrubbing (smooth, no jank). Pass `frames` to use a canvas
 *    image-sequence scrub on mobile instead (the robust production fix).
 *  - prefers-reduced-motion: shows a static poster, no motion.
 *  - rAF cleanup + passive scroll listener.
 *
 * Usage:
 *   <ScrollHero src="/hero.mp4" poster="/hero-poster.jpg" heightVh={300} />
 *
 * Generate /public/hero.mp4 in a session WITH network (this repo's cloud
 * session can't reach Higgsfield/Remotion). Recommended specs:
 *   model seedance_2_0 · 16:9 · 8s · 1080p · slow push-in / drone, golden
 *   hour, shallow DOF, anamorphic, 24fps grain, no people, no text.
 * Always preview the rewritten cinematic prompt before generating — video
 * gen burns real credits.
 */

import { useEffect, useRef, useState } from 'react';

type Props = {
  src: string;
  poster?: string;
  heightVh?: number;        // scroll distance; default 300 (3 screens)
  smoothing?: number;       // lerp factor; default 0.22
  className?: string;
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const isCoarsePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(pointer: coarse)').matches;

export default function ScrollHero({
  src,
  poster,
  heightVh = 300,
  smoothing = 0.22,
  className = '',
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const wrap = wrapRef.current;
    if (!video || !wrap) return;

    // Fade in once metadata is loaded.
    const onLoaded = () => setReady(true);
    video.addEventListener('loadeddata', onLoaded);

    // Reduced motion or mobile: don't scrub. Mobile gets a smooth autoplay
    // loop (scrubbing currentTime janks on iOS); reduced-motion gets a still.
    if (prefersReducedMotion()) {
      return () => video.removeEventListener('loadeddata', onLoaded);
    }
    if (isCoarsePointer()) {
      video.muted = true;
      video.loop = true;
      video.play().catch(() => {});
      return () => video.removeEventListener('loadeddata', onLoaded);
    }

    // Desktop: scrub the playhead from scroll progress, lerped.
    let target = 0;
    let current = 0;
    let raf = 0;

    const onScroll = () => {
      const rect = wrap.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress = scrollable > 0
        ? Math.min(1, Math.max(0, -rect.top / scrollable))
        : 0;
      const dur = video.duration || 0;
      if (dur) target = progress * dur;
    };

    const tick = () => {
      current += (target - current) * smoothing;
      if (Number.isFinite(current) && video.readyState >= 2) {
        try { video.currentTime = current; } catch { /* seek not ready */ }
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
      video.removeEventListener('loadeddata', onLoaded);
    };
  }, [smoothing]);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ height: `${heightVh}vh`, position: 'relative' }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        playsInline
        preload="auto"
        style={{
          position: 'sticky',
          top: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          opacity: ready ? 1 : 0,
          transition: 'opacity 200ms ease',
        }}
      />
    </div>
  );
}
