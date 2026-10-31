import { StyleDef } from './styles';
import { getModel } from './models';
import { loadSquarePixels, pixelsToJpegDataUri } from './imageIO';
import { applyToonShader } from './shaders';

// Deliberately no store import: the Studio screen passes callbacks in.
type PipelineImage = { uri: string };

type Args = {
  image: PipelineImage | null;
  style: StyleDef;
  strength: number; // 0..100
  onProgress: (progress: number, label: string) => void;
  signal: AbortSignal;
};

export type PipelineResult = { uri: string; ms: number };

export class PipelineCancelledError extends Error {
  constructor() {
    super('Cancelled');
    this.name = 'PipelineCancelledError';
  }
}

// 16ms gives React a chance to repaint the progress overlay between stages.
const tick = () => new Promise<void>(resolve => setTimeout(resolve, 16));

function checkAborted(signal: AbortSignal) {
  if (signal.aborted) throw new PipelineCancelledError();
}

async function stage(
  signal: AbortSignal,
  onProgress: Args['onProgress'],
  progress: number,
  label: string,
) {
  checkAborted(signal);
  onProgress(progress, label);
  await tick();
  checkAborted(signal);
}

function toModelValue(byte: number, range: StyleDef['range']): number {
  return range === 'zero1' ? byte / 255 : byte / 127.5 - 1;
}

function fromModelValue(value: number, range: StyleDef['range']): number {
  const v = Number.isFinite(value)
    ? range === 'zero1'
      ? value * 255
      : (value + 1) * 127.5
    : 0;
  return v < 0 ? 0 : v > 255 ? 255 : v;
}

/**
 * Runs a style and returns a JPEG data URI plus the model/shader time in ms.
 * Model loading and JPEG encoding are excluded from `ms` on purpose so the
 * Result screen can compare engines fairly.
 */
export async function runPipeline({
  image,
  style,
  strength,
  onProgress,
  signal,
}: Args): Promise<PipelineResult> {
  if (!image?.uri) throw new Error('Pick a photo first.');

  const size = style.outputSize;
  const amount = Math.max(0, Math.min(100, strength));

  if (style.engine === 'shader') {
    await stage(signal, onProgress, 0.05, 'Preparing photo');
    const pixels = await loadSquarePixels(image.uri, size);
    checkAborted(signal);

    await stage(signal, onProgress, 0.4, 'Applying shader');
    const started = Date.now();
    const styled = applyToonShader(pixels, size, amount);
    const ms = Date.now() - started;
    checkAborted(signal);

    await stage(signal, onProgress, 0.85, 'Encoding JPG');
    const uri = pixelsToJpegDataUri(styled, size);
    checkAborted(signal);
    onProgress(1, 'Done');
    return { uri, ms };
  }

  if (!style.modelFile) {
    throw new Error('This style has no model file configured.');
  }

  const count = size * size;

  await stage(signal, onProgress, 0.05, 'Preparing photo');
  const pixels = await loadSquarePixels(image.uri, size);
  checkAborted(signal);

  await stage(signal, onProgress, 0.25, 'Loading model');
  const model = await getModel(style.modelFile);
  checkAborted(signal);

  await stage(signal, onProgress, 0.4, 'Running model');
  const input = new Float32Array(count * 3);
  for (let i = 0, j = 0; i < count * 4; i += 4) {
    input[j++] = toModelValue(pixels[i], style.range);
    input[j++] = toModelValue(pixels[i + 1], style.range);
    input[j++] = toModelValue(pixels[i + 2], style.range);
  }

  const started = Date.now();
  const outputs = await model.run([input.buffer as ArrayBuffer]);
  const ms = Date.now() - started;
  checkAborted(signal);

  const output = outputs[0];
  if (!output) throw new Error('The model returned no image.');
  const values = new Float32Array(output);
  if (values.length < count * 3) {
    throw new Error('The model returned an unexpected output size.');
  }

  await stage(signal, onProgress, 0.75, 'Blending with original');
  const blend = amount / 100;
  const result = new Uint8Array(count * 4);
  for (let i = 0, j = 0; i < count * 4; i += 4) {
    for (let channel = 0; channel < 3; channel++) {
      const styled = fromModelValue(values[j++], style.range);
      const original = pixels[i + channel];
      result[i + channel] = Math.round(
        original * (1 - blend) + styled * blend,
      );
    }
    result[i + 3] = 255;
  }

  await stage(signal, onProgress, 0.9, 'Encoding JPG');
  const uri = pixelsToJpegDataUri(result, size);
  checkAborted(signal);
  onProgress(1, 'Done');
  return { uri, ms };
}
