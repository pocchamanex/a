import { View, Text, StyleSheet, Switch, Pressable, ScrollView } from 'react-native';
import { useGameStore } from '@/store/gameStore';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '@/utils/i18n';
import { useState, useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

type Mode = 'normal' | 'stroop';

export default function SettingsScreen() {
  const {
    nValue,
    setNValue,
    isStroop,
    setIsStroop,
    isRotating,
    setIsRotating,
    isReverse,
    setIsReverse,
    nVariation,
    setNVariation,
    crossModal,
    setCrossModal,
    language,
    setLanguage,
    trialCount,
    setTrialCount,
    volume,
    setVolume: setStoreVolume,
    stimulusDuration,
    setStimulusDuration,
    // 刺激の設定を追加
    usePosition,
    setUsePosition,
    useAudio,
    setUseAudio,
    useColors,
    setUseColors,
    useShapes,
    setUseShapes,
  } = useGameStore();

  const [selectedMode, setSelectedMode] = useState<Mode>('normal');
  const sliderPosition = useSharedValue(0);
  const volumePosition = useSharedValue(volume * 100);
  const durationPosition = useSharedValue((stimulusDuration - 1.5) * (100 / 1.5)); // 1.5秒から3秒の範囲を0-100にマッピング

  useEffect(() => {
    sliderPosition.value = calculateSliderPosition(trialCount);
    volumePosition.value = volume * 100;
    durationPosition.value = (stimulusDuration - 1.5) * (100 / 1.5);
  }, []);

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(sliderPosition.value * 2) }],
  }));

  const volumeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(volumePosition.value * 2) }],
  }));

  const durationStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(durationPosition.value * 2) }],
  }));

  const calculateSliderPosition = (count: number) => {
    return ((count - 21) / (120 - 21)) * 100;
  };

  const handleSliderMove = (event: any) => {
    const { locationX } = event.nativeEvent;
    const containerWidth = 200;
    const percentage = Math.max(0, Math.min(100, (locationX / containerWidth) * 100));
    sliderPosition.value = percentage;
    
    const newTrialCount = Math.round(21 + (percentage / 100) * (120 - 21));
    setTrialCount(newTrialCount);
  };

  const handleVolumeMove = (event: any) => {
    const { locationX } = event.nativeEvent;
    const containerWidth = 200;
    const percentage = Math.max(0, Math.min(100, (locationX / containerWidth) * 100));
    volumePosition.value = percentage;
    
    const newVolume = percentage / 100;
    setStoreVolume(newVolume);
  };

  const handleDurationMove = (event: any) => {
    const { locationX } = event.nativeEvent;
    const containerWidth = 200;
    const percentage = Math.max(0, Math.min(100, (locationX / containerWidth) * 100));
    durationPosition.value = percentage;
    
    // 1.5秒から3秒の範囲にマッピング（0.1秒刻み）
    const newDuration = Math.round((1.5 + (percentage / 100) * 1.5) * 10) / 10;
    setStimulusDuration(newDuration);
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2a2a2a']}
        style={styles.background}
      />
      
      <Text style={styles.title}>{useTranslation('settings', language)}</Text>

      {/* Language Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{useTranslation('language', language)}</Text>
        <View style={styles.languageContainer}>
          <Pressable
            style={[
              styles.languageButton,
              language === 'en' && styles.languageButtonActive
            ]}
            onPress={() => setLanguage('en')}
          >
            <Text style={[
              styles.languageText,
              language === 'en' && styles.languageTextActive
            ]}>English</Text>
          </Pressable>
          <Pressable
            style={[
              styles.languageButton,
              language === 'ja' && styles.languageButtonActive
            ]}
            onPress={() => setLanguage('ja')}
          >
            <Text style={[
              styles.languageText,
              language === 'ja' && styles.languageTextActive
            ]}>日本語</Text>
          </Pressable>
        </View>
      </View>

      {/* Mode Selection Tabs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{useTranslation('gameMode', language)}</Text>
        <View style={styles.modeTabs}>
          <Pressable
            style={[
              styles.modeTab,
              selectedMode === 'normal' && styles.modeTabActive
            ]}
            onPress={() => {
              setSelectedMode('normal');
              setIsStroop(false);
            }}
          >
            <Text style={[
              styles.modeTabText,
              selectedMode === 'normal' && styles.modeTabTextActive
            ]}>{useTranslation('normalMode', language)}</Text>
          </Pressable>
          <Pressable
            style={[
              styles.modeTab,
              selectedMode === 'stroop' && styles.modeTabActive
            ]}
            onPress={() => {
              setSelectedMode('stroop');
              setIsStroop(true);
            }}
          >
            <Text style={[
              styles.modeTabText,
              selectedMode === 'stroop' && styles.modeTabTextActive
            ]}>{useTranslation('stroopMode', language)}</Text>
          </Pressable>
        </View>
      </View>

      {/* Stimuli Settings for Normal Mode */}
      {selectedMode === 'normal' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{useTranslation('stimuliSettings', language)}</Text>
          
          <View style={styles.setting}>
            <Text style={styles.settingText}>{useTranslation('usePosition', language)}</Text>
            <Switch
              value={usePosition}
              onValueChange={setUsePosition}
              trackColor={{ false: '#333', true: '#00ff00' }}
              thumbColor={usePosition ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.setting}>
            <Text style={styles.settingText}>{useTranslation('useAudio', language)}</Text>
            <Switch
              value={useAudio}
              onValueChange={setUseAudio}
              trackColor={{ false: '#333', true: '#00ff00' }}
              thumbColor={useAudio ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.setting}>
            <Text style={styles.settingText}>{useTranslation('useColors', language)}</Text>
            <Switch
              value={useColors}
              onValueChange={setUseColors}
              trackColor={{ false: '#333', true: '#00ff00' }}
              thumbColor={useColors ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.setting}>
            <Text style={styles.settingText}>{useTranslation('useShapes', language)}</Text>
            <Switch
              value={useShapes}
              onValueChange={setUseShapes}
              trackColor={{ false: '#333', true: '#00ff00' }}
              thumbColor={useShapes ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>
      )}

      {/* N-Back Value */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>N-Back {useTranslation('value', language)}</Text>
        <View style={styles.nValueControls}>
          <Pressable
            style={styles.nButton}
            onPress={() => nValue > 1 && setNValue(nValue - 1)}
          >
            <Text style={styles.nButtonText}>-</Text>
          </Pressable>
          <Text style={styles.nValue}>{nValue}</Text>
          <Pressable
            style={styles.nButton}
            onPress={() => nValue < 5 && setNValue(nValue + 1)}
          >
            <Text style={styles.nButtonText}>+</Text>
          </Pressable>
        </View>
      </View>

      {/* Stimulus Duration */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{useTranslation('stimulusDuration', language)}</Text>
        <View style={styles.durationContainer}>
          <Text style={styles.durationValue}>{stimulusDuration.toFixed(1)}s</Text>
          <View style={styles.sliderContainer}>
            <View 
              style={styles.sliderTrack}
              onTouchStart={handleDurationMove}
              onTouchMove={handleDurationMove}
            >
              <Animated.View style={[styles.sliderThumb, durationStyle]} />
            </View>
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>1.5s</Text>
              <Text style={styles.sliderLabel}>3.0s</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Trial Count */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{useTranslation('trialCount', language)}</Text>
        <View style={styles.trialCountContainer}>
          <Text style={styles.trialCountValue}>{trialCount}</Text>
          <View style={styles.sliderContainer}>
            <View 
              style={styles.sliderTrack}
              onTouchStart={handleSliderMove}
              onTouchMove={handleSliderMove}
            >
              <Animated.View style={[styles.sliderThumb, sliderStyle]} />
            </View>
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>21</Text>
              <Text style={styles.sliderLabel}>120</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Volume Control */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Volume</Text>
        <View style={styles.volumeContainer}>
          <Text style={styles.volumeValue}>{Math.round(volume * 100)}%</Text>
          <View style={styles.sliderContainer}>
            <View 
              style={styles.sliderTrack}
              onTouchStart={handleVolumeMove}
              onTouchMove={handleVolumeMove}
            >
              <Animated.View style={[styles.sliderThumb, volumeStyle]} />
            </View>
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>0%</Text>
              <Text style={styles.sliderLabel}>100%</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Game Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{useTranslation('gameOptions', language)}</Text>
        
        <View style={styles.setting}>
          <Text style={styles.settingText}>{useTranslation('gridRotation', language)}</Text>
          <Switch
            value={isRotating}
            onValueChange={setIsRotating}
            trackColor={{ false: '#333', true: '#00ff00' }}
            thumbColor={isRotating ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.setting}>
          <Text style={styles.settingText}>{useTranslation('reverseMode', language)}</Text>
          <Switch
            value={isReverse}
            onValueChange={setIsReverse}
            trackColor={{ false: '#333', true: '#00ff00' }}
            thumbColor={isReverse ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.setting}>
          <Text style={styles.settingText}>{useTranslation('nVariation', language)}</Text>
          <Switch
            value={nVariation}
            onValueChange={setNVariation}
            trackColor={{ false: '#333', true: '#00ff00' }}
            thumbColor={nVariation ? '#fff' : '#f4f3f4'}
          />
        </View>

        {selectedMode === 'stroop' && (
          <View style={styles.setting}>
            <Text style={styles.settingText}>{useTranslation('crossModal', language)}</Text>
            <Switch
              value={crossModal}
              onValueChange={setCrossModal}
              trackColor={{ false: '#333', true: '#00ff00' }}
              thumbColor={crossModal ? '#fff' : '#f4f3f4'}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 60,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
    marginHorizontal: 20,
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 16,
  },
  sectionTitle: {
    color: '#00ff00',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
  },
  languageButton: {
    flex: 1,
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  languageButtonActive: {
    backgroundColor: '#00ff00',
  },
  languageText: {
    color: '#888',
    fontSize: 16,
    fontWeight: 'bold',
  },
  languageTextActive: {
    color: '#000',
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modeTabActive: {
    backgroundColor: '#00ff00',
  },
  modeTabText: {
    color: '#888',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modeTabTextActive: {
    color: '#000',
  },
  nValueControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nButton: {
    backgroundColor: '#00ff00',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nButtonText: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
  },
  nValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingText: {
    color: '#fff',
    fontSize: 16,
  },
  trialCountContainer: {
    alignItems: 'center',
  },
  trialCountValue: {
    color: '#00ff00',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sliderContainer: {
    width: 200,
    height: 40,
  },
  sliderTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginVertical: 10,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    backgroundColor: '#00ff00',
    borderRadius: 10,
    position: 'absolute',
    top: -8,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    color: '#888',
    fontSize: 12,
  },
  volumeContainer: {
    alignItems: 'center',
  },
  volumeValue: {
    color: '#00ff00',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  durationContainer: {
    alignItems: 'center',
  },
  durationValue: {
    color: '#00ff00',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});