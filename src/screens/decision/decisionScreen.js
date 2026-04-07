// screens/decision/decisionScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DecisionTimeScreen({ navigation }) {
  const [people, setPeople] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    loadData();
    
    // Add focus listener to reload data when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    try {
      console.log('Loading data...');
      const storedPeople = await AsyncStorage.getItem('people');
      const storedRestaurants = await AsyncStorage.getItem('restaurants');
      
      console.log('Stored people:', storedPeople);
      console.log('Stored restaurants:', storedRestaurants);
      
      if (storedPeople) {
        const parsedPeople = JSON.parse(storedPeople);
        setPeople(parsedPeople);
        console.log('People loaded:', parsedPeople.length);
      }
      
      if (storedRestaurants) {
        const parsedRestaurants = JSON.parse(storedRestaurants);
        setRestaurants(parsedRestaurants);
        console.log('Restaurants loaded:', parsedRestaurants.length);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleStartDecision = () => {
    console.log('Button tapped!');
    console.log('People count:', people.length);
    console.log('Restaurants count:', restaurants.length);
    
    if (people.length === 0) {
      Alert.alert(
        "That ain't gonna work, chief",
        "You need to add some people first!\n\nGo to the People tab and add at least one person.",
        [
          { text: "OK" },
          { text: "Go to People", onPress: () => navigation.navigate('People') }
        ]
      );
      return;
    }
    
    if (restaurants.length === 0) {
      Alert.alert(
        "That ain't gonna work, chief", 
        "You need to add some restaurants first!\n\nGo to the Restaurants tab and add at least one restaurant.",
        [
          { text: "OK" },
          { text: "Go to Restaurants", onPress: () => navigation.navigate('Restaurants') }
        ]
      );
      return;
    }
    
    console.log('All good! Navigating to WhosGoingScreen...');
    navigation.navigate('WhosGoingScreen');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={handleStartDecision} 
        style={styles.button}
        activeOpacity={0.7}
      >
        <Text style={styles.emoji}>🍽️</Text>
        <Text style={styles.title}>Restaurant Chooser</Text>
        <Text style={styles.subtitle}>Tap to start deciding!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  button: {
    alignItems: 'center',
    padding: 20,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
};