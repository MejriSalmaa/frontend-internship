import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import SignIn from './components/SignIn/index'; 
import SignUP from './components/SignUp/index'; 
import Calendar from './components/Calendar/index';
import AuthenticatedHeader from './layouts/AuthenticatedHeader';
import AuthenticatedPage from './pages/AuthenticatedPage';
import CreateEvent from './components/Event/CreateEvent';
import ManageUser from './pages/ManageUser';
import ProfilePage from './pages/ProfilePage';
import ParticipationPage from './pages/ParticipationPage';
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUP />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/authenticated" element={<AuthenticatedHeader />} />
      <Route path="/AuthenticatedPage" element={<AuthenticatedPage />} />
      <Route path ="/create-event" element={<CreateEvent />} />
      <Route path ="/users" element={<ManageUser />} />
      <Route path ="/profile" element={<ProfilePage />} />
      <Route path ="/participations" element={<ParticipationPage />} />
      {/* Define other routes here */}
    </Routes>
  );
};

export default AppRoutes;