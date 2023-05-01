export default function (data: any) {
    if (typeof data === 'string') {
        return data.length;
    } else if (Array.isArray(data)) {
        return data.length;
    } else if (typeof data === 'object') {
        return Object.keys(data).length;
    }
    
    throw new Error(`Unable to use helpers length over ${typeof data} data`);
}
