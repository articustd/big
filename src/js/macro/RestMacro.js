import { digest } from "@controller/character/CapacityController";
import { levelUp, rest } from "@controller/character/CharacterController"
import { advanceTime, restockStore } from "@controller/TimeController";
import { logger } from "@util/Logging";

Macro.add('restMacro', {
    skipArgs: false,
    handler: function () {
        let { level, visible } = this.args
        let { player } = variables()

        restockStore(7)

        digest(player)

        variables().restText = ''
        levelUp(player)

        rest(player)
        advanceTime()

        // if (!visible) {
        //     if (level) {
        //         if (levelUp(player))
        //             variables().restText = "You feel the effects of your experience"
        //         else
        //             variables().restText = `You feel rested and rejuvenated!`
        //     }

        //     rest(player)
        //     advanceTime(true)
        // }
    }
})