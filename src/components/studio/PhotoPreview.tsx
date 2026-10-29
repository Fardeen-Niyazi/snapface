import React from 'react';
import { Image, StyleProp, View, ViewStyle } from 'react-native';

const SAMPLE = require('../../assets/images/sample.jpg');

type Props = {
  uri?: string | null;
  tint?: string;
  tintOpacity?: number;
  style?: StyleProp<ViewStyle>;
};

export function PhotoPreview({ uri, tint, tintOpacity = 0, style }: Props) {
  return (
    <View style={[{ overflow: 'hidden', backgroundColor: '#000' }, style]}>
      <Image
        source={uri ? { uri } : SAMPLE}
        resizeMode="cover"
        style={{ width: '100%', height: '100%' }}
      />
      {tint ? (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: tint,
            opacity: tintOpacity,
          }}
        />
      ) : null}
    </View>
  );
}
