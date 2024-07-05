import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
// Removed import { Link } from 'react-router-dom'; as it's no longer needed for the buttons

const logoStyle = {
  width: '50px',
  height: '50px',
  cursor: 'pointer',
};

// Accept onSignInClick and onSignUpClick as props
export default function ButtonAppBar({ onSignInClick, onSignUpClick }) {
  const toggleDrawer = () => {
    // Implement your drawer toggling logic here
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
            <Button
              color="primary"
              variant="text"
              onClick={onSignInClick} // Use onClick to call the passed in onSignInClick function
              sx={{ ml: 1 }}
            >
              Sign in
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={onSignUpClick} // Use onClick to call the passed in onSignUpClick function
              sx={{ ml: 1 }}
            >
              Sign up
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}