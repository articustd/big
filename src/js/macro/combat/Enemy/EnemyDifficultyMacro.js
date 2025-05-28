/**
 * Macro used to convey how difficult a fight will be. Uses total stats to determine.
 * 
 * v0.12.0 - Right now this is pretty rough, needs refinement. Could change this to per stat for a finer grain estimation.
 */

import { getStatTotal } from "@controller/character/CharacterController"

Macro.add('enemyDifficultyMacro', {
    skipArgs: false,
    handler: function () {
        let { player, enemy } = variables()
        let diff = getStatTotal(enemy) - getStatTotal(player)
        let message = 'Appears that this will be a fair fight'

        if(diff < -10)
            message = 'Might not even be worth your time'
        if(diff < -3)
            message = 'Looks like this will be an easier fight than normal'
        if(diff > 3)
            message = 'Might have some trouble with this fight'
        if(diff > 10)
            message = `It's your funeral, I just work here`
            

        $(this.output).wiki(message)
    }
})