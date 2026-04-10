import { ensureCollection } from '../utils/ensureCollection.js';
import { mapCollectionToTypesense, mapToTypesense } from './schema-mapper.js';
export const setupHooks = (typesenseClient, pluginOptions, existingHooks = {})=>{
    const hooks = {
        ...existingHooks
    };
    const vector = pluginOptions.vectorSearch;
    for (const [collectionSlug, config] of Object.entries(pluginOptions.collections || {})){
        if (!config?.enabled) {
            continue;
        }
        const changeHook = async ({ doc, operation, req })=>{
            // Re-fetch with depth 1 to resolve relationship fields (category, specialty, etc.)
            let fullDoc = doc;
            try {
                if (req?.payload) {
                    fullDoc = await req.payload.findByID({
                        collection: collectionSlug,
                        id: doc.id,
                        depth: 1
                    });
                }
            } catch  {
            // Fall back to original doc if re-fetch fails
            }
            await syncDocumentToTypesense(typesenseClient, collectionSlug, fullDoc, operation, config, vector);
        };
        hooks.afterChange = {
            ...hooks.afterChange,
            [collectionSlug]: [
                ...hooks.afterChange?.[collectionSlug] || [],
                changeHook
            ]
        };
        const deleteHook = async ({ doc })=>{
            if (typeof doc?.id === 'string' || typeof doc?.id === 'number') {
                await deleteDocumentFromTypesense(typesenseClient, collectionSlug, String(doc?.id));
            }
        };
        hooks.afterDelete = {
            ...hooks.afterDelete,
            [collectionSlug]: [
                ...hooks.afterDelete?.[collectionSlug] || [],
                deleteHook
            ]
        };
    }
    return hooks;
};
export const syncDocumentToTypesense = async (typesenseClient, collectionSlug, doc, _operation, config, vector)=>{
    try {
        const schema = mapCollectionToTypesense(collectionSlug, config, vector);
        await ensureCollection(typesenseClient, collectionSlug, schema);
        const typesenseDoc = mapToTypesense(doc, collectionSlug, config);
        if (!typesenseDoc) return;
        await typesenseClient.collections(collectionSlug).documents().upsert(typesenseDoc);
    } catch  {
    // swallow to avoid breaking payload saves
    }
};
export const deleteDocumentFromTypesense = async (typesenseClient, collectionSlug, docId)=>{
    try {
        await typesenseClient.collections(collectionSlug).documents(docId).delete();
    } catch  {
    // ignore delete errors
    }
};
