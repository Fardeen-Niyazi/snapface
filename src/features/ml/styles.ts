export type StyleId = 'toon' | 'cartoon' | 'anime';
export type StyleEngine = 'shader' | 'tflite';
export type ValueRange = 'neg1to1' | 'zero1';

export type StyleDef = {
  id: StyleId;
  name: string;
  engine: StyleEngine;
  /** Square size of the final image (also the model input size). */
  outputSize: number;
  /** Only for tflite styles. */
  modelFile?: string;
  /** Number range the model expects. Change this one line if a model differs. */
  range?: ValueRange;
  /** Approximate model file size, for display only. */
  sizeMb?: number;
  /** Rough runtime hint used only before the first real run. */
  approxMs: number;
  description: string;
};

// The single source of truth for styles. Screens must not hard-code model names.
export const STYLES: StyleDef[] = [
  {
    id: 'toon',
    name: 'Toon',
    engine: 'shader',
    outputSize: 512,
    approxMs: 120,
    description: 'Live Skia shader, no model download',
  },
  {
    id: 'cartoon',
    name: 'Cartoon',
    engine: 'tflite',
    modelFile: 'cartoongan.tflite',
    outputSize: 512,
    range: 'neg1to1',
    sizeMb: 2.5,
    approxMs: 1840,
    description: 'White-box Cartoonization model',
  },
  {
    id: 'anime',
    name: 'Anime',
    engine: 'tflite',
    modelFile: 'selfie2anime.tflite',
    outputSize: 256,
    range: 'neg1to1',
    sizeMb: 10.2,
    approxMs: 800,
    description: 'Best on close-up selfies',
  },
];

export const getStyle = (id: string): StyleDef =>
  STYLES.find(style => style.id === id) ?? STYLES[0];

export const isModelStyle = (style: StyleDef): boolean =>
  style.engine === 'tflite' && !!style.modelFile;

/** "cartoongan.tflite", used for the Studio chip. */
export const modelLabel = (style: StyleDef): string =>
  style.modelFile ?? 'Skia shader';
