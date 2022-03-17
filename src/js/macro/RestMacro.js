import { levelUp, rest } from "@controller/character/CharacterController"
import { advanceTime } from "@controller/TimeController";
import { logger } from "@util/Logging";

Macro.add('restMacro', {
    skipArgs: false,
    handler: function () {
        let level = this.args[0]
        let visible = this.args[1]
        let player = variables().player;

        if (!visible) {
            if (level) {                
                if (levelUp(player))
                    variables().restText = "You feel the effects of your experience"
                else
                    variables().restText = `You feel rested and rejuvenated!`
            }
            
            rest(player)
            advanceTime(true)
        }
    }
})