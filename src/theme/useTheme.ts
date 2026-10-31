import { useColorScheme } from 'react-native';
import { palettes } from './colors';
import { type } from './typography';
import { spacing, radius, sizes } from './spacing';
import { useSettingsStore } from '../store/useSettingsStore';

export function useTheme() {
  const system = useColorScheme();
  const mode = useSettingsStore(state => state.themeMode);
  const isDark = mode === 'system' ? system === 'dark' : mode === 'dark';

  return {
    colors: isDark ? palettes.dark : palettes.light,
    isDark,
    type,
    spacing,
    radius,
    sizes,
  };
}
