import { StyleSheet, Text, View } from 'react-native';

export default function DecisionScreenNavigation() {
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>
        Decision Screen - Placeholder
      </Text>
      <Text style={styles.subText}>
        This will be implemented in Part 2
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});