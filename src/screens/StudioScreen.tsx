import React from 'react';
import { Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../components/ui/Screen';
import { useTheme } from '../theme';

export default function StudioScreen() {
  const { colors, type, radius, sizes } = useTheme();
  const navigation = useNavigation();
  return (
    <Screen>
      <Text style={[type.title, { color: colors.text }]}>Studio</Text>
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
