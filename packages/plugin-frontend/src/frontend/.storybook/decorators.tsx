import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '../styles/theme';
import { MemoryRouter } from 'react-router-dom';
import { MockConfigProvider } from './mockUseConfig';
import { mockRules } from './mock_data/rules';
import { mockHistory } from './mock_data/history';

export const withMuiTheme = (Story: any) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Story />
    </ThemeProvider>
  )
};

export const withReactRouter = (Story: any) => (
  <MemoryRouter initialEntries={['/']}>
    <Story />
  </MemoryRouter>
);

export const withConfig = (Story: any) => {
  const baseRule = {
    baseUrl: 'http://localhost:3000'
  }

  return (
    <MockConfigProvider
      initialRules={mockRules}
      initialBaseRule={baseRule}
      initialHistory={mockHistory}
    >
      <Story />
    </MockConfigProvider>
  )
}