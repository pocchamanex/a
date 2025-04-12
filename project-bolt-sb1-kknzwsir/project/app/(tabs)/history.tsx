import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '@/store/gameStore';

export default function HistoryScreen() {
  const { sessionHistory } = useGameStore();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2a2a2a']}
        style={styles.background}
      />
      
      <Text style={styles.title}>Training History</Text>

      <ScrollView style={styles.scrollView}>
        {sessionHistory.map((session, index) => (
          <View key={index} style={styles.sessionCard}>
            <Text style={styles.sessionDate}>
              {new Date(session.date).toLocaleDateString()}
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Score</Text>
                <Text style={styles.statValue}>{session.score}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>N-Value</Text>
                <Text style={styles.statValue}>{session.nValue}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Duration</Text>
                <Text style={styles.statValue}>{session.duration}m</Text>
              </View>
            </View>
            <View style={styles.modesContainer}>
              {session.isStroop && (
                <View style={styles.modeTag}>
                  <Text style={styles.modeText}>Stroop</Text>
                </View>
              )}
              {session.isRotating && (
                <View style={styles.modeTag}>
                  <Text style={styles.modeText}>Rotating</Text>
                </View>
              )}
              {session.isReverse && (
                <View style={styles.modeTag}>
                  <Text style={styles.modeText}>Reverse</Text>
                </View>
              )}
              {session.nVariation && (
                <View style={styles.modeTag}>
                  <Text style={styles.modeText}>N±1</Text>
                </View>
              )}
              {session.crossModal && (
                <View style={styles.modeTag}>
                  <Text style={styles.modeText}>Cross-Modal</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
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
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 60,
    marginLeft: 20,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  sessionCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
  },
  sessionDate: {
    color: '#00ff00',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#888',
    fontSize: 14,
    marginBottom: 5,
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modeTag: {
    backgroundColor: '#333',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  modeText: {
    color: '#00ff00',
    fontSize: 12,
  },
});