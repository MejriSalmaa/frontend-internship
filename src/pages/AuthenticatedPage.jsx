import React, { useEffect, useState } from 'react';
import AuthenticatedHeader from '../layouts/AuthenticatedHeader';
import Calendar from '../components/Calendar/index';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { debounce } from 'lodash';

function AuthenticatedPage() {
  const [userProfile, setUserProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);

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
    fetchFilteredEvents(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    // This useEffect ensures Calendar updates when filteredEvents changes
    console.log('Filtered events updated:', filteredEvents);
  }, [filteredEvents]);

  const fetchFilteredEvents = debounce(async (query) => {
    try {
      const url = query.trim() === ''
        ? 'http://localhost:3000/events'
        : `http://localhost:3000/events/search?query=${query}`;
      
      console.log(`Fetching events with query: ${query}`);
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched events:', data);
        setFilteredEvents(data);
      } else {
        console.error('Failed to fetch filtered events');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  }, 300);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
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
      }}
    >
      {userProfile && <AuthenticatedHeader userProfile={userProfile} />}
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search Events"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by title, creator, category..."
        />
      </Box>
      <Calendar events={filteredEvents} />
    </div>
  );
}

export default AuthenticatedPage;
