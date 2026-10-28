import React from 'react';
import { Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../components/ui/Screen';
import { useTheme } from '../theme';

export default function ResultScreen() {
  const { colors, type, radius, sizes } = useTheme();
  const navigation = useNavigation();
  return (
    <Screen>
      <Text style={[type.title, { color: colors.text }]}>Your portrait</Text>
      <Pressable
        onPress={() => navigation.goBack()}
        style={{
          marginTop: 24,
          height: sizes.button,
          borderRadius: radius.md,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.line,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={[type.button, { color: colors.text }]}>
          Try another style
        </Text>
      </Pressable>
    </Screen>
  );
}
