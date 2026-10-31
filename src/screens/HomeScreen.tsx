import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen, Button, ScreenHeader, Icon } from '../components/ui';
import { useTheme } from '../theme';
import { useSettingsStore, ThemeMode } from '../store';
import { pickFromGallery, takePhoto } from '../services/ImagePicker';
import { useImageStore } from '../store';
import { TabNav } from '../navigation/types';

const NEXT: Record<ThemeMode, ThemeMode> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
};

export default function HomeScreen() {
  const { colors, type, radius, isDark } = useTheme();
  const navigation = useNavigation<TabNav>();
  const themeMode = useSettingsStore(state => state.themeMode);
  const setThemeMode = useSettingsStore(state => state.setThemeMode);
  const setImage = useImageStore(state => state.setImage);

  const choose = async (source: 'gallery' | 'camera') => {
    const image =
      source === 'gallery' ? await pickFromGallery() : await takePhoto();
    if (!image) return; // cancelled or an alert was already shown
    setImage(image); // also clears the previous result
    navigation.navigate('Studio');
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
            onPress: () => navigation.navigate('Saved'),
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
          <Button flex title="Gallery" onPress={() => void choose('gallery')} />
          <Button
            flex
            variant="secondary"
            title="Camera"
            onPress={() => void choose('camera')}
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
          Three styles, all on device
        </Text>
        <Text
          style={[
            type.caption,
            { color: colors.textMuted, marginTop: 4, lineHeight: 18 },
          ]}
        >
          Toon is a live shader. Cartoon and Anime run small TFLite models only
          when you tap Create, so your battery stays cool while you pick a
          look.
        </Text>
      </View>
    </Screen>
  );
}
