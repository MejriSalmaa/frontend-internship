import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Avatar, Grid, Paper, Typography, Button, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [file, setFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  const fileInputRef = React.createRef();

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
      setError('Failed to fetch profile');
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      let updateData = { username };

      if (password) {
        updateData.password = password;
      }

      const token = localStorage.getItem('access_token');
      await axios.put('http://localhost:3000/users/profile/update', updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile({ ...profile, username }); // Update profile state
      toast.success('Profile updated successfully!'); // Show success toast
      fetchProfile(); // Refetch profile data to ensure updates are reflected
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile.'); // Show error toast
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleUploadPicture = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const token = localStorage.getItem('access_token');
      await axios.post('http://localhost:3000/users/profile/upload-picture', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Profile picture updated successfully!'); // Show success toast
      fetchProfile(); // Refetch profile data to ensure updates are reflected
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to upload profile picture.'); // Show error toast
    }
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
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper style={{ padding: 20, maxWidth: 600, margin: 'auto' }}>
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
            onClick={(e) => e.stopPropagation()} // Prevent triggering click on Avatar
          />
          <Button variant="contained" color="secondary" onClick={handleUploadPicture} style={{ marginTop: 20 }}>
            Upload Picture
          </Button>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography variant="h5">Profile Information</Typography>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
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
      <ToastContainer /> {/* Add this line */}
    </Paper>
  );
};

export default ProfilePage;
