import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleId } from '../features/ml/styles';
import { deleteRenderFile } from '../services/renderFiles';

export type Render = {
  id: string;
  uri: string; // plain file path inside the app's documents/renders
  styleId: StyleId;
  createdAt: number;
  ms: number; // measured model/shader time
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
        set(state => {
          const all = [render, ...state.renders];
          const kept = all.slice(0, MAX_ITEMS);
          // Trimmed renders must not leave orphaned JPEGs behind.
          all
            .slice(MAX_ITEMS)
            .forEach(item => void deleteRenderFile(item.uri));
          return { renders: kept };
        }),

      remove: id =>
        set(state => {
          const target = state.renders.find(item => item.id === id);
          if (target) void deleteRenderFile(target.uri);
          return { renders: state.renders.filter(item => item.id !== id) };
        }),

      clear: () =>
        set(state => {
          state.renders.forEach(item => void deleteRenderFile(item.uri));
          return { renders: [] };
        }),
    }),
    {
      name: 'history',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ renders: state.renders }),
    },
  ),
);
