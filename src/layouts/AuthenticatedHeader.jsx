import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close'; // Import Close icon
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import SearchIcon from '@mui/icons-material/Search'; // Import the magnifying glass icon
import InputAdornment from '@mui/material/InputAdornment';

const logoStyle = {
  width: '50px',
  height: '50px',
  cursor: 'pointer',
};

export default function AuthenticatedHeader({ userProfile, setFilteredEvents }) {
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const isProfileMenuOpen = Boolean(profileAnchorEl);
  const isNotificationsMenuOpen = Boolean(notificationsAnchorEl);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    fetchFilteredEvents(searchQuery);
  }, [searchQuery]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:3000/notifications?userEmail=' + encodeURIComponent(userProfile.email), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        const unreadResponse = await fetch('http://localhost:3000/notifications/unread-count?userEmail=' + encodeURIComponent(userProfile.email), {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        const unreadData = await unreadResponse.json();
        setUnreadCount(unreadData);
      } else {
        console.error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

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

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleNotificationsMenuOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setProfileAnchorEl(null);
    setNotificationsAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:3000/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      if (response.ok) {
        localStorage.removeItem('access_token');
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const handleNotificationClick = (notificationId) => {
    markAsRead(notificationId);
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:3000/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      if (response.ok) {
        fetchNotifications();
      } else {
        console.error('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const handleDeclineClick = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:3000/notifications/events/${eventId}/remove-participant`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ userEmail: userProfile.email }),
      });
      if (response.ok) {
        fetchNotifications();
      } else {
        console.error('Failed to decline participation');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const profileMenuId = 'primary-search-account-menu';
  const notificationsMenuId = 'primary-notifications-menu';

  const renderProfileMenu = (
    <Menu
      anchorEl={profileAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={profileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isProfileMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const renderNotificationsMenu = (
    <Menu
      anchorEl={notificationsAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={notificationsMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isNotificationsMenuOpen}
      onClose={handleMenuClose}
    >
      {notifications.map(notification => (
        <MenuItem key={notification._id} onClick={() => handleNotificationClick(notification._id)}>
          <Typography variant="body2">{notification.message}</Typography>
          <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
            {!notification.isRead && <IconButton size="small" onClick={() => handleNotificationClick(notification._id)}>✔️</IconButton>}
            <IconButton size="small" onClick={() => handleDeclineClick(notification.eventId)}><CloseIcon /></IconButton>
          </Box>
        </MenuItem>
      ))}
    </Menu>
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          boxShadow: 'none',
          backdropFilter: 'blur(50px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '15px',
          width: '80%',
          margin: 'auto',
          left: 0,
          right: 0,
          marginTop: '20px',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
            <img src='src/assets/logo.png' alt="logo" style={logoStyle} />
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              variant="outlined"
              placeholder="Search events"
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ 
                backgroundColor: 'transparent', 
                borderRadius: '10px',
                '& .MuiOutlinedInput-root': {
                  padding: '4px 8px', // Adjust padding to minimize height
                  fontSize: '0.875rem', // Adjust font size if needed
                },
              }}
              InputProps={{
                style: {
                  height: '40px', // Set a specific height if needed
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}            />
            <IconButton size="large" aria-label="show new notifications" color="inherit" onClick={handleNotificationsMenuOpen}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={profileMenuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {userProfile.picture ? (
                <img
                  src={`http://localhost:3000${userProfile.picture}`} // Ensure the URL is correct
                  alt="profile"
                  style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                />
              ) : (
                <AccountCircle />
              )}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderProfileMenu}
      {renderNotificationsMenu}
    </Box>
  );
}

AuthenticatedHeader.propTypes = {
  userProfile: PropTypes.shape({
    email: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    picture: PropTypes.string,
    role: PropTypes.string.isRequired,
  }).isRequired,
  setFilteredEvents: PropTypes.func.isRequired,
};
