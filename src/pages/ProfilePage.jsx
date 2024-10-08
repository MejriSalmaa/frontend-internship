import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { TextField, Avatar, Grid, Paper, Typography, Button, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validateUsername, validatePassword } from '../utils/validation'; // Import validation functions

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [file, setFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  const [errors, setErrors] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const fileInputRef = useRef();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:3000/users/profile/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
      setUsername(response.data.username);
      setAvatarPreview(response.data.picture ? `${'http://localhost:3000'}${response.data.picture}` : '/default-profile.png');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    const newErrors = {
      username: '',
      password: '',
      confirmPassword: '',
    };

    // Validate username and password
    if (!validateUsername(username)) {
      newErrors.username = 'Invalid username. It should only contain alphabetic characters.';
    }

    if (password && !validatePassword(password)) {
      newErrors.password = 'Password must be at least 5 characters long.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (newErrors.username || newErrors.password || newErrors.confirmPassword) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append('username', username);

    if (password) {
      formData.append('password', password);
    }

    if (file) {
      formData.append('profilePicture', file);
    }

    try {
      const token = localStorage.getItem('access_token');
      await axios.put('http://localhost:3000/users/profile/update', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });

      setProfile({ ...profile, username });
      setErrors({ username: '', password: '', confirmPassword: '' }); // Clear errors on success
      toast.success('Profile updated successfully!');
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Paper style={{ padding: 20, maxWidth: 800, margin: '80px auto', backgroundColor: 'transparent' }}> {/* Adjust margin here */}
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={4} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar
            src={avatarPreview}
            alt="Profile Picture"
            style={{ width: 100, height: 100, cursor: 'pointer' }}
            onClick={handleAvatarClick}
          />
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleFileChange}
            onClick={(e) => e.stopPropagation()}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography variant="h5">Profile Information</Typography>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            error={Boolean(errors.username)}
            helperText={errors.username}
          />
          <TextField
            fullWidth
            label="Email"
            value={profile.email}
            InputProps={{ readOnly: true }}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            error={Boolean(errors.password)}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleClickShowConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" color="primary" onClick={handleUpdateProfile} style={{ marginTop: 20 }}>
            Update Profile
          </Button>
        </Grid>
      </Grid>
      <ToastContainer />
    </Paper>
  );
};

export default ProfilePage;
