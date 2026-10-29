import { useColorScheme } from 'react-native';
import { palettes } from './colors';
import { type } from './typography';
import { spacing, radius, sizes } from './spacing';
import { useSettingsStore } from '../store/useSettingsStore';

export function useTheme() {
  const system = useColorScheme();
  const mode = useSettingsStore(s => s.themeMode);
  const isDark = mode === 'light' ? system === 'dark' : mode === 'dark';

  console.log('useTheme →', { mode, system, isDark }); // remove after testing

  return {
    colors: isDark ? palettes.dark : palettes.light,
    isDark,
    type,
    spacing,
    radius,
    sizes,
  };
}
