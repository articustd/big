import { logger } from "@util/Logging"

Macro.add('combatMessageMacro', {
    skipArgs: false,
    handler: function () {
        let [combatLog, topBottom] = this.args
        
        //Results in adding class combat-message-top or -bottom as a CSS class along with combat-message
        let $container = $('<div/>').addClass('combat-message combat-message-' + [topBottom] ) 

        if (combatLog) {
            $container.append(_.last(combatLog))
        } else
            $container.css({'display':'none'})

        $(this.output).append($container)
    }
})
