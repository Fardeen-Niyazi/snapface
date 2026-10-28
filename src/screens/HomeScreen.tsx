import React from 'react';
import { Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../components/ui/Screen';
import { useTheme } from '../theme';

export default function HomeScreen() {
  const { colors, type, radius, sizes } = useTheme();
  const navigation = useNavigation();
  return (
    <Screen>
      <Text style={[type.h1, { color: colors.text }]}>
        Turn any photo into a cartoon.
      </Text>
      <Text style={[type.body, { color: colors.textMuted, marginTop: 8 }]}>
        Runs on your phone. Your photos are never uploaded.
      </Text>
      <Pressable
        onPress={() => navigation.navigate('Tabs', { screen: 'Studio' })}
        style={{
          marginTop: 24,
          height: sizes.button,
          borderRadius: radius.md,
          backgroundColor: colors.accent,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={[type.button, { color: colors.onAccent }]}>
          Choose a portrait
        </Text>
      </Pressable>
    </Screen>
  );
}
