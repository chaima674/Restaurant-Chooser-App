import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../../components/customButton";

const ListScreen = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetchRestaurants();
    
    const unsubscribe = navigation.addListener("focus", () => {
      fetchRestaurants();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchRestaurants = async () => {
    try {
      const data = await AsyncStorage.getItem("restaurants");
      if (data) {
        setRestaurants(JSON.parse(data));
      } else {
        setRestaurants([]);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  const deleteRestaurant = (id) => {
    console.log("Delete function called with id:", id);
    
    // Use browser confirm for web
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      console.log("User confirmed deletion");
      
      // Filter out the restaurant
      const updated = restaurants.filter((r) => r.key !== id);
      console.log("Updated list:", updated);
      
      // Update state
      setRestaurants(updated);
      
      // Save to AsyncStorage
      AsyncStorage.setItem("restaurants", JSON.stringify(updated))
        .then(() => {
          console.log("Saved to storage");
        })
        .catch((error) => {
          console.error("Error saving:", error);
        });
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.restaurantItem}>
      <Text style={styles.text}>{item.name}</Text>
      <CustomButton
        text="Delete"
        onPress={() => deleteRestaurant(item.key)}
        buttonStyle={styles.deleteButton}
        width="80px"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomButton
        text="Add Restaurant"
        onPress={() => navigation.navigate("RestaurantsAdd")}
        width="100%"
      />
      {restaurants.length === 0 ? (
        <Text style={styles.emptyText}>No restaurants yet. Add one!</Text>
      ) : (
        <FlatList
          data={restaurants}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  listContent: {
    marginTop: 10,
  },
  restaurantItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  text: {
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
    color: "#666",
  },
});

export default ListScreen;