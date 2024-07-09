import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Card from '@mui/material/Card';
import Switch from '@mui/material/Switch';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Stack from '@mui/material/Stack';

const theme = createTheme();

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [invalidEmailOrPassword, setInvalidEmailOrPassword] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setEmailError('');
    setPasswordError('');
    setInvalidEmailOrPassword(false);

    let valid = true;

    if (!validateEmail(email)) {
      setEmailError('Invalid email address');
      valid = false;
    }

    if (password.length < 4) {
      setPasswordError('Password must be at least 4 characters');
      valid = false;
    }

    if (!valid) {
      return;
    }

    const credentials = { email, password };

    try {
      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Save token
        window.location.href = '/dashboard'; // Redirect to dashboard
      } else {
        // Handle different error scenarios
        const errorData = await response.json();
        if (errorData.message === 'User not found' || errorData.message === 'Incorrect password') {
          setInvalidEmailOrPassword(true);
        }
        console.error('Sign in failed');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
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
              p: 2,
            }}
          >
            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!emailError || invalidEmailOrPassword}
                helperText={emailError}
                sx={{ borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!passwordError || invalidEmailOrPassword}
                helperText={passwordError}
                sx={{ borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
                <Switch checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Remember me
                </Typography>
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  background: 'linear-gradient(195deg, rgb(73, 163, 241), rgb(26, 115, 232))',
                  '&:hover': {
                    background: 'linear-gradient(195deg, rgb(73, 163, 241), rgb(26, 115, 232))',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                Sign In
              </Button>
              <Stack spacing={1} alignItems="center">
                <Typography variant="body2">
                  Don&apos;t have an account?{' '}
                  <Link component={RouterLink} to="/sign-up" variant="body2" underline="hover">
                    Sign Up
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
