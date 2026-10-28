import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';

type Props = { children: React.ReactNode; style?: StyleProp<ViewStyle> };

export function Screen({ children, style }: Props) {
  const { colors, spacing } = useTheme();
  return (
    <SafeAreaView
      edges={['top']}
      style={[
        // eslint-disable-next-line react-native/no-inline-styles
        { flex: 1, backgroundColor: colors.bg, padding: spacing.lg },
        style,
      ]}
    >
      {children}
    </SafeAreaView>
  );
}
