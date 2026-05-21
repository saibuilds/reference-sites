import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';

export type HeroReelProps = {
  styleId: string;
  vars: Record<string, string>;
  disp: string;
  body: string;
  light: boolean;
  brand: string;
  kicker: string;
  h1: string;
};

export const HeroReel: React.FC<HeroReelProps> = ({
  vars, disp, body, light, brand, kicker, h1,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const bg = vars['--bg'];
  const surface = vars['--surface'];
  const fg = vars['--fg'];
  const accent = vars['--accent'];

  // Subtle slow zoom on the whole frame, lifts the static feel.
  const zoom = interpolate(frame, [0, durationInFrames], [1.05, 1.0], {
    extrapolateRight: 'clamp',
  });

  // Atmospheric blobs breathe back and forth.
  const breathe = Math.sin((frame / fps) * 0.55 * Math.PI) * 16;
  const atmoOp = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });

  // Type reveals.
  const brandOp = interpolate(frame, [12, 32], [0, 1], { extrapolateRight: 'clamp' });
  const h1Spring = spring({ frame: frame - 28, fps, config: { damping: 22, stiffness: 110 } });
  const h1Op = interpolate(frame, [28, 60], [0, 1], { extrapolateRight: 'clamp' });
  const kickerOp = interpolate(frame, [56, 80], [0, 1], { extrapolateRight: 'clamp' });

  // Outro fade.
  const outroOp = interpolate(frame, [125, durationInFrames], [1, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: bg, transform: `scale(${zoom})` }}>
      {/* Diagonal base gradient */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, ${bg} 0%, ${surface} 55%, ${bg} 100%)`,
        }}
      />

      {/* Two atmospheric accent blobs, soft-blurred, slow breathe */}
      <AbsoluteFill style={{ opacity: atmoOp }}>
        <div
          style={{
            position: 'absolute',
            left: '8%', top: '14%',
            width: 760, height: 620,
            borderRadius: '50%',
            background: accent,
            filter: 'blur(160px)',
            opacity: 0.55,
            transform: `translate(${breathe}px, ${-breathe}px)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '6%', bottom: '10%',
            width: 860, height: 720,
            borderRadius: '50%',
            background: accent,
            filter: 'blur(180px)',
            opacity: 0.38,
            transform: `translate(${-breathe}px, ${breathe}px)`,
          }}
        />
      </AbsoluteFill>

      {/* Type layer */}
      <AbsoluteFill
        style={{
          opacity: outroOp,
          padding: '10vh 9vw',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: body,
            fontSize: 22,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: fg,
            opacity: brandOp,
            marginBottom: 36,
          }}
        >
          {brand}
        </div>
        <div
          style={{
            fontFamily: disp,
            fontSize: 132,
            lineHeight: 1.04,
            fontWeight: 400,
            color: fg,
            opacity: h1Op,
            transform: `translateY(${(1 - h1Spring) * 36}px)`,
            maxWidth: '74%',
          }}
        >
          {h1}
        </div>
        <div
          style={{
            fontFamily: body,
            fontSize: 26,
            color: fg,
            opacity: kickerOp * 0.72,
            marginTop: 32,
            letterSpacing: 1,
          }}
        >
          {kicker}
        </div>
      </AbsoluteFill>

      {/* Cinematic vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(72% 72% at 50% 50%, transparent 0%, transparent 62%, ${bg} 100%)`,
          opacity: light ? 0.45 : 0.72,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
