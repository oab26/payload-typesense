import Typesense from 'typesense';
const offline = new Error('Typesense offline');
let client = null;
const isOffline = ()=>{
    const evt = process.env.npm_lifecycle_event || '';
    if (evt.includes('build') || evt === 'tsc') return true;
    if (process.argv.some((a)=>/(?:^|:|\/)(?:build|tsc)(?::|$)/i.test(a))) return true;
    if (process.env.CI === 'true') return true;
    return false;
};
const createOfflineClient = ()=>{
    return {
        analytics: {
            retrieve: ()=>{
                return Promise.reject(offline);
            }
        },
        collections: ()=>{
            return {
                retrieve: ()=>{
                    return Promise.reject(offline);
                }
            };
        },
        health: {
            retrieve: ()=>{
                return Promise.reject(offline);
            }
        },
        operations: {
            get: ()=>{
                return Promise.reject(offline);
            }
        }
    };
};
export const createClient = (typesenseConfig)=>{
    if (client) return client;
    if (isOffline()) {
        client = createOfflineClient();
        return client;
    }
    client = new Typesense.Client({
        apiKey: typesenseConfig.apiKey,
        connectionTimeoutSeconds: typesenseConfig.connectionTimeoutSeconds || 2,
        nodes: typesenseConfig.nodes.map((node)=>({
                ...node,
                port: typeof node.port === 'string' ? parseInt(node.port, 10) : node.port
            }))
    });
    return client;
};
