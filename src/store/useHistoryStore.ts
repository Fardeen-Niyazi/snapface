import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleId } from '../features/ml/styles';

export type Render = {
  id: string;
  uri: string; // a file inside the app's own storage (we set this up in step 9)
  styleId: StyleId;
  createdAt: number;
};

const MAX_ITEMS = 30;

type HistoryState = {
  renders: Render[];
  add: (render: Render) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useHistoryStore = create<HistoryState>()(
  persist(
    set => ({
      renders: [],
      add: render =>
        set(s => ({ renders: [render, ...s.renders].slice(0, MAX_ITEMS) })),
      remove: id => set(s => ({ renders: s.renders.filter(r => r.id !== id) })),
      clear: () => set({ renders: [] }),
    }),
    { name: 'history', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
