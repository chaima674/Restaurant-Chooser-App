import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, BackHandler, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';

// Custom Button component
const CustomButton = ({ text, onPress, width = "94%" }) => (
  <TouchableOpacity 
    style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 8, width: width, alignItems: 'center', marginVertical: 10 }}
    onPress={onPress}
  >
    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{text}</Text>
  </TouchableOpacity>
);

export default function WhosGoingScreen({ navigation }) {
  const [people, setPeople] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    loadPeople();
    
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        'Are you sure?',
        'Do you want to go back?',
        [
          { text: 'No', style: 'cancel' },
          { text: 'Yes', onPress: () => navigation.goBack() }
        ]
      );
      return true;
    });
    
    return () => backHandler.remove();
  }, []);

  const loadPeople = async () => {
    try {
      const storedPeople = await AsyncStorage.getItem('people');
      if (storedPeople) {
        const parsedPeople = JSON.parse(storedPeople);
        setPeople(parsedPeople);
        setSelected(new Array(parsedPeople.length).fill(false));
      }
    } catch (error) {
      console.error('Error loading people:', error);
    }
  };

  const toggleSelection = (index) => {
    const updatedSelected = [...selected];
    updatedSelected[index] = !updatedSelected[index];
    setSelected(updatedSelected);
  };

  const handleNext = () => {
    const selectedParticipants = people
      .map((person, index) => 
        selected[index] ? { ...person, vetoed: "no" } : null
      )
      .filter(Boolean);
    
    if (selectedParticipants.length === 0) {
      Alert.alert('No one selected', 'Please select at least one person to continue.');
      return;
    }
    
    navigation.navigate('PreFiltersScreen', { participants: selectedParticipants });
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.listItem}>
      <Checkbox
        value={selected[index]}
        onValueChange={() => toggleSelection(index)}
        style={styles.checkbox}
      />
      <Text style={styles.personName}>
        {item.firstName} {item.lastName} ({item.relationship})
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>Who's Going?</Text>
      <FlatList
        data={people}
        keyExtractor={(item, index) => item.key || index.toString()}
        renderItem={renderItem}
        style={styles.list}
      />
      <CustomButton text="Next" onPress={handleNext} />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headline: {
    fontSize: 30,
    marginBottom: 20,
  },
  list: {
    width: '94%',
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  checkbox: {
    marginRight: 12,
  },
  personName: {
    fontSize: 16,
  },
};