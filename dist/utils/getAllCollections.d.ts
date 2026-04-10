import type Typesense from 'typesense';
import { type TypesenseConfig } from '../types.js';
export declare const getAllCollections: (typesenseClient: Typesense.Client, pluginOptions: TypesenseConfig, query: string, options: {
    collections?: string[];
    filters: Record<string, unknown>;
    page: number;
    per_page: number;
    sort_by?: string;
    vector?: boolean;
}) => Promise<Response>;
//# sourceMappingURL=getAllCollections.d.ts.map