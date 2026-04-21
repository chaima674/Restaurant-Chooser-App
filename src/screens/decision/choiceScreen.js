import React, { useState } from 'react';
import { View, Text, FlatList, Modal, ScrollView, TouchableOpacity, Alert } from 'react-native';

const CustomButton = ({ text, onPress, width = "94%", disabled = false }) => (
  <TouchableOpacity 
    style={{ 
      backgroundColor: disabled ? '#ccc' : '#007AFF', 
      padding: 15, 
      borderRadius: 8, 
      width: width, 
      alignItems: 'center', 
      marginVertical: 10 
    }}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{text}</Text>
  </TouchableOpacity>
);

export default function ChoiceScreen({ navigation, route }) {
  const { participants, restaurants } = route.params;
  const [currentParticipants, setCurrentParticipants] = useState(participants);
  const [currentRestaurants, setCurrentRestaurants] = useState(restaurants);
  const [selectedVisible, setSelectedVisible] = useState(false);
  const [vetoVisible, setVetoVisible] = useState(false);
  const [chosenRestaurant, setChosenRestaurant] = useState(null);
  const [vetoDisabled, setVetoDisabled] = useState(false);

  const getRandom = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const selectRandomRestaurant = () => {
    if (currentRestaurants.length === 0) {
      Alert.alert('No restaurants left!', 'Everyone has vetoed all restaurants.', [
        { text: 'OK', onPress: () => navigation.navigate('DecisionTimeScreen') }
      ]);
      return;
    }
    
    const randomIndex = getRandom(0, currentRestaurants.length - 1);
    setChosenRestaurant(currentRestaurants[randomIndex]);
    setSelectedVisible(true);
    
    // Check if anyone can still veto
    const stillCanVeto = currentParticipants.some(p => p.vetoed === "no");
    setVetoDisabled(!stillCanVeto);
  };

  const handleAccept = () => {
    setSelectedVisible(false);
    navigation.navigate('PostChoiceScreen', { chosenRestaurant: chosenRestaurant });
  };

  const handleVetoPress = () => {
    setSelectedVisible(false);
    setVetoVisible(true);
  };

  const handleVetoBy = (person) => {
    // Update participant's veto status
    const updatedParticipants = currentParticipants.map(p =>
      p.key === person.key ? { ...p, vetoed: "yes" } : p
    );
    setCurrentParticipants(updatedParticipants);
    
    // Remove the vetoed restaurant
    const updatedRestaurants = currentRestaurants.filter(
      r => !!r && r.key !== chosenRestaurant.key
    );
    setCurrentRestaurants(updatedRestaurants);
    
    setVetoVisible(false);
    
    // Check if any restaurants left
    if (updatedRestaurants.length === 0) {
      Alert.alert('No restaurants left!', 'Everyone has vetoed all restaurants.', [
        { text: 'OK', onPress: () => navigation.navigate('DecisionTimeScreen') }
      ]);
      return;
    }
    
    // Check if anyone can still veto
    const stillCanVeto = updatedParticipants.some(p => p.vetoed === "no");
    
    if (!stillCanVeto && updatedRestaurants.length === 1) {
      // Automatically go to final screen if only one restaurant left and no vetoes left
      setChosenRestaurant(updatedRestaurants[0]);
      setSelectedVisible(true);
      setVetoDisabled(true);
    } else if (!stillCanVeto) {
      setVetoDisabled(true);
      // Pick again automatically
      const randomIndex = getRandom(0, updatedRestaurants.length - 1);
      setChosenRestaurant(updatedRestaurants[randomIndex]);
      setSelectedVisible(true);
    } else {
      // Pick again automatically
      const randomIndex = getRandom(0, updatedRestaurants.length - 1);
      setChosenRestaurant(updatedRestaurants[randomIndex]);
      setSelectedVisible(true);
    }
  };

  const renderParticipant = ({ item }) => (
    <View style={styles.choiceScreenListItem}>
      <Text style={styles.choiceScreenListItemName}>
        {item.firstName} {item.lastName} ({item.relationship})
      </Text>
      <Text>Vetoed: {item.vetoed || "no"}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>It's Decision Time!</Text>
      
      <FlatList
        style={styles.choiceScreenListContainer}
        data={currentParticipants.filter(x => !!x)}
        keyExtractor={(item) => item?.key || Math.random().toString()}
        renderItem={renderParticipant}
      />
      
      <CustomButton 
        text="Randomly Choose" 
        onPress={selectRandomRestaurant} 
      />
      
      {/* Modal showing chosen restaurant */}
      <Modal
        visible={selectedVisible}
        animationType="slide"
        transparent={false}
      >
        {chosenRestaurant ? (
          <View style={styles.selectedContainer}>
            <View style={styles.selectedInnerContainer}>
              <Text style={styles.selectedName}>{chosenRestaurant?.name}</Text>
              <View style={styles.selectedDetails}>
                <Text style={styles.selectedDetailsLine}>
                  This is a {"★".repeat(chosenRestaurant?.rating || 0)} star restaurant
                </Text>
                <Text style={styles.selectedDetailsLine}>
                  {chosenRestaurant?.cuisine} restaurant
                </Text>
                <Text style={styles.selectedDetailsLine}>
                  with a price rating of {"$".repeat(chosenRestaurant?.price || 0)}
                </Text>
                <Text style={styles.selectedDetailsLine}>
                  that {chosenRestaurant?.delivery ? "DOES" : "DOES NOT"} deliver
                </Text>
              </View>
              <CustomButton text="Accept" onPress={handleAccept} />
              <CustomButton 
                text="Veto" 
                onPress={handleVetoPress} 
                disabled={vetoDisabled}
              />
            </View>
          </View>
        ) : (
          <View style={styles.selectedContainer}>
            <Text>No restaurant selected.</Text>
          </View>
        )}
      </Modal>
      
      {/* Modal for veto selection */}
      <Modal
        visible={vetoVisible}
        animationType="slide"
        transparent={false}
      >
        <View style={styles.vetoContainer}>
          <View style={styles.vetoContainerInner}>
            <Text style={styles.vetoHeadline}>Who is vetoing?</Text>
            <ScrollView style={styles.vetoScrollViewContainer}>
              {currentParticipants
                .filter((p) => p.vetoed === "no")
                .map((p) => (
                  <TouchableOpacity
                    key={p.key}
                    style={styles.vetoParticipantContainer}
                    onPress={() => handleVetoBy(p)}
                  >
                    <Text style={styles.vetoParticipantName}>
                      {p.firstName} {p.lastName}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
            <View style={styles.vetoButtonContainer}>
              <CustomButton
                text="Never Mind"
                onPress={() => {
                  setVetoVisible(false);
                  setSelectedVisible(true);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headline: {
    fontSize: 30,
  },
  choiceScreenListContainer: {
    width: '94%',
    flex: 1,
  },
  choiceScreenListItem: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 4,
    borderBottomWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    paddingVertical: 8,
  },
  choiceScreenListItemName: {
    flex: 1,
    fontSize: 16,
  },
  selectedContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  selectedInnerContainer: {
    alignItems: 'center',
  },
  selectedName: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selectedDetails: {
    paddingTop: 80,
    paddingBottom: 80,
    alignItems: 'center',
  },
  selectedDetailsLine: {
    fontSize: 18,
    marginVertical: 5,
  },
  vetoContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  vetoContainerInner: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  vetoHeadline: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  vetoScrollViewContainer: {
    height: '50%',
    width: '100%',
  },
  vetoParticipantContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  vetoParticipantName: {
    fontSize: 24,
  },
  vetoButtonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 40,
  },
};