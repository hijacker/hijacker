import { Typography, ThemeProvider, Container, CssBaseline } from '@mui/material';
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
          <Typography variant="h1">Hijacker</Typography>
          <RouterProvider router={router} />
        </Container>
      </ThemeProvider>
    </ConfigProvider>
  );
};