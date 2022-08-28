import { migrate } from "@js/migrations"
import { Character } from "@js/objects/Character"
import _ from "lodash"
import { logger } from "./Logging"

export function saveGameData(saveData = {}) {
    return saveData
}

export function loadGameData(save, version) {
    logger(save)
    migrate(save, version)

    _.each(save.state.history, ({ variables }) => {
        hydrateClasses(variables)
    })
}

function hydrateClasses(variables) {
    variables.player = new Character(null, variables.player)
    if (variables.enemy)
        variables.enemy = new Character(null, variables.enemy)
}