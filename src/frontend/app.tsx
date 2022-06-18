import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Typography, ThemeProvider, Container } from '@mui/material';

import { theme } from './styles/theme.js';
import { ConfigProvider } from './hooks/useConfig.js';
import { HomePage } from './pages/HomePage.js';

export const App = () => {
  return (
    <BrowserRouter basename="/hijacker">
      <ConfigProvider>
        <ThemeProvider theme={theme}>
          <Container>
            <Typography variant="h1">Hijacker</Typography>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="testing" element={<div>testing</div>} />
              <Route path="hello" element={<div>hello</div>} />
            </Routes>
          </Container>
        </ThemeProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
};