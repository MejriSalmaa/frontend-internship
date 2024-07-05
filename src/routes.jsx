import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/layouts/landingPage';
import SignIn from './components/sign-in/signIn'; 
import SignUP from './components/sign-up/signUp'; 

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