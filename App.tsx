import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { useTheme } from './src/theme';

export default function App() {
  const { colors, type, isDark } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bg,
        padding: 24,
        justifyContent: 'center',
      }}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Text style={[type.h1, { color: colors.text }]}>
        Turn any photo into a cartoon.
      </Text>
      <Text style={[type.body, { color: colors.textMuted, marginTop: 8 }]}>
        Runs on your phone. Your photos are never uploaded.
      </Text>
      <View
        style={{
          marginTop: 24,
          height: 52,
          borderRadius: 14,
          backgroundColor: colors.accent,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={[type.button, { color: colors.onAccent }]}>
          Choose a portrait
        </Text>
      </View>
    </View>
  );
}
