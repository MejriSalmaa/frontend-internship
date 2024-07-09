
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
 export const validateUsername = (username) => {
    const usernameRegex = /^[A-Za-z]+$/;
    return usernameRegex.test(username);
  };