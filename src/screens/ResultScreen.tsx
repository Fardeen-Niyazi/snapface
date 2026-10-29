import React from 'react';
import { Alert, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen, Button, Chip, ScreenHeader } from '../components/ui';
import { CompareSlider } from '../components/result/CompareSlider';
import { useTheme } from '../theme';
import { useImageStore, useStudioStore } from '../store';
import { getStyle } from '../features/ml/styles';
import { mockTint, mockTintOpacity } from '../features/ml/runPipeline';

export default function ResultScreen() {
  const { colors, type, radius } = useTheme();
  const navigation = useNavigation();
  const image = useImageStore(s => s.image);
  const resultUri = useImageStore(s => s.resultUri);
  const styleId = useStudioStore(s => s.styleId);
  const strength = useStudioStore(s => s.strength);
  const style = getStyle(styleId);

  const todo = (what: string) =>
    Alert.alert(what, 'We connect this in step 9.');

  return (
    <Screen>
      <ScreenHeader
        title="Your portrait"
        left={{
          icon: 'back',
          label: 'Back',
          onPress: () => navigation.goBack(),
        }}
      />

      <View style={{ flex: 1, borderRadius: radius.xl, overflow: 'hidden' }}>
        <CompareSlider
          beforeUri={image?.uri}
          afterUri={resultUri ?? image?.uri}
          tint={mockTint(styleId)}
          tintOpacity={mockTintOpacity(strength)}
        />
        <View
          pointerEvents="none"
          style={{ position: 'absolute', top: 12, left: 12 }}
        >
          <Chip label="Original" />
        </View>
        <View
          pointerEvents="none"
          style={{ position: 'absolute', top: 12, right: 12 }}
        >
          <Chip dot label={style.name} />
        </View>
      </View>

      <View style={{ gap: 12, marginTop: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={[type.caption, { color: colors.accent }]}>
            ✓ 1024 × 1024
          </Text>
          <Text style={[type.caption, { color: colors.textMuted }]}>
            Processed on device
          </Text>
        </View>
        <Button
          title="Download image"
          icon="download"
          rightLabel="JPG · 1.2 MB"
          onPress={() => todo('Download')}
        />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button
            flex
            variant="secondary"
            title="Share"
            icon="share"
            onPress={() => todo('Share')}
          />
          <Button
            flex
            variant="secondary"
            title="Try another"
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
    </Screen>
  );
}
