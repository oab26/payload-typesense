export const getCollectionInfo = async (client)=>{
    try {
        const collections = await client.collections().retrieve();
        return collections.map((c)=>c.name);
    } catch  {
        return [];
    }
};
