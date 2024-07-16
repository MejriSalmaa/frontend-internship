import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import SignIn from './components/SignIn/index'; 
import SignUP from './components/SignUp/index'; 
import Calendar from './components/Calendar/index';
import AuthenticatedHeader from './layouts/AuthenticatedHeader';
import AuthenticatedPage from './pages/AuthenticatedPage';
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUP />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/authenticated" element={<AuthenticatedHeader />} />
      <Route path="/AuthenticatedPage" element={<AuthenticatedPage />} />
      {/* Define other routes here */}
    </Routes>
  );
};

export default AppRoutes;