import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '../styles/theme';
import { MemoryRouter } from 'react-router-dom';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

const withMuiTheme = (Story) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Story />
    </ThemeProvider>
  )
};

const withReactRouter = (Story) => (
  <MemoryRouter initialEntries={['/']}>
    <Story />
  </MemoryRouter>
)

export const decorators = [withMuiTheme, withReactRouter];