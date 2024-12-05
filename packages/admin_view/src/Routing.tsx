import { Route, Routes, useNavigate } from 'react-router-dom';
import { ReactNode, useEffect } from 'react';
import HomePage from './pages/HomePage.tsx';
import AdminSignInPage from './pages/AdminSignInPage.tsx';
import { useAuthContext } from './context/use-auth-context.tsx';
import CreateLexPage from './pages/CreateLexPage.tsx';
import { Typography } from '@mui/material';

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
      <Route
        path="/"
        element={
          <AuthenticatedRoute>
            <HomePage />
          </AuthenticatedRoute>
        }
      />
      <Route path="/login" element={<AdminSignInPage />} />
      <Route
        path="/create"
        element={
          <AuthenticatedRoute>
            <CreateLexPage />
          </AuthenticatedRoute>
        }
      />
      <Route path="*" element={<Typography variant="h4">Page Not Found</Typography>} />
    </Routes>
  );
};
export default Routing;
