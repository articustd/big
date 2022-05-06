import { genChar, statPoints } from "@controller/character/CharacterController"
import { calcWeight } from "@controller/character/MeasurementController";
import { rollItems } from "@controller/character/ItemController";
import { skills, species } from "@js/data";
import { logger } from "@util/Logging";

Macro.add('enemyMacro', {
    skipArgs: false,
    handler: function () {
        let minSize = this.args[0]
        let maxSize = this.args[1]
        variables().fightHeader = this.args[2]
        let player = variables().player;
        let enemy = genChar(statPoints(player), random(0, species.length - 1), [minSize, maxSize], [0, 4], random(0, 6));
        variables().combat = true
        variables().enemy = enemy
        // checkWilling(player.skills, enemy)
    }
})

function checkWilling(playerSkills, enemy) {
    let player = variables().player
    if (checkIntimidation(player, enemy)) {
        let willing = Math.floor(Math.log10(player.measurements.height) - Math.log10(enemy.measurements.height))
        willing = willing > 0 ? willing : 1

        for (let skillId of playerSkills) {
            let skill = skills[skillId]
            logger(skill)
            if (skill.type === 'ability')
                if (skill.subType === 'willing')
                    willing += skill.mod
        }
        let rand = random(1, 100)
        if (rand <= willing) {
            variables().win = true
            variables().combat = false
            variables().foundItems = rollItems(variables().enemy.loot, variables().enemy.credits)
            variables().enemyCombatLog = [`${variables().enemy.name} has submitted and is willing`]
            variables().willing = true
        }
    }
}

function checkIntimidation(player, enemy) {
    if (player.measurements.height > enemy.measurements.height)
        return true

    for (let cap in player.capacity)
        if (cap.contains("Max") && player.capacity[cap] > calcWeight(enemy.measurements))
            return true

    return false
}