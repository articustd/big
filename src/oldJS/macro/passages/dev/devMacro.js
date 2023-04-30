import { logger } from "@util/Logging"
import { stateEditor } from "@util/StateEditor"

Macro.add('devMacro', {
    skipArgs: false,
    handler: function () {
        logger($('#stateEditor').length)

        let $stateEditor = $('<button/>').wiki('State Editor').click(() => {
            if ($('#stateEditor').length == 0)
                stateEditor()
        })

        $stateEditor.appendTo(this.output)

    }
})