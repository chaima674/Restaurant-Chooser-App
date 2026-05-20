import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../../components/customButton";

const ListScreen = ({ navigation }) => {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    fetchPeople();
    
    const unsubscribe = navigation.addListener("focus", () => {
      fetchPeople();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchPeople = async () => {
    try {
      const data = await AsyncStorage.getItem("people");
      if (data) {
        setPeople(JSON.parse(data));
      } else {
        setPeople([]);
      }
    } catch (error) {
      console.error("Error fetching people:", error);
    }
  };

  const deletePerson = (id) => {
    console.log("Delete person called with id:", id);
    
    if (window.confirm("Are you sure you want to delete this person?")) {
      console.log("User confirmed deletion");
      
      const updated = people.filter((p) => p.key !== id);
      console.log("Updated list:", updated);
      
      setPeople(updated);
      
      AsyncStorage.setItem("people", JSON.stringify(updated))
        .then(() => {
          console.log("Saved to storage");
        })
        .catch((error) => {
          console.error("Error saving:", error);
        });
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.personItem}>
      <Text style={styles.text}>{`${item.firstName} ${item.lastName}`}</Text>
      <CustomButton
        text="Delete"
        onPress={() => deletePerson(item.key)}
        buttonStyle={styles.deleteButton}
        width="80px"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomButton
        text="Add Person"
        onPress={() => navigation.navigate("PeopleAdd")}
        width="100%"
      />
      {people.length === 0 ? (
        <Text style={styles.emptyText}>No people yet. Add one!</Text>
      ) : (
        <FlatList
          data={people}
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
  personItem: {
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