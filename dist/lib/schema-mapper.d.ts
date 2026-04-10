import { type BaseDocument, type CollectionFieldSchema, type TypesenseConfig } from '../types.js';
export declare const mapCollectionToTypesense: (collectionSlug: string, config: NonNullable<TypesenseConfig["collections"]>[string] | undefined, vector?: NonNullable<TypesenseConfig["vectorSearch"]>) => {
    name: string;
    fields: CollectionFieldSchema[];
};
export declare const mapToTypesense: (doc: BaseDocument, _collectionSlug: string, config: NonNullable<TypesenseConfig["collections"]>[string]) => Record<string, number | string> | null;
//# sourceMappingURL=schema-mapper.d.ts.map