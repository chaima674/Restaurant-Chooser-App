import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Navigation from './src/components/navigation';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Navigation />
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});