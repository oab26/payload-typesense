import type Typesense from 'typesense';
export declare function performVectorSearch(typesenseClient: Typesense.Client, query: string, options: {
    collection: string;
    page: number;
    per_page: number;
}): Promise<any>;
//# sourceMappingURL=vectorSearch.d.ts.map