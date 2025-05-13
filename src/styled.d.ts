// src/styled.d.ts
import 'styled-components/native';
import { Theme } from './theme/theme'; // Adjust path if necessary

declare module 'styled-components/native' {
  export interface DefaultTheme extends Theme {}
}