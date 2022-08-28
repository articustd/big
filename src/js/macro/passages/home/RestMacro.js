import { advanceTime, restockStore } from "@controller/TimeController";
import { logger } from "@util/Logging";

Macro.add('restMacro', {
    skipArgs: false,
    handler: function () {
        let { player } = variables()

        restockStore(7)
        
        player.digest()
        variables().restText = player.levelUp()
        player.rest()

        advanceTime()

        if (variables().restText === '')
            variables().restText = `You feel rested and rejuvenated!<br/>`
    }
})