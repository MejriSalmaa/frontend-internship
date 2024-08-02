import moment from 'moment';

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Username validation
export const validateUsername = (username) => {
  const usernameRegex = /^[A-Za-z]+$/; // Only allows alphabetic characters
  return username.trim() !== '' && usernameRegex.test(username);
};

// Title validation
export const validateTitle = (title) => {
  const titleRegex = /^[A-Za-z0-9\s.,!?'"/()&-]+$/; // Allow letters, numbers, spaces, and common symbols
  return titleRegex.test(title);
};

// Description validation
export const validateDescription = (description) => {
  const descriptionRegex = /^[A-Za-z0-9\s.,!?'"/()&-]+$/; // Allow letters, numbers, spaces, and common symbols
  return descriptionRegex.test(description);
};

// Location validation
export const validateLocation = (location) => {
  const locationRegex = /^[A-Za-z0-9\s]+$/; // Allow letters, numbers, and spaces
  return locationRegex.test(location);
};

// Date validation
export const validateDate = (date) => {
  const today = moment().startOf('day');
  return moment(date).isSameOrAfter(today);
};

// Start and end date validation
export const validateStartEndDate = (startDate, endDate) => {
  return moment(startDate).isBefore(moment(endDate));
};

// Participants validation
export const validateParticipants = (participants) => {
  if (typeof participants === 'string') {
    return participants.trim() !== '';
  } else if (Array.isArray(participants)) {
    return participants.length > 0 && participants.every(participant => typeof participant === 'string' && participant.trim() !== '');
  }
  return false;
};

// Category validation
export const validateCategory = (category) => {
  return category.trim() !== '';
};

// Password validation
export const validatePassword = (password) => {
  return password.trim() !== '' && password.length > 4;
};
