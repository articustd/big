import _ from "lodash"
import { logger } from "@Utils/Logging"
// import { Character } from "@GameObjects/Character/Character"

export function loadGameData(save, version) {
    // logger(save)

    _.each(save.state.history, ({ variables }) => {
        // hydrateClasses(variables)
    })
}


function hydrateClasses(variables) {
    variables.player = new Character(null, variables.player)
    if (variables.enemy)
        variables.enemy = new Character(null, variables.enemy)
}