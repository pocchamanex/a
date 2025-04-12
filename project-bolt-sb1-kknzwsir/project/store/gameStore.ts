import { create } from 'zustand';

interface Session {
  date: number;
  score: number;
  nValue: number;
  duration: number;
  isStroop: boolean;
  isRotating: boolean;
  isReverse: boolean;
  nVariation: boolean;
  crossModal: boolean;
}

// 色の定義
export const COLORS = {
  RED: '#FF0000',
  BLUE: '#0000FF',
  YELLOW: '#FFFF00',
  WHITE: '#FFFFFF',
  GREEN: '#00FF00',
  PINK: '#FFC0CB',
  BLACK: '#000000',
} as const;

// 形の定義
export const SHAPES = {
  TRIANGLE: '▲',
  DIAMOND: '♦',
  SQUARE: '■',
  CIRCLE: '●',
  STAR: '★',
  NOTE: '♪',
} as const;

interface GameState {
  nValue: number;
  isStroop: boolean;
  isRotating: boolean;
  isReverse: boolean;
  nVariation: boolean;
  crossModal: boolean;
  language: 'en' | 'ja';
  trialCount: number;
  volume: number;
  sessionHistory: Session[];
  stimulusDuration: number; // 刺激表示時間（秒）
  // 刺激の設定
  usePosition: boolean;
  useAudio: boolean;
  useColors: boolean;
  useShapes: boolean;
  setNValue: (value: number) => void;
  setIsStroop: (value: boolean) => void;
  setIsRotating: (value: boolean) => void;
  setIsReverse: (value: boolean) => void;
  setNVariation: (value: boolean) => void;
  setCrossModal: (value: boolean) => void;
  setLanguage: (lang: 'en' | 'ja') => void;
  setTrialCount: (count: number) => void;
  setVolume: (volume: number) => void;
  setStimulusDuration: (duration: number) => void; // 刺激表示時間を設定する関数
  addSession: (session: Session) => void;
  // 刺激の設定を変更する関数
  setUsePosition: (value: boolean) => void;
  setUseAudio: (value: boolean) => void;
  setUseColors: (value: boolean) => void;
  setUseShapes: (value: boolean) => void;
}

export const useGameStore = create<GameState>((set) => ({
  nValue: 2,
  isStroop: false,
  isRotating: false,
  isReverse: false,
  nVariation: false,
  crossModal: false,
  language: 'en',
  trialCount: 24,
  volume: 0.7,
  stimulusDuration: 2.0, // デフォルトは2秒
  sessionHistory: [],
  // 刺激の初期設定
  usePosition: true,
  useAudio: true,
  useColors: true,
  useShapes: true,
  setNValue: (value) => set((state) => {
    const defaultTrialCount = 20 + Math.pow(value, 2);
    return {
      nValue: value,
      trialCount: Math.min(Math.max(defaultTrialCount, 21), 120)
    };
  }),
  setIsStroop: (value) => set({ isStroop: value }),
  setIsRotating: (value) => set({ isRotating: value }),
  setIsReverse: (value) => set({ isReverse: value }),
  setNVariation: (value) => set({ nVariation: value }),
  setCrossModal: (value) => set({ crossModal: value }),
  setLanguage: (lang) => set({ language: lang }),
  setTrialCount: (count) => set({ trialCount: count }),
  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
  setStimulusDuration: (duration) => set({ 
    stimulusDuration: Math.max(1.5, Math.min(3.0, duration)) 
  }),
  addSession: (session) => set((state) => ({
    sessionHistory: [session, ...state.sessionHistory]
  })),
  // 刺激の設定を変更する関数
  setUsePosition: (value) => set({ usePosition: value }),
  setUseAudio: (value) => set({ useAudio: value }),
  setUseColors: (value) => set({ useColors: value }),
  setUseShapes: (value) => set({ useShapes: value }),
}));