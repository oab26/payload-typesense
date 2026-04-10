import { extractText } from '../utils/extractText.js';
/** Resolve a dot-separated path in a document, with special support for:
 *  - 'field.url' → nested object property
 *  - 'field.0.price' → array index access
 *  - 'field.length' → array length
 */ function resolveFieldPath(doc, path) {
    const parts = path.split('.');
    let current = doc;
    for (const part of parts){
        if (current == null) return undefined;
        if (part === 'length' && Array.isArray(current)) return current.length;
        if (typeof current === 'object' && !Array.isArray(current)) {
            current = current[part];
        } else if (Array.isArray(current)) {
            const idx = parseInt(part, 10);
            if (!isNaN(idx)) {
                current = current[idx];
            } else {
                // Try to extract from first element
                current = current[0] ? current[0][part] : undefined;
            }
        } else {
            return undefined;
        }
    }
    return current;
}
export const mapCollectionToTypesense = (collectionSlug, config, vector)=>{
    const searchableFields = config?.searchFields || [
        'title',
        'content',
        'description'
    ];
    const facetFields = config?.facetFields || [];
    const baseFields = [
        {
            name: 'slug',
            type: 'string'
        },
        {
            name: 'createdAt',
            type: 'int64'
        },
        {
            name: 'updatedAt',
            type: 'int64'
        }
    ];
    const searchFields = searchableFields.map((field)=>({
            name: field,
            type: 'string',
            facet: facetFields.includes(field)
        }));
    const facetOnlyFields = facetFields.filter((field)=>!searchableFields.includes(field)).map((field)=>({
            name: field,
            type: 'string',
            facet: true
        }));
    const displayFields = (config?.displayFields || []).map((df)=>({
            name: df.name,
            type: df.type || 'string',
            optional: true,
            index: false
        }));
    const fields = [
        ...baseFields,
        ...searchFields,
        ...facetOnlyFields,
        ...displayFields
    ];
    if (vector?.enabled) {
        const embedFromFields = vector.embedFrom ?? searchableFields;
        const embeddingModel = vector.embeddingModel ?? 'ts/all-MiniLM-L12-v2';
        fields.push({
            name: 'embedding',
            type: 'float[]',
            embed: {
                from: embedFromFields,
                model_config: {
                    model_name: embeddingModel
                }
            }
        });
    }
    const schema = {
        name: collectionSlug,
        fields
    };
    return schema;
};
export const mapToTypesense = (doc, _collectionSlug, config)=>{
    const searchableFields = config?.searchFields || [
        'title',
        'content',
        'description'
    ];
    const facetFields = config?.facetFields || [];
    if (!doc.id) {
        throw new Error(`Document missing required 'id' field: ${JSON.stringify(doc)}`);
    }
    const createdAt = doc.createdAt ? new Date(doc.createdAt) : new Date();
    const updatedAt = doc.updatedAt ? new Date(doc.updatedAt) : new Date();
    const typesenseDoc = {
        id: String(doc.id),
        slug: String(doc.slug || ''),
        createdAt: createdAt.getTime(),
        updatedAt: updatedAt.getTime()
    };
    for (const field of searchableFields){
        if (field.includes('.')) {
            const [arrayField, subField] = field.split('.', 2);
            if (arrayField && subField && Array.isArray(doc[arrayField])) {
                const joined = doc[arrayField].map((item)=>{
                    if (!item || typeof item !== 'object' || !(subField in item)) return '';
                    const raw = item[subField];
                    if (raw == null) return '';
                    if (typeof raw === 'string' || typeof raw === 'number') {
                        return String(raw);
                    }
                    if (typeof raw === 'object' && 'root' in raw) {
                        return extractText(raw) || '';
                    }
                    return '';
                }).filter(Boolean).join(' ');
                typesenseDoc[field] = joined;
            } else {
                typesenseDoc[field] = '';
            }
            continue;
        }
        const value = doc[field];
        if (value == null) {
            typesenseDoc[field] = '';
            continue;
        }
        if (typeof value === 'object' && value !== null && 'root' in value) {
            typesenseDoc[field] = extractText(value) || '';
        } else if (typeof value === 'string' || typeof value === 'number') {
            typesenseDoc[field] = String(value);
        } else {
            typesenseDoc[field] = '';
        }
    }
    for (const field of facetFields){
        const value = doc[field];
        if (typeof value === 'string' || typeof value === 'number') {
            typesenseDoc[field] = String(value);
        } else if (Array.isArray(value)) {
            // hasMany relationship — array of objects or IDs
            const resolved = value.map((v)=>{
                if (typeof v === 'object' && v !== null) {
                    return v.name || v.title || String(v.id || '');
                }
                return String(v || '');
            }).filter(Boolean);
            typesenseDoc[field] = resolved.join(', ');
        } else if (typeof value === 'object' && value !== null) {
            // Single relationship — extract name or title
            const obj = value;
            typesenseDoc[field] = String(obj.name || obj.title || obj.id || 'unknown');
        } else {
            typesenseDoc[field] = 'unknown';
        }
    }
    // Extract display fields (images, prices, counts, etc.)
    for (const df of config?.displayFields || []){
        const val = resolveFieldPath(doc, df.source);
        if (val !== undefined && val !== null) {
            if (df.type === 'int32' || df.type === 'float') {
                typesenseDoc[df.name] = typeof val === 'number' ? val : Number(val) || 0;
            } else if (df.type === 'string[]' && Array.isArray(val)) {
                typesenseDoc[df.name] = val.map(String).join(', ');
            } else {
                typesenseDoc[df.name] = String(val);
            }
        }
    }
    const hasSearchableContent = searchableFields.some((field)=>{
        const value = typesenseDoc[field];
        return typeof value === 'string' && value.trim().length > 0;
    });
    if (!hasSearchableContent) {
        return null;
    }
    return typesenseDoc;
};
