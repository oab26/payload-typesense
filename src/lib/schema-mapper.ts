import { type BaseDocument, type CollectionFieldSchema, type FieldType, type TypesenseConfig } from '../types.js'
import { extractText } from '../utils/extractText.js'

/** Resolve a dot-separated path in a document, with special support for:
 *  - 'field.url' → nested object property
 *  - 'field.0.price' → array index access
 *  - 'field.length' → array length
 */
function resolveFieldPath(doc: BaseDocument, path: string): unknown {
  const parts = path.split('.')
  let current: unknown = doc
  for (const part of parts) {
    if (current == null) return undefined
    if (part === 'length' && Array.isArray(current)) return current.length
    if (typeof current === 'object' && !Array.isArray(current)) {
      current = (current as Record<string, unknown>)[part]
    } else if (Array.isArray(current)) {
      const idx = parseInt(part, 10)
      if (!isNaN(idx)) {
        current = current[idx]
      } else {
        // Try to extract from first element
        current = current[0] ? (current[0] as Record<string, unknown>)[part] : undefined
      }
    } else {
      return undefined
    }
  }
  return current
}

export const mapCollectionToTypesense = (
  collectionSlug: string,
  config: NonNullable<TypesenseConfig['collections']>[string] | undefined,
  vector?: NonNullable<TypesenseConfig['vectorSearch']>
) => {
  const searchableFields = config?.searchFields || ['title', 'content', 'description']
  const facetFields = config?.facetFields || []

  const baseFields = [
    { name: 'slug', type: 'string' },
    { name: 'createdAt', type: 'int64' },
    { name: 'updatedAt', type: 'int64' },
  ] as const

  const searchFields = searchableFields.map((field: string) => ({
    name: field,
    type: 'string' as const,
    facet: facetFields.includes(field),
  }))

  const facetOnlyFields = facetFields
    .filter((field: string) => !searchableFields.includes(field))
    .map((field: string) => ({
      name: field,
      type: 'string' as const,
      facet: true,
    }))

  const displayFields = (config?.displayFields || []).map((df) => ({
    name: df.name,
    type: (df.type || 'string') as FieldType,
    optional: true,
    index: false,
  }))

  const fields: CollectionFieldSchema[] = [...baseFields, ...searchFields, ...facetOnlyFields, ...displayFields]

  if (vector?.enabled) {
    const embedFromFields = vector.embedFrom ?? searchableFields
    const embeddingModel = vector.embeddingModel ?? 'ts/all-MiniLM-L12-v2'

    fields.push({
      name: 'embedding',
      type: 'float[]',
      embed: {
        from: embedFromFields,
        model_config: {
          model_name: embeddingModel,
        },
      },
    })
  }

  const schema = {
    name: collectionSlug,
    fields,
  }

  return schema
}

export const mapToTypesense = (
  doc: BaseDocument,
  _collectionSlug: string,
  config: NonNullable<TypesenseConfig['collections']>[string]
): Record<string, number | string> | null => {
  const searchableFields = config?.searchFields || ['title', 'content', 'description']
  const facetFields = config?.facetFields || []

  if (!doc.id) {
    throw new Error(`Document missing required 'id' field: ${JSON.stringify(doc)}`)
  }

  const createdAt = doc.createdAt ? new Date(doc.createdAt) : new Date()
  const updatedAt = doc.updatedAt ? new Date(doc.updatedAt) : new Date()

  const typesenseDoc: Record<string, number | string> = {
    id: String(doc.id),
    slug: String(doc.slug || ''),
    createdAt: createdAt.getTime(),
    updatedAt: updatedAt.getTime(),
  }

  for (const field of searchableFields) {
    if (field.includes('.')) {
      const [arrayField, subField] = field.split('.', 2)
      if (arrayField && subField && Array.isArray(doc[arrayField])) {
        const joined = (doc[arrayField] as unknown[])
          .map((item) => {
            if (!item || typeof item !== 'object' || !(subField in item)) return ''

            const raw = (item as Record<string, unknown>)[subField]
            if (raw == null) return ''

            if (typeof raw === 'string' || typeof raw === 'number') {
              return String(raw)
            }

            if (typeof raw === 'object' && 'root' in raw) {
              return extractText(raw as { root: unknown }) || ''
            }

            return ''
          })
          .filter(Boolean)
          .join(' ')

        typesenseDoc[field] = joined
      } else {
        typesenseDoc[field] = ''
      }
      continue
    }

    const value = doc[field]

    if (value == null) {
      typesenseDoc[field] = ''
      continue
    }

    if (typeof value === 'object' && value !== null && 'root' in value) {
      typesenseDoc[field] = extractText(value as { root: unknown }) || ''
    } else if (typeof value === 'string' || typeof value === 'number') {
      typesenseDoc[field] = String(value)
    } else {
      typesenseDoc[field] = ''
    }
  }

  for (const field of facetFields) {
    const value = doc[field]

    if (typeof value === 'string' || typeof value === 'number') {
      typesenseDoc[field] = String(value)
    } else if (Array.isArray(value)) {
      // hasMany relationship — array of objects or IDs
      const resolved = value.map((v: unknown) => {
        if (typeof v === 'object' && v !== null) {
          return (v as Record<string, unknown>).name || (v as Record<string, unknown>).title || String((v as Record<string, unknown>).id || '')
        }
        return String(v || '')
      }).filter(Boolean)
      typesenseDoc[field] = resolved.join(', ')
    } else if (typeof value === 'object' && value !== null) {
      // Single relationship — extract name or title
      const obj = value as Record<string, unknown>
      typesenseDoc[field] = String(obj.name || obj.title || obj.id || 'unknown')
    } else {
      typesenseDoc[field] = 'unknown'
    }
  }

  // Extract display fields (images, prices, counts, etc.)
  for (const df of (config?.displayFields || [])) {
    const val = resolveFieldPath(doc, df.source)
    if (val !== undefined && val !== null) {
      if (df.type === 'int32' || df.type === 'float') {
        typesenseDoc[df.name] = typeof val === 'number' ? val : Number(val) || 0
      } else if (df.type === 'string[]' && Array.isArray(val)) {
        typesenseDoc[df.name] = val.map(String).join(', ')
      } else {
        typesenseDoc[df.name] = String(val)
      }
    }
  }

  const hasSearchableContent = searchableFields.some((field) => {
    const value = typesenseDoc[field]
    return typeof value === 'string' && value.trim().length > 0
  })

  if (!hasSearchableContent) {
    return null
  }

  return typesenseDoc
}
