import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen, Button, Chip, ScreenHeader } from '../../components/ui';
import { PhotoPreview } from '../../components/studio/PhotoPreview';
import { ProcessingOverlay } from '../../components/studio/ProcessingOverlay';
import { useTheme } from '../../theme';
import { useImageStore } from '../../store';
import { getStyle } from '../../features/ml/styles';
import {
  runPipeline,
  mockTint,
  mockTintOpacity,
} from '../../features/ml/runPipeline';
import { StyleCarousel } from './StyleCarousal';
import { StrengthSlider } from './StrengthSlider';
import { useStudioStore } from '../../store';

export default function StudioScreen() {
  const { radius } = useTheme();
  const navigation = useNavigation();
  const [showOriginal, setShowOriginal] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const image = useImageStore(s => s.image);
  const setResult = useImageStore(s => s.setResult);

  const styleId = useStudioStore(s => s.styleId);
  const strength = useStudioStore(s => s.strength);
  const status = useStudioStore(s => s.status);
  const setStyle = useStudioStore(s => s.setStyle);
  const setStrength = useStudioStore(s => s.setStrength);
  const start = useStudioStore(s => s.start);
  const setProgress = useStudioStore(s => s.setProgress);
  const finish = useStudioStore(s => s.finish);
  const fail = useStudioStore(s => s.fail);
  const cancel = useStudioStore(s => s.cancel);

  const current = getStyle(styleId);

  const onCreate = async () => {
    const ac = new AbortController();
    abortRef.current = ac;
    start();
    try {
      const out = await runPipeline({
        image,
        style: current,
        strength,
        onProgress: setProgress,
        signal: ac.signal,
      });
      setResult(out);
      finish();
      navigation.navigate('Result');
    } catch (e) {
      if (!ac.signal.aborted) fail(String(e));
    }
  };

  const onCancel = () => {
    abortRef.current?.abort();
    cancel();
  };

  return (
    <View style={{ flex: 1 }}>
      <Screen>
        <ScreenHeader
          title={current.name}
          left={{
            icon: 'back',
            label: 'Back',
            onPress: () => navigation.navigate('Tabs', { screen: 'Home' }),
          }}
          right={[{ icon: 'eye', label: 'Hold to see the original' }]}
        />

        <View style={{ flex: 1, borderRadius: radius.xl, overflow: 'hidden' }}>
          <PhotoPreview
            uri={image?.uri}
            tint={showOriginal ? undefined : mockTint(styleId)}
            tintOpacity={mockTintOpacity(strength)}
            style={{ flex: 1 }}
          />
          <View style={{ position: 'absolute', top: 12, left: 12 }}>
            <Chip
              dot
              label={`${current.modelFile ?? 'GPU shader'} · ${
                current.sizeMb
              } MB`}
            />
          </View>
          <View style={{ position: 'absolute', top: 12, right: 12 }}>
            <Chip label={`~${current.approxMs} ms`} />
          </View>
        </View>

        <View style={{ gap: 14, marginTop: 14 }}>
          <StyleCarousel
            selected={styleId}
            uri={image?.uri}
            onSelect={setStyle}
          />
          <StrengthSlider value={strength} onChange={setStrength} />
          <Button title="Create portrait" onPress={onCreate} />
        </View>
      </Screen>
      {status === 'processing' ? (
        <ProcessingOverlay onCancel={onCancel} />
      ) : null}
    </View>
  );
}
