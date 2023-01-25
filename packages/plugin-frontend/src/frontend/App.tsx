import { ThemeProvider, Container, CssBaseline } from '@mui/material';
import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { ConfigProvider } from './hooks/useConfig.js';
import { routes } from './routes.js';
import { theme } from './styles/theme.js';

const router = createBrowserRouter(routes);

export const App = () => {
  return (
    <ConfigProvider>
      <ThemeProvider theme={theme}>
        <Container>
          <CssBaseline />
          <Suspense fallback={<>...</>}>
            <RouterProvider router={router} />
          </Suspense>
        </Container>
      </ThemeProvider>
    </ConfigProvider>
  );
};