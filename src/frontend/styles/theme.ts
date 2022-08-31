import { createTheme } from '@mui/material';

export const theme = createTheme({
  components: {
    MuiAccordionSummary: {
      styleOverrides: {
        content: {
          alignItems: 'center'
        }
      }
    }
  }
});