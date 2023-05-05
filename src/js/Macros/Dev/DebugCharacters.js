import { Character } from "@GameObjects/Character/Character";
import { logger } from "@Utils/Logging";

Macro.add('DebugCharacters', {
    skipArgs: false,
    handler: function () {
        let defaultData = {stats:{muscle: 5, fat: 5, pawEye: 5, size: 5}, capacity:1, equippedAttacks: ['Scratch']}
        
        variables().player = new Character({name: `Player`, ...defaultData})
        variables().enemy = new Character({name: `Enemy`, ...defaultData})

        variables().player.loadAttacks()
        variables().enemy.loadAttacks()
        logger(variables().player)
        logger(variables().enemy)
    }
})