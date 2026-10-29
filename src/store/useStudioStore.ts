import { create } from 'zustand';
import { StyleId } from '../features/ml/styles';

export type Status = 'idle' | 'processing' | 'done' | 'error';

type StudioState = {
  styleId: StyleId;
  strength: number; // 0 to 100
  status: Status;
  progress: number; // 0 to 1
  stepLabel: string; // "Running TFLite model", etc.
  error: string | null;

  setStyle: (id: StyleId) => void;
  setStrength: (value: number) => void;
  start: () => void;
  setProgress: (progress: number, stepLabel: string) => void;
  finish: () => void;
  fail: (message: string) => void;
  cancel: () => void;
};

export const useStudioStore = create<StudioState>(set => ({
  styleId: 'anime',
  strength: 85,
  status: 'idle',
  progress: 0,
  stepLabel: '',
  error: null,

  setStyle: styleId => set({ styleId }),
  setStrength: strength => set({ strength }),
  start: () =>
    set({
      status: 'processing',
      progress: 0,
      stepLabel: 'Detecting face',
      error: null,
    }),
  setProgress: (progress, stepLabel) => set({ progress, stepLabel }),
  finish: () => set({ status: 'done', progress: 1 }),
  fail: error => set({ status: 'error', error }),
  cancel: () => set({ status: 'idle', progress: 0, stepLabel: '' }),
}));
