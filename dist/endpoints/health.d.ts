import { type PayloadHandler } from 'payload';
import type Typesense from 'typesense';
import { type TypesenseConfig } from '../types.js';
export declare const createHealthCheck: (typesenseClient: Typesense.Client, _pluginOptions: TypesenseConfig, lastSyncTime?: number) => PayloadHandler;
export declare const createDetailedHealthCheck: (typesenseClient: Typesense.Client, pluginOptions: TypesenseConfig, lastSyncTime?: number) => PayloadHandler;
//# sourceMappingURL=health.d.ts.map