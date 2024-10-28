import { ThemeProvider } from './context/ThemeProvider.context';
import Routing from './Routing.tsx';
import ApolloProviderWrapper from './context/ApolloProviderWrapper.tsx';
import AuthContextProvider from './context/AuthContextProvider.tsx';
import { BrowserRouter } from 'react-router-dom';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <ApolloProviderWrapper>
          <ThemeProvider>
            <Routing />
          </ThemeProvider>
        </ApolloProviderWrapper>
      </AuthContextProvider>
    </BrowserRouter>
  );
};
