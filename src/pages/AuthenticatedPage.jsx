import React, { useEffect, useState } from 'react';
import AuthenticatedHeader from '../layouts/AuthenticatedHeader';
import Calendar from '../components/Calendar/index';

function AuthenticatedPage() {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('access_token'); // Assuming the token is stored in localStorage
      try {
        const response = await fetch('http://localhost:3000/auth/profile', { // Ensure the correct URL
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Ensure the token is included in the request headers
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();
        console.log('Fetched user profile:', data);

        setUserProfile(data); // Update state with user profile data
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []); // Empty dependency array means this effect runs once on mount

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
      }}
    >
      {userProfile && <AuthenticatedHeader userProfile={userProfile} />}
      <Calendar />
    </div>
  );
}

export default AuthenticatedPage;
