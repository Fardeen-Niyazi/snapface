import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../theme';
import { IconButton } from './IconButton';
import { IconName } from './Icon';

type Action = { icon: IconName; label: string; onPress?: () => void };

type Props = {
  title: string;
  left?: Action;
  right?: Action[]; // up to two actions
};

export function ScreenHeader({ title, left, right = [] }: Props) {
  const { colors, type, sizes } = useTheme();
  const side = { minWidth: sizes.icon * 2 + 8 }; // same width both sides, so the title stays centered

  return (
    <View
      style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}
    >
      <View style={[side, { alignItems: 'flex-start' }]}>
        {left ? <IconButton {...left} /> : null}
      </View>
      <Text
        numberOfLines={1}
        style={[
          type.title,
          { color: colors.text, flex: 1, textAlign: 'center' },
        ]}
      >
        {title}
      </Text>
      <View
        style={[
          side,
          { flexDirection: 'row', gap: 8, justifyContent: 'flex-end' },
        ]}
      >
        {right.map(a => (
          <IconButton key={a.label} {...a} />
        ))}
      </View>
    </View>
  );
}
