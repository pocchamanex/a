interface Translations {
  [key: string]: {
    en: string;
    ja: string;
  };
}

export const translations: Translations = {
  startGame: {
    en: 'Start Game',
    ja: 'ゲームスタート'
  },
  settings: {
    en: 'Settings',
    ja: '設定'
  },
  history: {
    en: 'History',
    ja: '成績'
  },
  language: {
    en: 'Language',
    ja: '言語'
  },
  gameMode: {
    en: 'Game Mode',
    ja: 'ゲームモード'
  },
  normalMode: {
    en: 'Normal',
    ja: 'ノーマル'
  },
  stroopMode: {
    en: 'Stroop',
    ja: 'ストループ'
  },
  value: {
    en: 'Value',
    ja: '値'
  },
  gameOptions: {
    en: 'Additional Features',
    ja: '追加要素設定'
  },
  score: {
    en: 'Score',
    ja: 'スコア'
  },
  nValue: {
    en: 'N-Value',
    ja: 'N値'
  },
  duration: {
    en: 'Duration',
    ja: '時間'
  },
  match: {
    en: 'Match',
    ja: '一致'
  },
  different: {
    en: 'Different',
    ja: '不一致'
  },
  stroopEffect: {
    en: 'Stroop Effect',
    ja: 'ストループ効果'
  },
  gridRotation: {
    en: 'Grid Rotation',
    ja: 'グリッド回転'
  },
  reverseMode: {
    en: 'Reversal trial',
    ja: '逆転試行'
  },
  nVariation: {
    en: 'N±1 Variation',
    ja: 'N±1変動'
  },
  crossModal: {
    en: 'Cross-Modal',
    ja: 'クロスモーダル'
  },
  trialCount: {
    en: 'Number of Trials',
    ja: '試行回数'
  },
  stimuliSettings: {
    en: 'Stimuli Settings',
    ja: '刺激設定'
  },
  usePosition: {
    en: 'Use Position',
    ja: '位置を使用'
  },
  useAudio: {
    en: 'Use Audio',
    ja: '音声を使用'
  },
  useColors: {
    en: 'Use Colors',
    ja: '色を使用'
  },
  useShapes: {
    en: 'Use Shapes',
    ja: '形を使用'
  },
  stimulusDuration: {
    en: 'Stimulus Duration',
    ja: '刺激表示時間'
  }
};

export const useTranslation = (key: string, lang: 'en' | 'ja'): string => {
  return translations[key]?.[lang] || key;
};