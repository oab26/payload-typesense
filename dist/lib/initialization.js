import { ensureCollection } from '../utils/ensureCollection.js';
import { testConnection } from '../utils/testConnection.js';
import { mapCollectionToTypesense, mapToTypesense } from './schema-mapper.js';
import { validateConfig } from './validation.js';
export const initializeTypesense = async (payload, typesenseClient, pluginOptions)=>{
    const validation = validateConfig(pluginOptions);
    if (!validation.success) {
        throw new Error('Invalid plugin configuration');
    }
    const isConnected = await testConnection(typesenseClient);
    if (!isConnected) return;
    const entries = Object.entries(pluginOptions.collections || {});
    const vector = pluginOptions.vectorSearch;
    for (const [slug, cfg] of entries){
        if (cfg?.enabled) {
            await initializeCollection(payload, typesenseClient, slug, cfg, vector);
        }
    }
};
const initializeCollection = async (payload, typesenseClient, collectionSlug, config, vector)=>{
    const collection = payload.collections[collectionSlug];
    if (!collection) return;
    const schema = mapCollectionToTypesense(collectionSlug, config, vector);
    const exists = await ensureCollection(typesenseClient, collectionSlug, schema);
    if (!exists) return;
    await syncExistingDocuments(payload, typesenseClient, collectionSlug, config);
};
const syncExistingDocuments = async (payload, typesenseClient, collectionSlug, config)=>{
    try {
        const limit = config?.syncLimit ?? 1000;
        let page = 1;
        let hasMore = true;
        let totalPages;
        while(hasMore){
            const { docs, hasNextPage, totalPages: pages } = await payload.find({
                collection: collectionSlug,
                depth: 0,
                limit,
                page
            });
            if (pages) {
                totalPages = pages;
            }
            if (!docs.length) {
                break;
            }
            const batchSize = 100;
            for(let i = 0; i < docs.length; i += batchSize){
                const batch = docs.slice(i, i + batchSize);
                const mapped = batch.filter((doc)=>{
                    if (typeof doc !== 'object' || doc === null) return false;
                    if (!('id' in doc)) return false;
                    const id = doc.id;
                    return typeof id === 'string' || typeof id === 'number';
                }).map((doc)=>mapToTypesense(doc, collectionSlug, config)).filter((doc)=>doc !== null);
                try {
                    await typesenseClient.collections(collectionSlug).documents().import(mapped, {
                        action: 'upsert'
                    });
                } catch (error) {
                    const err = error;
                    if (err?.importResults) {
                        for (const doc of mapped){
                            try {
                                await typesenseClient.collections(collectionSlug).documents().upsert(doc);
                            } catch  {
                            // ignore individual item errors
                            }
                        }
                    }
                }
            }
            hasMore = hasNextPage ?? (totalPages ? page < totalPages : false);
            page++;
        }
    } catch  {
    // ignore top-level sync errors
    }
};
