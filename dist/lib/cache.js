export class SearchCache {
    cache = new Map();
    defaultTTL;
    maxSize;
    stats = {
        hits: 0,
        misses: 0
    };
    constructor(options = {}){
        this.defaultTTL = options.ttl ?? 5 * 60 * 1000;
        this.maxSize = options.maxSize ?? 1000;
    }
    evict() {
        this.cleanup();
        if (this.cache.size < this.maxSize) return;
        const oldestKey = this.cache.keys().next().value;
        if (oldestKey) {
            this.cache.delete(oldestKey);
        }
    }
    generateKey(query, collection, params) {
        const base = `${this.normalize(collection)}:${query}`;
        const serializedParams = this.serialize(params);
        return serializedParams ? `${base}:${serializedParams}` : base;
    }
    isExpired(entry) {
        return Date.now() - entry.timestamp > entry.ttl;
    }
    lookup(query, collection, params) {
        const key = this.generateKey(query, collection, params);
        const entry = this.cache.get(key);
        if (!entry || this.isExpired(entry)) {
            if (entry) {
                this.cache.delete(key);
            }
            return null;
        }
        this.cache.delete(key);
        this.cache.set(key, entry);
        return entry;
    }
    normalize(collection) {
        return collection ?? 'universal';
    }
    serialize(params) {
        if (!params || Object.keys(params).length === 0) return '';
        const sorted = Object.keys(params).sort().map((key)=>`${key}=${JSON.stringify(params[key])}`).join('&');
        return sorted;
    }
    cleanup() {
        for (const [key, entry] of this.cache.entries()){
            if (this.isExpired(entry)) {
                this.cache.delete(key);
            }
        }
    }
    clear(pattern) {
        if (!pattern) {
            this.cache.clear();
            return;
        }
        const matcher = typeof pattern === 'string' ? (key)=>key.includes(pattern) : (key)=>pattern.test(key);
        for (const key of this.cache.keys()){
            if (matcher(key)) {
                this.cache.delete(key);
            }
        }
    }
    get(query, collection, params) {
        const entry = this.lookup(query, collection, params);
        if (!entry) {
            this.stats.misses++;
            return null;
        }
        this.stats.hits++;
        return entry.data;
    }
    getStats() {
        const total = this.stats.hits + this.stats.misses;
        return {
            hitRate: total === 0 ? 0 : this.stats.hits / total,
            maxSize: this.maxSize,
            size: this.cache.size
        };
    }
    has(query, collection, params) {
        const key = this.generateKey(query, collection, params);
        const entry = this.cache.get(key);
        if (!entry || this.isExpired(entry)) {
            if (entry) {
                this.cache.delete(key);
            }
            return false;
        }
        return true;
    }
    set(query, data, collection, params, ttl) {
        const key = this.generateKey(query, collection, params);
        this.evict();
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl: ttl ?? this.defaultTTL
        });
    }
}
export const searchCache = new SearchCache({
    maxSize: 1000,
    ttl: 5 * 60 * 1000
});
