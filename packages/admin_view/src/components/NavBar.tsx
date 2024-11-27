import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/use-auth-context.tsx';
import { LogoutRounded } from '@mui/icons-material';

const NAVBAR_DATA = [
  { title: 'View Lexicon', navigate: '/' },
  { title: 'Create Lexicon', navigate: '/create' }
];
const HIDE_NAVBAR_PAGES = ['/login'];

function ResponsiveAppBar() {
  const navigateTo = useNavigate();
  const location = useLocation();
  const { logout } = useAuthContext();

  return (
    !HIDE_NAVBAR_PAGES.includes(location.pathname) && (
      <Container>
        <AppBar position="static" sx={{ paddingX: 2, marginY: 2 }}>
          <Toolbar disableGutters sx={{}}>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex' } }}>
              {NAVBAR_DATA.map(({ title, navigate }) => (
                <Button
                  key={title}
                  onClick={() => navigateTo(navigate)}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {title}
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Logout">
                <IconButton onClick={logout} sx={{ p: 1, color: 'white' }}>
                  <LogoutRounded />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>
      </Container>
    )
  );
}
export default ResponsiveAppBar;
