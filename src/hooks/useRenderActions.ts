import { useCallback, useRef, useState } from 'react';
import { Alert, Linking, Platform, ToastAndroid } from 'react-native';
import {
  ActionResult,
  ActionRender,
  PermissionDeniedError,
  downloadRender,
  saveRenderToGallery,
  shareRender,
} from '../services/renderActions';

export type RenderAction = 'download' | 'gallery' | 'share';

function notify(result: ActionResult) {
  const text = `${result.title}. ${result.message}`;
  if (Platform.OS === 'android') {
    ToastAndroid.show(text, ToastAndroid.LONG);
  } else {
    Alert.alert(result.title, result.message);
  }
}

function showError(title: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  if (message.toLowerCase().includes('user did not share')) return;

  if (error instanceof PermissionDeniedError) {
    Alert.alert('Permission needed', message, [
      { text: 'Not now', style: 'cancel' },
      { text: 'Open Settings', onPress: () => void Linking.openSettings() },
    ]);
    return;
  }

  Alert.alert(title, message || 'Please try again.');
}

export function useRenderActions() {
  const [busy, setBusy] = useState<RenderAction | null>(null);
  const busyRef = useRef(false);

  const run = useCallback(
    async (
      action: RenderAction,
      title: string,
      task: () => Promise<ActionResult | null>,
    ): Promise<boolean> => {
      if (busyRef.current) return false;
      busyRef.current = true;
      setBusy(action);
      try {
        const result = await task();
        if (result) notify(result);
        return true;
      } catch (error) {
        showError(title, error);
        return false;
      } finally {
        busyRef.current = false;
        setBusy(null);
      }
    },
    [],
  );

  const download = useCallback(
    (render: ActionRender) =>
      run('download', 'Could not download the image', () =>
        downloadRender(render),
      ),
    [run],
  );

  const saveToGallery = useCallback(
    (render: ActionRender) =>
      run('gallery', 'Could not save to the gallery', () =>
        saveRenderToGallery(render),
      ),
    [run],
  );

  const share = useCallback(
    (render: ActionRender) =>
      run('share', 'Could not share the image', () => shareRender(render)),
    [run],
  );

  return { busy, download, saveToGallery, share };
}
