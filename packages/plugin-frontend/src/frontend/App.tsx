import { Typography, ThemeProvider, Container, CssBaseline } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ConfigProvider } from './hooks/useConfig.js';
import { HomePage } from './pages/HomePage.js';
import { theme } from './styles/theme.js';

export const App = () => {
  return (
    <BrowserRouter>
      <ConfigProvider>
        <ThemeProvider theme={theme}>
          <Container>
            <CssBaseline />
            <Typography variant="h1">Hijacker</Typography>
            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </Container>
        </ThemeProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
};