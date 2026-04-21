import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

const CustomButton = ({ text, onPress, width = "94%" }) => (
  <TouchableOpacity 
    style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 8, width: width, alignItems: 'center', marginVertical: 10 }}
    onPress={onPress}
  >
    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{text}</Text>
  </TouchableOpacity>
);

export default function PostChoiceScreen({ navigation, route }) {
  const { chosenRestaurant } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.headline}>Enjoy your meal! 🍽️</Text>
        
        <View style={styles.detailsBox}>
          <Text style={styles.restaurantName}>{chosenRestaurant.name}</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Cuisine:</Text>
            <Text style={styles.detailValue}>{chosenRestaurant.cuisine}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Price:</Text>
            <Text style={styles.detailValue}>{"$".repeat(chosenRestaurant.price || 0)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Rating:</Text>
            <Text style={styles.detailValue}>{"★".repeat(chosenRestaurant.rating || 0)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone:</Text>
            <Text style={styles.detailValue}>{chosenRestaurant.phone || "N/A"}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address:</Text>
            <Text style={styles.detailValue}>{chosenRestaurant.address || "N/A"}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Website:</Text>
            <Text style={styles.detailValue}>{chosenRestaurant.website || "N/A"}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Delivery:</Text>
            <Text style={styles.detailValue}>{chosenRestaurant.delivery ? "Yes" : "No"}</Text>
          </View>
        </View>
        
        <CustomButton 
          text="All Done" 
          onPress={() => navigation.navigate('DecisionTimeScreen')}
        />
      </View>
    </ScrollView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  headline: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  detailsBox: {
    width: '90%',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#007AFF',
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 100,
    color: '#555',
  },
  detailValue: {
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
};