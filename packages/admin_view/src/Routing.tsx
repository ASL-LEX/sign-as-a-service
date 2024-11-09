import { Route, Routes, useNavigate } from 'react-router-dom';
import { ReactNode, useEffect } from 'react';
import Home from './pages/Home.tsx';
import AdminSignInPage from './pages/AdminSignInPage.tsx';
import { Box } from '@mui/material';
import { useAuthContext } from './context/use-auth-context.tsx';

// TODO Figure out bundle splitting
// const Home = lazy(() => import('./pages/Home'));
// const LoginPage = lazy(() => import('./pages/AdminSignInPage'));

const AuthenticatedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [navigate, user]);

  return <>{children}</>;
};

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<AdminSignInPage />} />
      <Route
        path="/authenticated"
        element={
          <AuthenticatedRoute>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
              Example Authenticated Page
            </Box>
          </AuthenticatedRoute>
        }
      />
    </Routes>
  );
};
export default Routing;
