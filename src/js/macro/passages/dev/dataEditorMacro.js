import { logger } from "@util/Logging"
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'


Macro.add('dataEditorMacro', {
    skipArgs: false,
    handler: function () {
        

        $('<div/>').wiki('Nothing here yet').appendTo(this.output)
    }
})