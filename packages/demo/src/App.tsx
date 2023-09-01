import { Banner } from './components/banner.component';
import { ThemeProvider } from './theme/theme.provider';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Banner />
    </ThemeProvider>
  );
}

export default App;
