import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomTextInput from "../../components/customTextInput";
import CustomButton from "../../components/customButton";
import Toast from "react-native-toast-message";
import { validateName, validatePhone, validateAddress, validateWebsite } from "./validators";

const AddScreen = ({ navigation }) => {
  const [restaurant, setRestaurant] = useState({
    name: "",
    cuisine: "",
    price: "",
    rating: "",
    phone: "",
    address: "",
    website: "",
    delivery: "",
    key: `r_${new Date().getTime()}`,
    errors: {}
  });

  const setField = (field, value) => {
    setRestaurant(prev => ({
      ...prev,
      [field]: value,
      errors: { ...prev.errors, [field]: null }
    }));
  };

  const validateAllFields = () => {
    const errors = {
      name: validateName(restaurant.name),
      phone: validatePhone(restaurant.phone),
      address: validateAddress(restaurant.address),
      website: validateWebsite(restaurant.website),
      cuisine: !restaurant.cuisine ? "Please select a cuisine" : null,
      price: !restaurant.price ? "Please select a price rating" : null,
      rating: !restaurant.rating ? "Please select a star rating" : null,
      delivery: !restaurant.delivery ? "Please select delivery option" : null,
    };

    setRestaurant(prev => ({ ...prev, errors }));
    
    // Return true if no errors
    return !Object.values(errors).some(error => error !== null);
  };

  const saveRestaurant = async () => {
    // First validate and get errors directly 
    const errors = {
      name: validateName(restaurant.name),
      phone: validatePhone(restaurant.phone),
      address: validateAddress(restaurant.address),
      website: validateWebsite(restaurant.website),
      cuisine: !restaurant.cuisine ? "Please select a cuisine" : null,
      price: !restaurant.price ? "Please select a price rating" : null,
      rating: !restaurant.rating ? "Please select a star rating" : null,
      delivery: !restaurant.delivery ? "Please select delivery option" : null,
    };

    // Update state with errors
    setRestaurant(prev => ({ ...prev, errors }));

    // Check if there are any errors
    const hasErrors = Object.values(errors).some(error => error !== null);
    
    if (hasErrors) {
      // Find first error and show it
      const firstError = Object.values(errors).find(e => e !== null);
      Toast.show({
        type: "error",
        text1: firstError,
        visibilityTime: 3000,
      });
      return;
    }

    try {
      // Get existing restaurants
      const existingData = await AsyncStorage.getItem("restaurants");
      let restaurants = [];
      
      if (existingData) {
        restaurants = JSON.parse(existingData);
      }
      
      // Add new restaurant
      restaurants.push(restaurant);
      
      // Save back to storage
      await AsyncStorage.setItem("restaurants", JSON.stringify(restaurants));
      
      Toast.show({
        type: "success",
        text1: "Restaurant saved successfully!",
        visibilityTime: 2000,
      });
      
      // Go back to list
      navigation.goBack();
      
    } catch (error) {
      console.error("Error saving restaurant:", error);
      Alert.alert("Error", "Failed to save restaurant");
    }
  };

  return (
    <ScrollView>
      <View style={styles.addScreenInnerContainer}>
        <View style={styles.addScreenFormContainer}>
          
          {/* Name Input */}
          <CustomTextInput
            label="Name"
            maxLength={50}
            value={restaurant.name}
            onChangeText={(text) => setField("name", text)}
            error={restaurant.errors.name}
          />

          {/* Cuisine Picker */}
          <Text style={styles.fieldLabel}>Cuisine</Text>
          <View style={[styles.pickerContainer]}>
            <Picker
              selectedValue={restaurant.cuisine}
              onValueChange={(value) => setField("cuisine", value)}
              style={[
                styles.picker,
                restaurant.errors.cuisine ? { borderColor: "red" } : {},
              ]}
            >
              <Picker.Item label="Select Cuisine" value="" />
              <Picker.Item label="American" value="American" />
              <Picker.Item label="Chinese" value="Chinese" />
              <Picker.Item label="Italian" value="Italian" />
              <Picker.Item label="Mexican" value="Mexican" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
          {restaurant.errors.cuisine && (
            <Text style={styles.errorText}>{restaurant.errors.cuisine}</Text>
          )}

          {/* Price Picker */}
          <Text style={styles.fieldLabel}>Price (1-5)</Text>
          <View style={[styles.pickerContainer]}>
            <Picker
              selectedValue={restaurant.price}
              onValueChange={(value) => setField("price", value)}
              style={[
                styles.picker,
                restaurant.errors.price ? { borderColor: "red" } : {},
              ]}
            >
              <Picker.Item label="Select Price" value="" />
              <Picker.Item label="1 - $" value="1" />
              <Picker.Item label="2 - $$" value="2" />
              <Picker.Item label="3 - $$$" value="3" />
              <Picker.Item label="4 - $$$$" value="4" />
              <Picker.Item label="5 - $$$$$" value="5" />
            </Picker>
          </View>
          {restaurant.errors.price && (
            <Text style={styles.errorText}>{restaurant.errors.price}</Text>
          )}

          {/* Rating Picker */}
          <Text style={styles.fieldLabel}>Rating (1-5 Stars)</Text>
          <View style={[styles.pickerContainer]}>
            <Picker
              selectedValue={restaurant.rating}
              onValueChange={(value) => setField("rating", value)}
              style={[
                styles.picker,
                restaurant.errors.rating ? { borderColor: "red" } : {},
              ]}
            >
              <Picker.Item label="Select Rating" value="" />
              <Picker.Item label="1 Star" value="1" />
              <Picker.Item label="2 Stars" value="2" />
              <Picker.Item label="3 Stars" value="3" />
              <Picker.Item label="4 Stars" value="4" />
              <Picker.Item label="5 Stars" value="5" />
            </Picker>
          </View>
          {restaurant.errors.rating && (
            <Text style={styles.errorText}>{restaurant.errors.rating}</Text>
          )}

          {/* Phone Input */}
          <CustomTextInput
            label="Phone"
            maxLength={20}
            value={restaurant.phone}
            onChangeText={(text) => setField("phone", text)}
            error={restaurant.errors.phone}
            keyboardType="phone-pad"
          />

          {/* Address Input */}
          <CustomTextInput
            label="Address"
            maxLength={50}
            value={restaurant.address}
            onChangeText={(text) => setField("address", text)}
            error={restaurant.errors.address}
          />

          {/* Website Input */}
          <CustomTextInput
            label="Website"
            maxLength={50}
            value={restaurant.website}
            onChangeText={(text) => setField("website", text)}
            error={restaurant.errors.website}
            keyboardType="url"
            autoCapitalize="none"
          />

          {/* Delivery Picker */}
          <Text style={styles.fieldLabel}>Delivery Available?</Text>
          <View style={[styles.pickerContainer]}>
            <Picker
              selectedValue={restaurant.delivery}
              onValueChange={(value) => setField("delivery", value)}
              style={[
                styles.picker,
                restaurant.errors.delivery ? { borderColor: "red" } : {},
              ]}
            >
              <Picker.Item label="Select Option" value="" />
              <Picker.Item label="Yes" value="Yes" />
              <Picker.Item label="No" value="No" />
            </Picker>
          </View>
          {restaurant.errors.delivery && (
            <Text style={styles.errorText}>{restaurant.errors.delivery}</Text>
          )}

        </View>

        {/* Buttons */}
        <View style={styles.addScreenButtonsContainer}>
          <CustomButton
            text="Cancel"
            onPress={() => navigation.goBack()}
            buttonStyle={styles.cancelButton}
          />
          <CustomButton
            text="Save"
            onPress={saveRestaurant}
            buttonStyle={styles.saveButton}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  addScreenInnerContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
    width: "100%",
  },
  addScreenFormContainer: { width: "96%" },
  fieldLabel: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "500",
    marginTop: 10,
  },
  pickerContainer: {
    width: "96%",
    borderRadius: 8,
    borderColor: "#c0c0c0",
    borderWidth: 2,
    marginLeft: 10,
    marginBottom: 5,
    marginTop: 4,
  },
  picker: {
    width: "100%",
  },
  errorText: {
    color: "red",
    marginLeft: 10,
    marginBottom: 10,
  },
  addScreenButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  cancelButton: { 
    backgroundColor: "gray", 
    width: "44%",
    marginRight: 10,
  },
  saveButton: { 
    backgroundColor: "green", 
    width: "44%",
    marginLeft: 10,
  },
});

export default AddScreen;