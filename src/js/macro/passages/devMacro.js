import { logger } from "@util/Logging"
import { stateEditor } from "@util/StateEditor"

Macro.add('devMacro', {
    skipArgs: false,
    handler: function () {
        logger($('#stateEditor').length)
        if($('#stateEditor').length == 0)
            stateEditor()
    }
})