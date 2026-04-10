import { type CollectionAfterChangeHook, type CollectionAfterDeleteHook } from 'payload';
import type Typesense from 'typesense';
import { type BaseDocument, type TypesenseConfig } from '../types.js';
export declare const setupHooks: (typesenseClient: Typesense.Client, pluginOptions: TypesenseConfig, existingHooks?: {
    afterChange?: Record<string, CollectionAfterChangeHook[]>;
    afterDelete?: Record<string, CollectionAfterDeleteHook[]>;
}) => {
    afterChange?: Record<string, CollectionAfterChangeHook[]>;
    afterDelete?: Record<string, CollectionAfterDeleteHook[]>;
};
export declare const syncDocumentToTypesense: (typesenseClient: Typesense.Client, collectionSlug: string, doc: BaseDocument, _operation: "create" | "update", config: NonNullable<TypesenseConfig["collections"]>[string] | undefined, vector?: NonNullable<TypesenseConfig["vectorSearch"]>) => Promise<void>;
export declare const deleteDocumentFromTypesense: (typesenseClient: Typesense.Client, collectionSlug: string, docId: string) => Promise<void>;
//# sourceMappingURL=hooks.d.ts.map