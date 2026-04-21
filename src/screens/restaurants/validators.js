export const validateName = (name) => {
  if (!name || !name.trim()) {
    return "Restaurant name is required";
  }
  if (name.trim().length < 2) {
    return "Restaurant name must be at least 2 characters";
  }
  if (!/^[a-zA-Z0-9\s,'-]*$/.test(name)) {
    return "Restaurant name can only contain letters, numbers, spaces, commas, apostrophes, and dashes";
  }
  return null;
};

export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) {
    return "Phone number is required";
  }
  const phoneRegex = /^[\d\s\-()+]{10,}$/;
  if (!phoneRegex.test(phone)) {
    return "Please enter a valid phone number (at least 10 digits)";
  }
  return null;
};

export const validateAddress = (address) => {
  if (!address || !address.trim()) {
    return "Address is required";
  }
  if (address.trim().length < 5) {
    return "Please enter a complete address";
  }
  return null;
};

export const validateWebsite = (website) => {
  if (!website || !website.trim()) {
    return "Website is required";
  }
  const websiteRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  if (!websiteRegex.test(website)) {
    return "Please enter a valid website URL";
  }
  return null;
};