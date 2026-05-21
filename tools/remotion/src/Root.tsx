import React from 'react';
import { Composition } from 'remotion';
import { HeroReel, HeroReelProps } from './HeroReel';

// One composition reused for every archetype — render.js passes per-archetype
// inputProps to override these defaults at render time.
const defaultProps: HeroReelProps = {
  styleId: '01-luxury-dark',
  vars: {
    '--bg': '#0A0A0A',
    '--surface': '#141414',
    '--fg': '#EDEDED',
    '--accent': '#C9A86A',
    '--card': 'rgba(255,255,255,.05)',
    '--card-bd': 'rgba(255,255,255,.10)',
  },
  disp: 'Cormorant Garamond',
  body: 'Inter',
  light: false,
  brand: 'BRAND',
  kicker: 'A short kicker line',
  h1: 'A headline that lands.',
};

export const Root: React.FC = () => (
  <Composition
    id="HeroReel"
    component={HeroReel}
    durationInFrames={150}
    fps={30}
    width={1920}
    height={1080}
    defaultProps={defaultProps}
  />
);
