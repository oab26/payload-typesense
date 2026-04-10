import { type Theme, type ThemeClasses, type ThemeConfig } from './types.js';
export declare function getTheme(themeName: string): Theme;
export declare function mergeThemeConfig(config: ThemeConfig): Theme;
export declare function css(styles: Record<string, number | Record<string, number | string> | string>): string;
export declare function generateThemeClasses(theme: Theme, config?: Partial<ThemeConfig>): ThemeClasses;
/**
 * Apply theme to a CSS class with optional variant
 */
export declare function applyTheme(theme: Theme, element: string, variant?: string): string;
/**
 * Check if theme is dark mode
 */
export declare function isDarkTheme(theme: Theme): boolean;
/**
 * Check if theme is light mode
 */
export declare function isLightTheme(theme: Theme): boolean;
/**
 * Get theme-specific CSS variables
 */
export declare function getThemeVariables(theme: Theme): Record<string, string>;
//# sourceMappingURL=utils.d.ts.map