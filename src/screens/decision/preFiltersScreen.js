import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, Platform, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom Button component
const CustomButton = ({ text, onPress, width = "94%" }) => (
  <TouchableOpacity 
    style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 8, width: width, alignItems: 'center', marginVertical: 10 }}
    onPress={onPress}
  >
    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{text}</Text>
  </TouchableOpacity>
);

export default function PreFiltersScreen({ navigation, route }) {
  const { participants } = route.params;
  const [cuisine, setCuisine] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState('');
  const [delivery, setDelivery] = useState('');

  const handleNext = async () => {
    try {
      const storedRestaurants = await AsyncStorage.getItem('restaurants');
      if (!storedRestaurants) {
        Alert.alert('Error', 'No restaurants found');
        return;
      }
      
      const parsedRestaurants = JSON.parse(storedRestaurants);
      
      const filteredRestaurants = parsedRestaurants.filter((restaurant) => {
        const matchesCuisine = !cuisine || restaurant.cuisine === cuisine;
        const matchesPrice = !price || Number(restaurant.price) <= Number(price);
        const matchesRating = !rating || Number(restaurant.rating) >= Number(rating);
        const matchesDelivery = !delivery || restaurant.delivery === (delivery === "Yes");
        
        return matchesCuisine && matchesPrice && matchesRating && matchesDelivery;
      });
      
      if (filteredRestaurants.length === 0) {
        Alert.alert(
          'No matches',
          'No restaurants match the selected criteria. Please adjust your filters.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      navigation.navigate('ChoiceScreen', { 
        participants: participants,
        restaurants: filteredRestaurants 
      });
      
    } catch (error) {
      console.error('Error filtering restaurants:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <ScrollView style={styles.preFiltersContainer}>
      <View style={styles.preFiltersInnerContainer}>
        <View style={styles.preFiltersScreenFormContainer}>
          <View style={styles.preFiltersHeadlineContainer}>
            <Text style={styles.preFiltersHeadline}>Pre-Filters</Text>
          </View>
          
          <Text style={styles.fieldLabel}>Cuisine</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={cuisine}
              onValueChange={(value) => setCuisine(value)}
              style={styles.picker}
            >
              <Picker.Item label="Any" value="" />
              <Picker.Item label="Italian" value="Italian" />
              <Picker.Item label="Chinese" value="Chinese" />
              <Picker.Item label="Indian" value="Indian" />
              <Picker.Item label="Mexican" value="Mexican" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
          
          <Text style={styles.fieldLabel}>Max Price</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={price}
              onValueChange={(value) => setPrice(value)}
              style={styles.picker}
            >
              <Picker.Item label="Any" value="" />
              <Picker.Item label="$" value="1" />
              <Picker.Item label="$$" value="2" />
              <Picker.Item label="$$$" value="3" />
              <Picker.Item label="$$$$" value="4" />
            </Picker>
          </View>
          
          <Text style={styles.fieldLabel}>Min Rating</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={rating}
              onValueChange={(value) => setRating(value)}
              style={styles.picker}
            >
              <Picker.Item label="Any" value="" />
              <Picker.Item label="1 Star" value="1" />
              <Picker.Item label="2 Stars" value="2" />
              <Picker.Item label="3 Stars" value="3" />
              <Picker.Item label="4 Stars" value="4" />
              <Picker.Item label="5 Stars" value="5" />
            </Picker>
          </View>
          
          <Text style={styles.fieldLabel}>Delivery</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={delivery}
              onValueChange={(value) => setDelivery(value)}
              style={styles.picker}
            >
              <Picker.Item label="Any" value="" />
              <Picker.Item label="Yes" value="Yes" />
              <Picker.Item label="No" value="No" />
            </Picker>
          </View>
          
          <CustomButton text="Next" onPress={handleNext} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = {
  preFiltersContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  preFiltersInnerContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    width: '100%',
  },
  preFiltersScreenFormContainer: {
    width: '96%',
  },
  preFiltersHeadlineContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  preFiltersHeadline: {
    fontSize: 30,
  },
  fieldLabel: {
    marginLeft: 10,
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
  },
  pickerContainer: {
    ...Platform.select({
      ios: {},
      android: {
        width: '96%',
        borderRadius: 8,
        borderColor: '#c0c0c0',
        borderWidth: 2,
        marginLeft: 10,
        marginBottom: 20,
        marginTop: 4,
      },
    }),
  },
  picker: {
    ...Platform.select({
      ios: {
        width: '96%',
        borderRadius: 8,
        borderColor: '#c0c0c0',
        borderWidth: 2,
        marginLeft: 10,
        marginBottom: 20,
        marginTop: 4,
      },
      android: {},
    }),
  },
};