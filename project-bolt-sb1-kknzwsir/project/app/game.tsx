import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '@/store/gameStore';
import { useTranslation } from '@/utils/i18n';
import { X, Check, X as XIcon } from 'lucide-react-native';
import { useEffect, useState, useCallback } from 'react';
import { playAudioStimulus, type AudioStimulus } from '@/utils/audio';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
  withSequence,
  withTiming,
  withDelay
} from 'react-native-reanimated';

type Stimulus = {
  position?: number;
  color?: string;
  shape?: string;
  audio?: AudioStimulus;
};

export default function GameScreen() {
  const router = useRouter();
  const { 
    language,
    usePosition,
    useAudio,
    useColors,
    useShapes,
    nValue,
    trialCount,
    stimulusDuration,
    volume
  } = useGameStore();

  const [currentTrial, setCurrentTrial] = useState(0);
  const [score, setScore] = useState(0);
  const [stimulusHistory, setStimulusHistory] = useState<Stimulus[]>([]);
  const [currentStimulus, setCurrentStimulus] = useState<Stimulus | null>(null);
  const [isShowingStimulus, setIsShowingStimulus] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  // アニメーションスタイル
  const stimulusStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  // 刺激を生成する関数
  const generateStimulus = useCallback((): Stimulus => {
    const stimulus: Stimulus = {};
    const store = useGameStore.getState();

    if (usePosition) {
      stimulus.position = Math.floor(Math.random() * 9);
    }
    
    if (useColors && store.COLORS) {
      const colors = Object.values(store.COLORS);
      if (colors.length > 0) {
        stimulus.color = colors[Math.floor(Math.random() * colors.length)];
      }
    }
    
    if (useShapes && store.SHAPES) {
      const shapes = Object.values(store.SHAPES);
      if (shapes.length > 0) {
        stimulus.shape = shapes[Math.floor(Math.random() * shapes.length)];
      }
    }
    
    if (useAudio) {
      const audioStimuli: AudioStimulus[] = ['A', 'B', 'C', 'F', 'H', 'I', 'M', 'O', 'T'];
      stimulus.audio = audioStimuli[Math.floor(Math.random() * audioStimuli.length)];
    }

    return stimulus;
  }, [usePosition, useColors, useShapes, useAudio]);

  // 刺激が一致しているかチェックする関数
  const checkMatch = useCallback((current: Stimulus, previous: Stimulus): boolean => {
    if (!current || !previous) return false;

    if (usePosition && current.position !== previous.position) return false;
    if (useColors && current.color !== previous.color) return false;
    if (useShapes && current.shape !== previous.shape) return false;
    if (useAudio && current.audio !== previous.audio) return false;

    return true;
  }, [usePosition, useColors, useShapes, useAudio]);

  // 回答を処理する関数
  const handleResponse = useCallback((isMatch: boolean) => {
    if (!gameStarted || currentTrial < nValue) return;

    const previousStimulus = stimulusHistory[stimulusHistory.length - nValue - 1];
    const isCorrect = isMatch === checkMatch(currentStimulus!, previousStimulus);

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setScore(prev => isCorrect ? prev + 1 : prev);

    // フィードバックを一定時間後に消す
    setTimeout(() => setFeedback(null), 500);
  }, [gameStarted, currentTrial, nValue, stimulusHistory, currentStimulus, checkMatch]);

  // ゲームを開始する
  useEffect(() => {
    if (!gameStarted) {
      setGameStarted(true);
      setCurrentTrial(0);
      setScore(0);
      setStimulusHistory([]);
      presentNextStimulus();
    }
  }, []);

  // 次の刺激を提示する
  const presentNextStimulus = useCallback(() => {
    if (currentTrial >= trialCount) {
      // ゲーム終了
      router.back();
      return;
    }

    const newStimulus = generateStimulus();
    setCurrentStimulus(newStimulus);
    setStimulusHistory(prev => [...prev, newStimulus]);
    setCurrentTrial(prev => prev + 1);
    setIsShowingStimulus(true);

    // アニメーション
    opacity.value = withTiming(1, { duration: 200 });
    scale.value = withSequence(
      withSpring(1.1),
      withSpring(1)
    );

    // 音声刺激を再生
    if (useAudio && newStimulus.audio) {
      playAudioStimulus(newStimulus.audio);
    }

    // 刺激を非表示にする
    setTimeout(() => {
      opacity.value = withTiming(0, { duration: 200 });
      setIsShowingStimulus(false);
      
      // 次の刺激までの間隔
      setTimeout(presentNextStimulus, 800);
    }, stimulusDuration * 1000);
  }, [currentTrial, trialCount, generateStimulus, stimulusDuration]);

  // 刺激を表示するセルをレンダリング
  const renderCell = (index: number) => {
    const isActive = isShowingStimulus && currentStimulus?.position === index;
    
    return (
      <Animated.View 
        key={index}
        style={[
          styles.cell,
          isActive && stimulusStyle
        ]}
      >
        {isActive && (
          <View style={[
            styles.stimulus,
            currentStimulus.color && { backgroundColor: currentStimulus.color }
          ]}>
            {currentStimulus.shape && (
              <Text style={styles.shape}>{currentStimulus.shape}</Text>
            )}
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable 
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <X size={24} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.headerCenter}>
          <View style={styles.nValueContainer}>
            <Text style={styles.nValueText}>{nValue}-back</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Score</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>
          <View style={styles.trialContainer}>
            <Text style={styles.trialLabel}>Trial</Text>
            <Text style={styles.trialValue}>{currentTrial}/{trialCount}</Text>
          </View>
        </View>
      </View>

      {/* Game Grid */}
      <View style={styles.gridContainer}>
        {[...Array(9)].map((_, index) => renderCell(index))}
      </View>

      {/* Response Buttons */}
      <View style={styles.buttonContainer}>
        <Pressable 
          style={[styles.responseButton, styles.matchButton]}
          onPress={() => handleResponse(true)}
        >
          <Check size={32} color="#000" />
          <Text style={styles.buttonText}>
            {useTranslation('match', language)}
          </Text>
        </Pressable>
        <Pressable 
          style={[styles.responseButton, styles.differentButton]}
          onPress={() => handleResponse(false)}
        >
          <XIcon size={32} color="#000" />
          <Text style={styles.buttonText}>
            {useTranslation('different', language)}
          </Text>
        </Pressable>
      </View>

      {/* Feedback */}
      {feedback && (
        <View style={[
          styles.feedback,
          feedback === 'correct' ? styles.correctFeedback : styles.incorrectFeedback
        ]}>
          <Text style={styles.feedbackText}>
            {feedback === 'correct' ? '✓' : '✗'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nValueContainer: {
    backgroundColor: '#00ff00',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  nValueText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreLabel: {
    color: '#888',
    fontSize: 14,
    marginBottom: 4,
  },
  scoreValue: {
    color: '#00ff00',
    fontSize: 24,
    fontWeight: 'bold',
  },
  trialContainer: {
    alignItems: 'center',
  },
  trialLabel: {
    color: '#888',
    fontSize: 14,
    marginBottom: 4,
  },
  trialValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 40,
  },
  cell: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stimulus: {
    width: '80%',
    height: '80%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shape: {
    fontSize: 36,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    paddingHorizontal: 20,
  },
  responseButton: {
    flex: 1,
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  matchButton: {
    backgroundColor: '#00ff00',
  },
  differentButton: {
    backgroundColor: '#ff3b30',
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  feedback: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -40 }, { translateY: -40 }],
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  correctFeedback: {
    borderColor: '#00ff00',
    borderWidth: 2,
  },
  incorrectFeedback: {
    borderColor: '#ff3b30',
    borderWidth: 2,
  },
  feedbackText: {
    fontSize: 40,
    color: '#fff',
  },
});