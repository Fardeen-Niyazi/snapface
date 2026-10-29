import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen, Button, ScreenHeader, Icon } from '../components/ui';
import { useTheme } from '../theme';
import { useSettingsStore, ThemeMode } from '../store';
import { pickFromGallery, takePhoto } from '../services/ImagePicker';
import { useImageStore } from '../store';
const NEXT: Record<ThemeMode, ThemeMode> = {
  light: 'dark',
  dark: 'light',
};

export default function HomeScreen() {
  const { colors, type, radius, isDark } = useTheme();
  const navigation = useNavigation();
  const themeMode = useSettingsStore(s => s.themeMode);
  const setThemeMode = useSettingsStore(s => s.setThemeMode);

  const setImage = useImageStore(s => s.setImage);

  const choose = async (source: 'gallery' | 'camera') => {
    const img =
      source === 'gallery' ? await pickFromGallery() : await takePhoto();
    if (!img) return; // cancelled or error (the service already showed the alert)
    setImage(img); // also clears any previous result
    navigation.navigate('Tabs', { screen: 'Studio' });
  };
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

      <View
        style={{
          marginTop: 24,
          padding: 22,
          alignItems: 'center',
          gap: 10,
          borderRadius: radius.xl - 2,
          backgroundColor: colors.surface,
          borderWidth: 1.5,
          borderStyle: 'dashed',
          borderColor: colors.accent,
        }}
      >
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            backgroundColor: colors.accent,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="plus" color={colors.onAccent} size={26} />
        </View>
        <Text style={[type.title, { color: colors.text }]}>
          Choose a portrait
        </Text>
        <Text style={[type.caption, { color: colors.textMuted }]}>
          Best with one face, looking at the camera
        </Text>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
          <Button flex title="Gallery" onPress={() => choose('gallery')} />
          <Button
            flex
            variant="secondary"
            title="Camera"
            onPress={() => choose('camera')}
          />
        </View>
      </View>

      <View
        style={{
          marginTop: 16,
          padding: 14,
          borderRadius: radius.lg,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.line,
        }}
      >
        <Text style={[type.caption, { color: colors.text }]}>
          On-device models
        </Text>
        <Text
          style={[
            type.caption,
            { color: colors.textMuted, marginTop: 4, lineHeight: 18 },
          ]}
        >
          Quick styles use shaders (0 MB). Anime and Storybook use small TFLite
          models, under 10 MB in total.
        </Text>
      </View>
    </Screen>
  );
}
