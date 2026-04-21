import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomTextInput from "../../components/customTextInput";
import CustomButton from "../../components/customButton";
import Toast from "react-native-toast-message";
import { validateFirstName, validateLastName } from "./validators";

const AddScreen = ({ navigation }) => {
  const [person, setPerson] = useState({
    firstName: "",
    lastName: "",
    relationship: "",
    key: `p_${new Date().getTime()}`,
    errors: {}
  });

  const setField = (field, value) => {
    setPerson(prev => ({
      ...prev,
      [field]: value,
      errors: { ...prev.errors, [field]: null }
    }));
  };

  const validateAllFields = () => {
    const errors = {
      firstName: validateFirstName(person.firstName),
      lastName: validateLastName(person.lastName),
      relationship: !person.relationship ? "Please select a relationship" : null,
    };

    setPerson(prev => ({ ...prev, errors }));
    
    // Return true if no errors
    return !Object.values(errors).some(error => error !== null);
  };

  const savePerson = async () => {
    const errors = {
      firstName: validateFirstName(person.firstName),
      lastName: validateLastName(person.lastName),
      relationship: !person.relationship ? "Please select a relationship" : null,
    };

    // Update state with errors
    setPerson(prev => ({ ...prev, errors }));

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
      // Get existing people
      const existingData = await AsyncStorage.getItem("people");
      let people = [];
      
      if (existingData) {
        people = JSON.parse(existingData);
      }
      
      // Add new person
      people.push(person);
      
      // Save back to storage
      await AsyncStorage.setItem("people", JSON.stringify(people));
      
      Toast.show({
        type: "success",
        text1: "Person saved successfully!",
        visibilityTime: 2000,
      });
      
      // Go back to list
      navigation.goBack();
      
    } catch (error) {
      console.error("Error saving person:", error);
      Alert.alert("Error", "Failed to save person");
    }
  };

  return (
    <ScrollView>
      <View style={styles.addScreenInnerContainer}>
        <View style={styles.addScreenFormContainer}>
          
          {/* First Name Input */}
          <CustomTextInput
            label="First Name"
            maxLength={50}
            value={person.firstName}
            onChangeText={(text) => setField("firstName", text)}
            error={person.errors.firstName}
          />

          {/* Last Name Input */}
          <CustomTextInput
            label="Last Name"
            maxLength={50}
            value={person.lastName}
            onChangeText={(text) => setField("lastName", text)}
            error={person.errors.lastName}
          />

          {/* Relationship Picker */}
          <Text style={styles.fieldLabel}>Relationship</Text>
          <View style={[styles.pickerContainer]}>
            <Picker
              selectedValue={person.relationship}
              onValueChange={(value) => setField("relationship", value)}
              style={[
                styles.picker,
                person.errors.relationship ? { borderColor: "red" } : {},
              ]}
            >
              <Picker.Item label="Select Relationship" value="" />
              <Picker.Item label="Me" value="Me" />
              <Picker.Item label="Family" value="Family" />
              <Picker.Item label="Friend" value="Friend" />
              <Picker.Item label="Coworker" value="Coworker" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
          {person.errors.relationship && (
            <Text style={styles.errorText}>{person.errors.relationship}</Text>
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
            onPress={savePerson}
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