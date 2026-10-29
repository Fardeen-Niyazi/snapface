import React from 'react';
import { Pressable } from 'react-native';
import { useTheme } from '../../theme';
import { Icon, IconName } from './Icon';

type Props = {
  icon: IconName;
  label: string; // required: screen readers need it, there is no visible text
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
};

export function IconButton({ icon, label, onPress, onPressIn, onPressOut }: Props) {
  const { colors, radius, sizes } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={({ pressed }) => ({
        width: sizes.icon,
        height: sizes.icon,
        borderRadius: radius.md,
        backgroundColor: pressed ? colors.surfaceAlt : colors.surface,
        borderWidth: 1,
        borderColor: colors.line,
        alignItems: 'center',
        justifyContent: 'center',
      })}>
      <Icon name={icon} color={colors.text} />
    </Pressable>
  );
}