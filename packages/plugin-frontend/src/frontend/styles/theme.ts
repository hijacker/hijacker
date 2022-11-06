import { createTheme } from '@mui/material';
import { HttpMethod } from '@hijacker/core';

interface MethodColorOptions {
  background: string;
  border: string;
};

declare module '@mui/material' {
  interface Palette {
    methods: Record<HttpMethod | 'ALL', MethodColorOptions>
  }

  interface PaletteOptions {
    methods?: Record<HttpMethod | 'ALL', MethodColorOptions>
  }
}

export const theme = createTheme({
  palette: {
    methods: {
      ALL: {
        background: '#FFFFFF',
        border: '#3179B4'
      },
      GET: {
        background: '#E8F6F0',
        border: '#2D8643'
      },
      POST: {
        background: '#FBF1E6',
        border: '#E69624'
      },
      PUT: {
        background: '#F4E7FD',
        border: '#B346FF'
      },
      DELETE: {
        background: '#FBE7E7',
        border: '#D93A3A'
      },
      HEAD: {
        background: '#FFFFFF',
        border: '#3179B4'
      },
      OPTIONS: {
        background: '#FFFFFF',
        border: '#3179B4'
      },
      PATCH: {
        background: '#FFFFFF',
        border: '#3179B4'
      },
      TRACE: {
        background: '#FFFFFF',
        border: '#3179B4'
      }
    }
  },
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