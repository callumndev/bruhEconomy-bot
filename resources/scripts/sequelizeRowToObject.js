module.exports = (row_packet, ignoreKeys = []) => {
    if(!row_packet) return null;
    
    const object = {};
    const attributes = row_packet._options.attributes;

    for (let i = 0; i < attributes.length; i++) {
        const attribute = attributes[i];
        const value = row_packet[attribute];

        if(ignoreKeys.some(el => new RegExp(attribute, 'i').test(el))) continue;
        Object.assign(object, { [attribute]: value });
    };
    
    return object;
};