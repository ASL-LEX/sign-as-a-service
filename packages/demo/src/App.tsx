import { Banner } from './components/Banner.component';
import { ThemeProvider } from './theme/Theme.provider';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Banner />
    </ThemeProvider>
  );
}

export default App;
