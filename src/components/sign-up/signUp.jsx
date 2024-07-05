import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const theme = createTheme();

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [picture, setPicture] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      username,
      email,
      password,
    };

    console.log(formData);
    if (picture) {
      console.log('Picture file:', picture.name);
    }

    // Assuming you have an endpoint to handle the sign-up request
    const endpoint = 'http://localhost:3000/users';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Success:', result);
      // Handle success, e.g., redirecting the user or showing a success message
    } catch (error) {
      console.error('Error:', error);
      // Handle errors, e.g., showing an error message to the user
    }
  };

  const handlePictureChange = (event) => {
    const file = event.target.files[0];
    setPicture(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Card>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 1, // Reduced padding
            }}
          >
            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
              Sign Up
            </Typography>
            <Avatar
              src={avatarPreview}
              sx={{ width: 56, height: 56, mt: 1, mb: 1 }} // Reduced margins
            />
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="dense" // Reduced margin
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="dense" // Reduced margin
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="dense" // Reduced margin
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
                sx={{ mt: 1, mb: 1 }} // Reduced margins
              >
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handlePictureChange}
                />
                <PhotoCamera />
              </IconButton>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  mb: 2,
                }}
              >
                Sign Up
              </Button>
              <Stack spacing={1} alignItems="center">
                <Typography variant="body2">
                  Already have an account?{' '}
                  <Link component={RouterLink} to="/sign-in" variant="body2" underline="hover">
                    Sign In
                  </Link>
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Card>
      </Container>
    </ThemeProvider>
  );
}