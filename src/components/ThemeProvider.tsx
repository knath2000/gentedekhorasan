// src/components/ThemeProvider.tsx
import React from 'react';
import { useTheme } from 'styled-components/native';
import { Theme } from '../theme/theme';

// Safe consumer component that never renders theme values directly
export const ThemeConsumer = ({ children }: { children: (theme: Theme) => React.ReactNode }) => {
  // It's important that useTheme is called within a ThemeProvider context.
  // This component itself doesn't provide the theme, it consumes it.
  return <>{children(useTheme() as Theme)}</>;
};

// Export the original provider for use at app root from styled-components
// This allows the root layout to continue using ThemeProvider as it was.
export { ThemeProvider } from 'styled-components/native';
