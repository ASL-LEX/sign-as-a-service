import { CssBaseline } from '@mui/material';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
export interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280
      }
    },
    components: {
      MuiContainer: {
        defaultProps: {
          maxWidth: false
        },
        styleOverrides: {
          root: ({ theme }) => ({
            width: '100vw',
            maxWidth: '100%',
            margin: '0 auto',
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            [theme.breakpoints.up('sm')]: {
              maxWidth: '640px'
            },
            [theme.breakpoints.up('md')]: {
              maxWidth: '768px'
            },
            [theme.breakpoints.up('lg')]: {
              maxWidth: '1024px'
            },
            [theme.breakpoints.up('xl')]: {
              maxWidth: '1280px'
            }
          })
        }
      }
    }
  });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
