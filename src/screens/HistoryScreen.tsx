import React from 'react';
import { Text } from 'react-native';
import { Screen } from '../components/ui/Screen';
import { useTheme } from '../theme';

export default function HistoryScreen() {
  const { colors, type } = useTheme();
  return (
    <Screen>
      <Text style={[type.title, { color: colors.text }]}>Saved</Text>
    </Screen>
  );
}
