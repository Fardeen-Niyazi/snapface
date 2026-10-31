import React, { useEffect, useRef, useState } from 'react';
import { Alert, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen, Button, Chip, ScreenHeader } from '../components/ui';
import { PhotoPreview } from '../components/studio/PhotoPreview';
import { StrengthSlider } from '../components/studio/StrengthSlider';
import { ProcessingOverlay } from '../components/studio/ProcessingOverlay';
import { StyleCarousel } from '../components/studio/StyleCarousal';
import { useToonPreview } from '../components/studio/useToonPreview';
import { useTheme } from '../theme';
import { useImageStore, useStudioStore, useHistoryStore } from '../store';
import { getStyle, isModelStyle, modelLabel } from '../features/ml/styles';
import {
  PipelineCancelledError,
  runPipeline,
} from '../features/ml/runPipeline';
import {
  deleteRenderFile,
  makeRenderId,
  saveRenderFile,
} from '../services/renderFiles';
import { TabNav } from '../navigation/types';

export default function StudioScreen() {
  const { radius } = useTheme();
  const navigation = useNavigation<TabNav>();
  const abortRef = useRef<AbortController | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);

  const image = useImageStore(state => state.image);
  const setResult = useImageStore(state => state.setResult);
  const addRender = useHistoryStore(state => state.add);

  const styleId = useStudioStore(state => state.styleId);
  const strength = useStudioStore(state => state.strength);
  const status = useStudioStore(state => state.status);
  const setStyle = useStudioStore(state => state.setStyle);
  const setStrength = useStudioStore(state => state.setStrength);
  const start = useStudioStore(state => state.start);
  const setProgress = useStudioStore(state => state.setProgress);
  const finish = useStudioStore(state => state.finish);
  const fail = useStudioStore(state => state.fail);
  const cancel = useStudioStore(state => state.cancel);

  const current = getStyle(styleId);
  const modelStyle = isModelStyle(current);
  const isToon = current.id === 'toon';

  const { previewUri, thumbUri } = useToonPreview(
    image?.uri,
    strength,
    isToon,
  );

  // Cancel the running pipeline when the user leaves this tab or unmounts.
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      if (!abortRef.current) return;
      abortRef.current.abort();
      abortRef.current = null;
      cancel();
    });
    return unsubscribe;
  }, [navigation, cancel]);

  useEffect(
    () => () => {
      abortRef.current?.abort();
      abortRef.current = null;
    },
    [],
  );

  const onCreate = async () => {
    if (!image) {
      Alert.alert(
        'Choose a photo first',
        'Go to Home and pick a portrait from your gallery or camera.',
      );
      return;
    }
    if (status === 'processing' || abortRef.current) return;

    const controller = new AbortController();
    abortRef.current = controller;
    setShowOriginal(false);
    start();

    try {
      const result = await runPipeline({
        image,
        style: current,
        strength,
        onProgress: setProgress,
        signal: controller.signal,
      });

      if (controller.signal.aborted) throw new PipelineCancelledError();

      setProgress(0.98, 'Saving render');
      const createdAt = Date.now();
      const id = makeRenderId(createdAt);
      const path = await saveRenderFile(result.uri, id);

      if (controller.signal.aborted) {
        void deleteRenderFile(path);
        throw new PipelineCancelledError();
      }

      setResult(path);
      addRender({
        id,
        uri: path,
        styleId: current.id,
        createdAt,
        ms: result.ms,
      });
      finish(result.ms);
      abortRef.current = null;
      navigation.navigate('Result');
    } catch (error) {
      if (
        controller.signal.aborted ||
        error instanceof PipelineCancelledError
      ) {
        cancel();
        return;
      }
      const message =
        error instanceof Error ? error.message : String(error);
      fail(message);
      Alert.alert('Could not create the portrait', message);
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
    }
  };

  const autoRan = useRef(false);
  useEffect(() => {
    if (autoRan.current || !image) return;
    autoRan.current = true;
    // Temporary simulator-only smoke test.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCancel = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    cancel();
  };

  const preview = isToon && previewUri && !showOriginal ? previewUri : image?.uri;
  const chipLabel = modelStyle
    ? `${modelLabel(current)} - runs on Create`
    : `${modelLabel(current)} - live preview`;

  return (
    <View style={{ flex: 1 }}>
      <Screen>
        <ScreenHeader
          title={current.name}
          left={{
            icon: 'back',
            label: 'Back to Home',
            onPress: () => navigation.navigate('Home'),
          }}
          right={[
            {
              icon: 'eye',
              label: 'Hold to see the original',
              onPressIn: () => setShowOriginal(true),
              onPressOut: () => setShowOriginal(false),
            },
          ]}
        />

        <View
          style={{
            flex: 1,
            borderRadius: radius.xl,
            overflow: 'hidden',
          }}
        >
          <PhotoPreview uri={preview} style={{ flex: 1 }} />
          <View style={{ position: 'absolute', top: 12, left: 12 }}>
            <Chip dot label={chipLabel} />
          </View>
          <View style={{ position: 'absolute', top: 12, right: 12 }}>
            <Chip
              label={`${current.outputSize} x ${current.outputSize}`}
            />
          </View>
        </View>

        <View style={{ gap: 14, marginTop: 14 }}>
          <StyleCarousel
            selected={styleId}
            imageUri={image?.uri}
            toonThumbUri={thumbUri}
            onSelect={setStyle}
          />
          <StrengthSlider value={strength} onChange={setStrength} />
          <Button
            title={modelStyle ? 'Run model' : 'Create portrait'}
            onPress={() => void onCreate()}
          />
        </View>
      </Screen>

      {status === 'processing' ? (
        <ProcessingOverlay onCancel={onCancel} />
      ) : null}
    </View>
  );
}
