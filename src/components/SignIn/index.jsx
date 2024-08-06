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
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { validateEmail } from '../../utils/validation';

const theme = createTheme();

export default function SignIn({ onSwitchToSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [invalidEmailOrPassword, setInvalidEmailOrPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token); // Store the token in local storage
        alert('Login successful');

        window.location.href = '/AuthenticatedPage'; // Redirect to authenticatedPage
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
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!passwordError || invalidEmailOrPassword}
                helperText={passwordError}
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
                  <Link
                    component="button"
                    onClick={onSwitchToSignUp} // Call the function to switch to SignUp
                    variant="body2"
                    underline="hover"
                  >
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
