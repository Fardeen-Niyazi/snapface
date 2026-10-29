export type StyleId =
  | 'toon'
  | 'comic'
  | 'pixel'
  | 'storybook'
  | 'anime'
  | 'clay';
export type StyleEngine = 'shader' | 'tflite' | 'hybrid';

export type StyleDef = {
  id: StyleId;
  name: string;
  engine: StyleEngine;
  modelFile?: string; // set for tflite and hybrid styles
  sizeMb: number;
  approxMs: number;
};

export const STYLES: StyleDef[] = [
  { id: 'toon', name: 'Toon', engine: 'shader', sizeMb: 0, approxMs: 8 },
  { id: 'comic', name: 'Comic', engine: 'shader', sizeMb: 0, approxMs: 10 },
  { id: 'pixel', name: 'Pixel', engine: 'shader', sizeMb: 0, approxMs: 4 },
  {
    id: 'storybook',
    name: 'Storybook',
    engine: 'tflite',
    modelFile: 'storybook.tflite',
    sizeMb: 2.8,
    approxMs: 340,
  },
  {
    id: 'anime',
    name: 'Anime',
    engine: 'tflite',
    modelFile: 'anime_fp16.tflite',
    sizeMb: 4.2,
    approxMs: 420,
  },
  {
    id: 'clay',
    name: 'Clay',
    engine: 'hybrid',
    modelFile: 'clay.tflite',
    sizeMb: 2.4,
    approxMs: 390,
  },
];

export const getStyle = (id: StyleId) => STYLES.find(s => s.id === id)!;
