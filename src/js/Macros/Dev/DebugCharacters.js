import { logger } from "@Utils/Logging";
import { getScene } from "@js/GameEngine/GameCore";

Macro.add('DebugCharacters', {
    skipArgs: false,
    handler: function () {
        let mainLoop = getScene('MainLoop')
        let defaultData = {stats:{muscle: 5, fat: 5, pawEye: 5, size: 5}, capacity:1, equippedAttacks: ['Scratch']}
        
        mainLoop.createCharacter({name: `Player`, ...defaultData}, true)
        mainLoop.createCharacter({name: `Enemy`, ...defaultData})
        // variables().player = new Character({name: `Player`, ...defaultData})
        // variables().enemy = new Character({name: `Enemy`, ...defaultData})

        // variables().player.loadAttacks()
        // variables().enemy.loadAttacks()
        // logger(variables().player)
        // logger(variables().enemy)
        logger(mainLoop)
    }
})