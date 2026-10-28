import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

type Props = { name: 'Home' | 'Studio' | 'Saved'; color: string; size?: number };

export function TabIcon({ name, color, size = 22 }: Props) {
  const p = {
    stroke: color, strokeWidth: 2, fill: 'none',
    strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'Home' && <Path d="M3 11 12 3l9 8v10H3z" {...p} />}
      {name === 'Studio' && <Path d="M12 3l2.5 6L21 12l-6.5 3L12 21l-2.5-6L3 12l6.5-3z" {...p} />}
      {name === 'Saved' && (
        <>
          <Rect x={3} y={3} width={18} height={18} rx={3} {...p} />
          <Path d="M3 15l5-5 4 4 3-3 6 6" {...p} />
        </>
      )}
    </Svg>
  );
}