import moment from 'moment';

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
 export const validateUsername = (username) => {
    const usernameRegex = /^[A-Za-z]+$/;
    return usernameRegex.test(username);
  };

export const validateTitle = (title) => {
  const titleRegex = /^[A-Za-z\s]+$/;
  return titleRegex.test(title);
};

export const validateDescription = (description) => {
  const descriptionRegex = /^[A-Za-z0-9\s]+$/;
  return descriptionRegex.test(description);
};

export const validateLocation = (location) => {
  const locationRegex = /^[A-Za-z0-9\s]+$/;
  return locationRegex.test(location);
};

export const validateDate = (date) => {
  const today = moment().startOf('day');
  return moment(date).isSameOrAfter(today);
};

export const validateStartEndDate = (startDate, endDate) => {
  return moment(startDate).isBefore(moment(endDate));
};

export const validateParticipants = (participants) => {
  if (typeof participants === 'string') {
    return participants.trim() !== '';
  } else if (Array.isArray(participants)) {
    return participants.length > 0 && participants.every(participant => typeof participant === 'string' && participant.trim() !== '');
  }
  return false;
};

export const validateCategory = (category) => {
  return category.trim() !== '';
};