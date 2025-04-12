import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '@/store/gameStore';
import { useTranslation } from '@/utils/i18n';
import { Brain, Play } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming,
  withSpring,
  useSharedValue
} from 'react-native-reanimated';

export default function MenuScreen() {
  const { language } = useGameStore();
  const router = useRouter();
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  // Continuous rotation animation
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 20000 }),
      -1,
      false
    );
    
    // Subtle pulse animation
    scale.value = withRepeat(
      withSequence(
        withSpring(1.1, { damping: 2 }),
        withSpring(1, { damping: 2 })
      ),
      -1,
      true
    );
  }, []);

  const brainStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value }
    ]
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2a2a2a']}
        style={styles.background}
      />
      
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=3456&auto=format&fit=crop' }}
        style={styles.backgroundImage}
        blurRadius={20}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Animated.View style={[styles.brainIconContainer, brainStyle]}>
            <Brain size={80} color="#00ff00" />
          </Animated.View>
          <Text style={styles.title}>N-Back</Text>
          <Text style={styles.subtitle}>Brain Overdrive</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.startButton}
            onPress={() => router.push('/game')}
          >
            <Play size={32} color="#000" />
            <Text style={styles.startButtonText}>
              {useTranslation('startGame', language)}
            </Text>
          </Pressable>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Current N</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Best Score</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
        </View>
      </View>
    </View>
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
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  brainIconContainer: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(0, 255, 0, 0.1)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#00ff00',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 4,
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  startButton: {
    backgroundColor: '#00ff00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '80%',
    maxWidth: 300,
    gap: 10,
  },
  startButtonText: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 100,
  },
  statValue: {
    color: '#00ff00',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});