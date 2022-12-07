import { Typography, ThemeProvider, Container, CssBaseline } from '@mui/material';
import { createBrowserRouter, RouterProvider, useMatch } from 'react-router-dom';

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
          <RouterProvider router={router} />
        </Container>
      </ThemeProvider>
    </ConfigProvider>
  );
};