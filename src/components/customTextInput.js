import React from "react";
import PropTypes from "prop-types";
import { View, Text, TextInput, StyleSheet } from "react-native";

const CustomTextInput = ({ 
  label, 
  labelStyle, 
  maxLength, 
  textInputStyle, 
  value,
  onChangeText,
  error,
  keyboardType = "default",
  autoCapitalize = "sentences"
}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          textInputStyle,
          error ? styles.inputError : null
        ]}
        maxLength={maxLength}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

CustomTextInput.propTypes = {
  label: PropTypes.string.isRequired,
  labelStyle: PropTypes.object,
  maxLength: PropTypes.number,
  textInputStyle: PropTypes.object,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  error: PropTypes.string,
  keyboardType: PropTypes.string,
  autoCapitalize: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    width: "100%",
  },
  label: {
    marginLeft: 10,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#c0c0c0",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginLeft: 10,
    marginTop: 5,
    fontSize: 14,
  },
});

export default CustomTextInput;