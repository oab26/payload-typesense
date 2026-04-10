import React from 'react';
import { type SearchResult } from '../../types.js';
import { type ThemeContextValue } from '../themes/types.js';
interface RenderedResultProps {
    index: number;
    onResultClick: (result: SearchResult) => void;
    renderDate?: boolean;
    result: SearchResult;
    resultItemClassName?: string;
    resultsContainerClassName?: string;
    themeConfig: ThemeContextValue;
}
export declare function RenderedResult({ index, onResultClick, renderDate, result, resultItemClassName, resultsContainerClassName, themeConfig, }: RenderedResultProps): React.JSX.Element;
export {};
//# sourceMappingURL=Results.d.ts.map