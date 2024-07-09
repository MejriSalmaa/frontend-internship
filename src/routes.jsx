import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import SignIn from './components/SignIn/index'; 
import SignUP from './components/SignUp/index'; 

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUP />} />

      {/* Define other routes here */}
    </Routes>
  );
};

export default AppRoutes;