export function getPropMeta(metaMap, obj, propName) {
    let currPropMeta = { name: ``, propName: ``, type: ``, field: {}, header: false, children: [] }
    switch (typeof obj) {
        case 'number':
            currPropMeta.propName = propName
            currPropMeta.type = `Number`
            metaMap = currPropMeta
            break
        case 'object':
            let type
            if (Array.isArray(obj)) {
                type = `Array`
                obj = obj[0]
            }
            else
                type = `Object`
            _.each(obj, (childItem, childKey) => {
                currPropMeta.children.push(getPropMeta([], childItem, childKey))
            })
            currPropMeta.type = type
            currPropMeta.propName = propName || ""
            metaMap = currPropMeta
            break
        case 'string':
            currPropMeta.propName = propName
            currPropMeta.type = `String`
            metaMap = currPropMeta
            break
        case 'boolean':
            currPropMeta.propName = propName
            currPropMeta.type = `Boolean`
            metaMap = currPropMeta
            break
        case 'function':
            currPropMeta.propName = propName
            currPropMeta.type = `Function`
            metaMap = currPropMeta
            break
        default:
            logger(`default`)
    }
    return metaMap
}