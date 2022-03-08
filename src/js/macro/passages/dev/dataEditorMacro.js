import { logger } from "@util/Logging"
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import * as data from "@js/data"
import * as dataMap from '@js/data/dataMaps'
import _ from "lodash"
import { getPropMeta } from "@util/DataMapping"


Macro.add('dataEditorMacro', {
    skipArgs: false,
    handler: function () {
        let $label = $(`<label for="dataMapDropDown"/>`).wiki(`Data Map: `)
        let $dropDown = $(`<select id="dataMapDropDown" name="dataMapDropDown"/>`)

        let $wrapper = $('<div/>').append($label).append($dropDown).css({ width: '100%', "margin-bottom": '10px' })
        $wrapper.appendTo(this.output)
        $dropDown.selectmenu({
            width: 200
        })
        logger(dataMap)
        _.each(dataMap, (val, key) => {
            // logger(val)
            $dropDown.append($('<option/>').wiki(val.name))
            logger(key)
            logger(val)
        })

        $dropDown.selectmenu("refresh")


        // Use this to get the meta map of a data store
        // let metaMap = getPropMeta([], attacks)
        // let $button = $('<button/>').wiki('Copy JSON').click(()=>{
        //     navigator.clipboard.writeText(`${JSON.stringify(metaMap)}`);
        // })

        // $button.appendTo(this.output)
    }
})