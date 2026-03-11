import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import Taro from '@tarojs/taro';

interface AppState {
  isInitialized: boolean;
  setInitialized: (value: boolean) => void;
}

const taroStorage = {
  getItem: (name: string) => {
    const value = Taro.getStorageSync(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    Taro.setStorageSync(name, value);
  },
  removeItem: (name: string) => {
    Taro.removeStorageSync(name);
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isInitialized: false,
      setInitialized: (value) => set({ isInitialized: value }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => taroStorage),
    }
  )
);
