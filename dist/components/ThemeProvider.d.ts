import React from 'react';
import { type ThemeConfig, type ThemeContextValue } from './themes/types.js';
interface ThemeProviderProps {
    children: React.ReactNode;
    config: ThemeConfig;
}
export declare function ThemeProvider({ children, config }: ThemeProviderProps): React.JSX.Element;
export declare function useTheme(): ThemeContextValue;
export {};
//# sourceMappingURL=ThemeProvider.d.ts.map