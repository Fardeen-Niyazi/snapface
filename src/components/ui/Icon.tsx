import React from 'react';
import Svg, { Path } from 'react-native-svg';

// Each icon is one stroke path on a 24x24 grid (same icons as the mockup).
const PATHS = {
  back: 'M15 18l-6-6 6-6',
  history: 'M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0 M12 7v5l3 2',
  moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
  sun: 'M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0 M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0',
  download: 'M12 3v12M7 10l5 5 5-5M5 21h14',
  share: 'M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v14',
  plus: 'M12 5v14M5 12h14',
  check: 'M5 13l4 4L19 7',
} as const;

export type IconName = keyof typeof PATHS;

type Props = { name: IconName; color: string; size?: number };

export function Icon({ name, color, size = 18 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d={PATHS[name]}
        stroke={color}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}