export const validateFirstName = (firstName) => {
  if (!firstName || !firstName.trim()) {
    return "First name is required";
  }
  if (firstName.trim().length < 2) {
    return "First name must be at least 2 characters";
  }
  if (!/^[a-zA-Z\s'-]*$/.test(firstName)) {
    return "First name can only contain letters, spaces, apostrophes, and dashes";
  }
  return null;
};

export const validateLastName = (lastName) => {
  if (!lastName || !lastName.trim()) {
    return "Last name is required";
  }
  if (lastName.trim().length < 2) {
    return "Last name must be at least 2 characters";
  }
  if (!/^[a-zA-Z\s'-]*$/.test(lastName)) {
    return "Last name can only contain letters, spaces, apostrophes, and dashes";
  }
  return null;
};