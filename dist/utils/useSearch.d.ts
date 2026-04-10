import { type SearchResponse } from '../types.js';
type UseSearchOptions<T> = {
    baseUrl: string;
    collections?: string | string[];
    minQueryLength: number;
    onResults?: (results: SearchResponse<T>) => void;
    onSearch?: (query: string, results: SearchResponse<T>) => void;
    perPage: number;
    vector?: boolean;
};
export declare function useSearch<T = Record<string, unknown>>({ baseUrl, collections, minQueryLength, onResults, onSearch, perPage, vector, }: UseSearchOptions<T>): {
    error: string | null;
    isLoading: boolean;
    results: SearchResponse<T> | null;
    search: (searchQuery: string) => Promise<void>;
};
export {};
//# sourceMappingURL=useSearch.d.ts.map