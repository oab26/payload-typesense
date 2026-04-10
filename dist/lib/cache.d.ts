import { type CacheOptions } from '../types.js';
export declare class SearchCache<T = unknown> {
    private cache;
    private readonly defaultTTL;
    private readonly maxSize;
    private stats;
    constructor(options?: CacheOptions);
    private evict;
    private generateKey;
    private isExpired;
    private lookup;
    private normalize;
    private serialize;
    cleanup(): void;
    clear(pattern?: RegExp | string): void;
    get(query: string, collection?: string, params?: Record<string, unknown>): null | T;
    getStats(): {
        hitRate: number;
        maxSize: number;
        size: number;
    };
    has(query: string, collection?: string, params?: Record<string, unknown>): boolean;
    set(query: string, data: T, collection?: string, params?: Record<string, unknown>, ttl?: number): void;
}
export declare const searchCache: SearchCache<unknown>;
//# sourceMappingURL=cache.d.ts.map