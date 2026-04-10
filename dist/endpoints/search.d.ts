import type Typesense from 'typesense';
import { type TypesenseConfig } from '../types.js';
export declare const createSearchEndpoints: (typesenseClient: Typesense.Client, pluginOptions: TypesenseConfig, lastSyncTime?: number) => ({
    handler: import("payload").PayloadHandler;
    method: "get";
    path: string;
} | {
    handler: import("payload").PayloadHandler;
    method: "post";
    path: string;
})[];
//# sourceMappingURL=search.d.ts.map