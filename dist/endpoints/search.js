import { createAdvancedSearch } from './handler/createAdvancedSearch.js';
import { createCollections } from './handler/createCollections.js';
import { createSearch } from './handler/createSearch.js';
import { createSuggest } from './handler/createSuggest.js';
import { createDetailedHealthCheck, createHealthCheck } from './health.js';
export const createSearchEndpoints = (typesenseClient, pluginOptions, lastSyncTime)=>{
    return [
        {
            handler: createCollections(pluginOptions),
            method: 'get',
            path: '/search/collections'
        },
        {
            handler: createSuggest(typesenseClient, pluginOptions),
            method: 'get',
            path: '/search/:collectionName/suggest'
        },
        {
            handler: createSearch(typesenseClient, pluginOptions),
            method: 'get',
            path: '/search/:collectionName'
        },
        {
            handler: createAdvancedSearch(typesenseClient, pluginOptions),
            method: 'post',
            path: '/search/:collectionName'
        },
        {
            handler: createSearch(typesenseClient, pluginOptions),
            method: 'get',
            path: '/search'
        },
        {
            handler: createHealthCheck(typesenseClient, pluginOptions, lastSyncTime),
            method: 'get',
            path: '/search/health'
        },
        {
            handler: createDetailedHealthCheck(typesenseClient, pluginOptions, lastSyncTime),
            method: 'get',
            path: '/search/health/detailed'
        }
    ];
};
