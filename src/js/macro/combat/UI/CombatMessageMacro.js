import { logger } from "@util/Logging"

Macro.add('combatMessageMacro', {
    skipArgs: false,
    handler: function () {
        let [combatLog, topBottom] = this.args

        let $container = $('<div/>').css({ 'display':'flex', 'position': 'absolute', 'border': '1px solid', 'border-radius':'3px', 'width': '90%', 'justify-content': 'center', 'text-align': 'center', 'z-index': '-1', [topBottom]: 'calc(100% - 1px)' })

        if (combatLog) {
            $container.append(_.last(combatLog))
        } else
            $container.css({'display':'none'})

        $(this.output).append($container)
    }
})
