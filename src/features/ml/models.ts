import { loadTensorflowModel, TensorflowModel } from 'react-native-fast-tflite';

// Metro needs literal require() paths, so each model is listed here.
const SOURCES: Record<string, () => number> = {
  'cartoongan.tflite': () => require('../../assets/models/cartoongan.tflite'),
  'selfie2anime.tflite': () =>
    require('../../assets/models/selfie2anime.tflite'),
};

const cache = new Map<string, Promise<TensorflowModel>>();

export function getModel(file: string): Promise<TensorflowModel> {
  const source = SOURCES[file];
  if (!source) throw new Error(`Unknown model file: ${file}`);

  const existing = cache.get(file);
  if (existing) return existing;

  const promise = loadTensorflowModel(source(), []); // [] = CPU delegate
  cache.set(file, promise);

  // A rejected promise is removed from the cache so the user can retry.
  void promise.catch(() => {
    if (cache.get(file) === promise) cache.delete(file);
  });

  return promise;
}
