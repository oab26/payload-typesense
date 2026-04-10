export const buildError = (isTypesenseHealthy, hasCollections)=>{
    const errors = [];
    if (!isTypesenseHealthy) {
        errors.push('Typesense connection failed');
    }
    if (!hasCollections) {
        errors.push('No collections available');
    }
    return errors.length > 0 ? errors.join(', ') : undefined;
};
