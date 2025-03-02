import { createTheme, ThemeProvider, useMediaQuery, CssBaseline } from '@mui/material';

import Page from './page';

import "./App.css";

function Layout() {
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const darkTheme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      background: {
        default: isDarkMode ? '#2f2f2f' : '#fff',
      }
    },
  });
  
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Page />
    </ThemeProvider>
  );
}

export default Layout;
