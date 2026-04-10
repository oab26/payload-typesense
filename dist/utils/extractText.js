export const extractText = (richText)=>{
    if (!richText || typeof richText !== 'object' || !('root' in richText)) {
        return '';
    }
    const extract = (node)=>{
        if (typeof node === 'string') return node;
        if (node && typeof node === 'object') {
            if ('text' in node && typeof node.text === 'string') {
                return node.text;
            }
            if ('children' in node && Array.isArray(node.children)) {
                return node.children.map(extract).join('');
            }
        }
        return '';
    };
    return extract(richText.root);
};
