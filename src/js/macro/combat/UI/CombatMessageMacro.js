import { logger } from "@util/Logging"

Macro.add('combatMessageMacro', {
    skipArgs: false,
    handler: function () {
        let [combatLog, topBottom] = this.args

        $(this.output).css({ 'display':'flex', 'position': 'absolute', 'border': '1px solid', 'border-radius':'3px', 'width': '90%', 'justify-content': 'center', 'text-align': 'center', 'z-index': '-1', [topBottom]: 'calc(100% - 1px)' })

        if (combatLog) {
            $(this.output).append(_.last(combatLog))
        } else
            $(this.output).css({'display':'none'})
    }
})
