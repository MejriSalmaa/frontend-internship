import React, { useState } from 'react';
import Header from './Header'; 
import Footer from './Footer';
import SignIn from '../sign-in/signIn';
import SignUp from '../sign-up/signUp';

const LandingPage = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleSignInClick = () => {
    setShowSignIn(true);
    setShowSignUp(false);
  };

  const handleSignUpClick = () => {
    setShowSignUp(true);
    setShowSignIn(false);
  };

  return (
    <div       
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #3b82f680, white)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // Adjusted to space-between to distribute space
      }}>    
      <Header onSignInClick={handleSignInClick} onSignUpClick={handleSignUpClick} />
      <div style={{ 
        flexGrow: 1, // Allows this div to grow and fill available space
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // Centers its children vertically
        alignItems: 'center', // Centers its children horizontally
        width: '100%', // Takes the full width of the parent
      }}>
        {showSignIn && <SignIn />}
        {showSignUp && <SignUp />}
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;