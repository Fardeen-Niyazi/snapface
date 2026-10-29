import React from 'react';
import { Text, Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../components/ui/Screen';
import { useTheme } from '../theme';
import { useStudioStore } from '../store';
import { STYLES, getStyle } from '../features/ml/styles';

export default function StudioScreen() {
  const { colors, type, radius, sizes } = useTheme();
  const navigation = useNavigation();
  const styleId = useStudioStore(s => s.styleId);
  const setStyle = useStudioStore(s => s.setStyle);
  const strength = useStudioStore(s => s.strength);
  const setStrength = useStudioStore(s => s.setStrength);
  const current = getStyle(styleId);

  return (
    <Screen>
      <Text style={[type.title, { color: colors.text }]}>{current.name}</Text>
      <Text style={[type.caption, { color: colors.textMuted, marginTop: 4 }]}>
        {current.engine} · {current.sizeMb} MB · ~{current.approxMs} ms
      </Text>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
          marginTop: 16,
        }}
      >
        {STYLES.map(s => (
          <Pressable
            key={s.id}
            onPress={() => setStyle(s.id)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: radius.pill,
              borderWidth: 1,
              borderColor: s.id === styleId ? colors.accent : colors.line,
              backgroundColor: colors.surface,
            }}
          >
            <Text style={[type.caption, { color: colors.text }]}>{s.name}</Text>
          </Pressable>
        ))}
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          marginTop: 20,
        }}
      >
        <Pressable onPress={() => setStrength(Math.max(0, strength - 10))}>
          <Text style={[type.title, { color: colors.accent }]}>−</Text>
        </Pressable>
        <Text style={[type.body, { color: colors.text }]}>
          Strength {strength}%
        </Text>
        <Pressable onPress={() => setStrength(Math.min(100, strength + 10))}>
          <Text style={[type.title, { color: colors.accent }]}>+</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => navigation.navigate('Result')}
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
          Create portrait
        </Text>
      </Pressable>
    </Screen>
  );
}
