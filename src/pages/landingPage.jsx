import React, { useState } from 'react';
import Header from '../layouts/Header'; 
import Footer from '../layouts/Footer';
import SignIn from '../components/SignIn/index';
import SignUp from '../components/SignUp/index';

const LandingPage = () => {
  const [showSignIn, setShowSignIn] = useState(true); // Default to show SignIn
  const [showSignUp, setShowSignUp] = useState(false);

  const handleSignInClick = () => {
    setShowSignIn(true);
    setShowSignUp(false);
  };

  const handleSignUpClick = () => {
    setShowSignUp(true);
    setShowSignIn(false);
  };

  const switchToSignUp = () => {
    setShowSignIn(false);
    setShowSignUp(true);
  };

  const switchToSignIn = () => {
    setShowSignIn(true);
    setShowSignUp(false);
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
        justifyContent: 'space-between',
      }}>    
      <Header onSignInClick={handleSignInClick} onSignUpClick={handleSignUpClick} />
      <div style={{ 
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
      }}>
        {showSignIn && <SignIn onSwitchToSignUp={switchToSignUp} />}
        {showSignUp && <SignUp onSwitchToSignIn={switchToSignIn} />}
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
