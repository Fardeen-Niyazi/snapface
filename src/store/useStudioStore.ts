import { create } from 'zustand';
import { StyleId } from '../features/ml/styles';

export type Status = 'idle' | 'processing' | 'done' | 'error';

type StudioState = {
  styleId: StyleId;
  strength: number; // 0 to 100
  status: Status;
  progress: number; // 0 to 1
  stepLabel: string;
  error: string | null;
  lastMs: number | null; // measured model/shader time of the last run

  setStyle: (id: StyleId) => void;
  setStrength: (value: number) => void;
  start: () => void;
  setProgress: (progress: number, stepLabel: string) => void;
  finish: (ms: number) => void;
  fail: (message: string) => void;
  cancel: () => void;
};

export const useStudioStore = create<StudioState>(set => ({
  styleId: 'toon',
  strength: 85,
  status: 'idle',
  progress: 0,
  stepLabel: '',
  error: null,
  lastMs: null,

  setStyle: styleId => set({ styleId }),
  setStrength: strength => set({ strength }),
  start: () =>
    set({
      status: 'processing',
      progress: 0,
      stepLabel: 'Preparing photo',
      error: null,
      lastMs: null,
    }),
  setProgress: (progress, stepLabel) => set({ progress, stepLabel }),
  finish: ms =>
    set({
      status: 'done',
      progress: 1,
      stepLabel: 'Done',
      lastMs: ms,
      error: null,
    }),
  fail: message => set({ status: 'error', error: message }),
  cancel: () =>
    set({ status: 'idle', progress: 0, stepLabel: '', error: null }),
}));
