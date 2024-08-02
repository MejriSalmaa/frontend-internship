import React, { useEffect, useState } from 'react';
import AuthenticatedHeader from '../layouts/AuthenticatedHeader';
import Calendar from '../components/Calendar/index';
import ProfilePage from '../pages/ProfilePage';
import Box from '@mui/material/Box';

function AuthenticatedPage() {
  const [userProfile, setUserProfile] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentView, setCurrentView] = useState('calendar'); // State to manage the current view

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await fetch('http://localhost:3000/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();
        console.log('Fetched user profile:', data);

        setUserProfile(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    // This useEffect ensures Calendar updates when filteredEvents changes
    console.log('Filtered events updated:', filteredEvents);
  }, [filteredEvents]);

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
      {userProfile && <AuthenticatedHeader userProfile={userProfile} setFilteredEvents={setFilteredEvents} setCurrentView={setCurrentView} />}
      {currentView === 'calendar' ? <Calendar events={filteredEvents} /> : <ProfilePage />}
    </div>
  );
}

export default AuthenticatedPage;
