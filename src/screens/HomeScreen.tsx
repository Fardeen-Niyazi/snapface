import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen, Button, Chip, ScreenHeader } from '../components/ui';
import { useTheme } from '../theme';
import { useSettingsStore, ThemeMode } from '../store';

const NEXT: Record<ThemeMode, ThemeMode> = {
  light: 'dark',
  dark: 'light',
};

export default function HomeScreen() {
  const { colors, type, isDark } = useTheme();
  const navigation = useNavigation();
  const themeMode = useSettingsStore(s => s.themeMode);
  const setThemeMode = useSettingsStore(s => s.setThemeMode);

  return (
    <Screen>
      <ScreenHeader
        title="Snapface"
        right={[
          {
            icon: isDark ? 'sun' : 'moon',
            label: `Theme: ${themeMode}. Tap to change`,
            onPress: () => setThemeMode(NEXT[themeMode]),
          },
          {
            icon: 'history',
            label: 'Saved renders',
            onPress: () => navigation.navigate('Tabs', { screen: 'Saved' }),
          },
        ]}
      />
      <Text style={[type.h1, { color: colors.text }]}>
        Turn any photo into a cartoon.
      </Text>
      <Text style={[type.body, { color: colors.textMuted, marginTop: 8 }]}>
        Runs on your phone. Your photos are never uploaded.
      </Text>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
        <Chip dot label={`Theme: ${themeMode}`} />
        <Chip label="anime_fp16 · 4.2 MB" />
      </View>
      x
      <View style={{ gap: 12, marginTop: 24 }}>
        <Button
          title="Choose a portrait"
          icon="plus"
          onPress={() => navigation.navigate('Tabs', { screen: 'Studio' })}
        />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button flex variant="secondary" title="Gallery" onPress={() => {}} />
          <Button flex variant="secondary" title="Camera" onPress={() => {}} />
        </View>
        <Button
          title="Download image"
          icon="download"
          rightLabel="JPG · 1.2 MB"
          onPress={() => {}}
        />
        <Button title="Processing..." loading onPress={() => {}} />
        <Button title="Disabled" disabled onPress={() => {}} />
      </View>
    </Screen>
  );
}
