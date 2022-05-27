import { digest } from "@controller/character/CapacityController";
import { levelUp, rest } from "@controller/character/CharacterController"
import { advanceTime, restockStore } from "@controller/TimeController";
import { logger } from "@util/Logging";

Macro.add('restMacro', {
    skipArgs: false,
    handler: function () {
        let { player } = variables()

        restockStore(7)
        
        digest(player)

        variables().restText = levelUp(player)

        rest(player)
        advanceTime()

        if (variables().restText === '')
            variables().restText = `You feel rested and rejuvenated!<br/>`
    }
})