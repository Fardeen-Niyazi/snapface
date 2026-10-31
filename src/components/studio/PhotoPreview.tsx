import React from 'react';
import {
  Image,
  ImageResizeMode,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';

const SAMPLE = require('../../assets/images/sample.jpg');

type Props = {
  uri?: string | null;
  resizeMode?: ImageResizeMode;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

export function PhotoPreview({
  uri,
  resizeMode = 'cover',
  style,
  children,
}: Props) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        { overflow: 'hidden', backgroundColor: colors.surfaceAlt },
        style,
      ]}
    >
      <Image
        source={uri ? { uri } : SAMPLE}
        resizeMode={resizeMode}
        style={{ width: '100%', height: '100%' }}
      />
      {children}
    </View>
  );
}
