import { logger } from "@util/Logging"
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { attacks, genders, skills, stores } from "@js/data"
import _ from "lodash"


Macro.add('dataEditorMacro', {
    skipArgs: false,
    handler: function () {
        let metaMap = getPropMeta([], attacks)
        let $button = $('<button/>').wiki('Copy JSON').click(()=>{
            navigator.clipboard.writeText(`${JSON.stringify(metaMap)}`);
        })
        
        $button.appendTo(this.output)
    }
})

function getPropMeta(metaMap, obj, propName) {
    let currPropMeta = { name: ``, propName: ``, type: ``, children: [] }
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
