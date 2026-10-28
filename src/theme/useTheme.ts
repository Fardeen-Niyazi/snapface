import { useColorScheme } from 'react-native';
import { palettes } from './colors';
import { type } from './typography';
import { spacing, radius, sizes } from './spacing';

export function useTheme() {
  const isDark = useColorScheme() === 'dark';
  return {
    colors: isDark ? palettes.dark : palettes.light,
    isDark,
    type,
    spacing,
    radius,
    sizes,
  };
}
