import { ThemeProvider } from './context/ThemeProvider.context';
import Routing from './Routing.tsx';
import ApolloProviderWrapper from './context/ApolloProviderWrapper.tsx';
import AuthContextProvider from './context/AuthContextProvider.tsx';
import { BrowserRouter } from 'react-router-dom';
import { Container } from '@mui/material';
import NavBar from './components/NavBar.tsx';
import { SnackbarProvider } from 'notistack';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <ApolloProviderWrapper>
          <ThemeProvider>
            <SnackbarProvider>
              <NavBar />
              <Container
                sx={{
                  paddingX: 2
                }}
              >
                <Routing />
              </Container>
            </SnackbarProvider>
          </ThemeProvider>
        </ApolloProviderWrapper>
      </AuthContextProvider>
    </BrowserRouter>
  );
};
