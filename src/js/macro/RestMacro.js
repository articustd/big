import { getMaxHealth } from "@controller/character/CharacterController"
import { advanceTime } from "@controller/TimeController";

Macro.add('restMacro', {
    skipArgs: false,
    handler: function () {
        let levelUp = this.args[0]
        let visible = this.args[1]
        let player = State.variables.player;

        if (!visible) {
            if (levelUp) {
                let leveled = false
                Object.entries(player.exp).forEach(([stat, value]) => {
                    if (value !== 0) {
                        let statMap = statMapping(stat)
                        if (statMap.length == 1)
                            player[statMap[0]] += value

                        if (statMap.length == 2)
                            player[statMap[0]][statMap[1]] += value

                        player.exp[stat] = 0

                        leveled = true
                    }
                });
                if (leveled) {
                    State.variables.restText = "You feel the effects of your experience"

                }
                else
                    State.variables.restText = `You feel rested and rejuvenated!`
            }
            player.stats.maxHlth = getMaxHealth(player)

            player.stats.hlth = player.stats.maxHlth;
            capacityChange(player)
            
            advanceTime(true)
        }
    }
})

function statMapping(stat) {
    switch (stat) {
        case 'muscle':
            return ['stats', 'strg']
        case 'fat':
            return ['measurements', 'bodyFat']
        case 'size':
            return ['measurements', 'height']
        case 'skill':
            return ['skillPoints']
        case 'pawEye':
            return ['stats', 'acc']
        case 'agility':
            return ['stats', 'dex']
    }
}

function capacityChange(player) {
    for (let cap in player.capacity) {
        if (!cap.contains("Max") && player.capacity[cap] > 0) {
            player.capacity[`${cap}Max`] += Math.min(Math.ceil(player.capacity[cap]), player.capacity[`${cap}Max`]) / 4
            player.capacity[cap] = 0
        }
    }
}