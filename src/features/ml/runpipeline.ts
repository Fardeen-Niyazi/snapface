import { PickedImage } from '../../store/useImageStore';
import { StyleDef, StyleId } from './styles';

type Args = {
  image: PickedImage | null;
  style: StyleDef;
  strength: number;
  onProgress: (progress: number, label: string) => void;
  signal: AbortSignal;
};

function wait(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) return reject(new Error('cancelled'));
    const t = setTimeout(resolve, ms);
    signal.addEventListener('abort', () => {
      clearTimeout(t);
      reject(new Error('cancelled'));
    });
  });
}

// TEMPORARY: a colored tint that stands in for each style until step 8.
const TINTS: Record<StyleId, string> = {
  toon: '#F59E0B',
  comic: '#EF4444',
  pixel: '#3B82F6',
  storybook: '#B45309',
  anime: '#EC4899',
  clay: '#A16207',
};
export const mockTint = (id: StyleId) => TINTS[id];
export const mockTintOpacity = (strength: number) => (strength / 100) * 0.35;

export async function runPipeline({
  image,
  style,
  onProgress,
  signal,
}: Args): Promise<string | null> {
  const steps = [
    'Detecting face',
    style.engine === 'shader' ? 'Applying shader' : 'Running TFLite model',
    'Blending with original',
    'Encoding JPG',
  ];
  for (let i = 0; i < steps.length; i++) {
    onProgress(i / steps.length, steps[i]);
    await wait(style.engine === 'shader' ? 200 : 450, signal);
  }
  onProgress(1, 'Done');
  return image?.uri ?? null; // step 8 returns the path of the real cartoon file
}
