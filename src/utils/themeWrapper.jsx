import React from 'react';
import { useTheme } from '@mui/material/styles';
import { ThemeProvider as LegacyThemeProvider } from '@mui/styles';

export const withLegacyTheme = (Component) => {
  return function ThemeWrapper(props) {
    const theme = useTheme();
    return (
      <LegacyThemeProvider theme={theme}>
        <Component {...props} />
      </LegacyThemeProvider>
    );
  };
};
