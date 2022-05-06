import { logger } from "@util/Logging"

Macro.add('combatMessageMacro', {
    skipArgs: false,
    handler: function () {
        let combatLog = this.args[0]
        let topBottom = this.args[1]

        $(this.output).css({ 'display':'flex', 'position': 'absolute', 'border': '1px solid', 'border-radius':'3px', 'width': '90%', 'justify-content': 'center', 'z-index': '-1' })
        logger(topBottom)
        if(topBottom === 'top')
            $(this.output).css({ 'top': 'calc(100% - 1px)' })
        else
            $(this.output).css({ 'bottom': 'calc(100% - 1px)' })

        if (combatLog) {
            $(this.output).append(_.last(combatLog))
        } else
            $(this.output).css({'display':'none'})
    }
})
