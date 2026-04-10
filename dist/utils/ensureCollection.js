export const ensureCollection = async (typesenseClient, collectionSlug, schema)=>{
    try {
        await typesenseClient.collections(collectionSlug).retrieve();
        return true;
    } catch  {
        try {
            await typesenseClient.collections().create(schema);
            return true;
        } catch  {
            return false;
        }
    }
};
