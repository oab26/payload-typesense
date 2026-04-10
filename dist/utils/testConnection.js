export const testConnection = async (client)=>{
    try {
        const health = await client.health.retrieve();
        return health.ok === true;
    } catch  {
        return false;
    }
};
