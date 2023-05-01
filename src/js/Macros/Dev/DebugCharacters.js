import { Character } from "@GameObjects/Character";
import { logger } from "@Utils/Logging";

Macro.add('DebugCharacters', {
    skipArgs: false,
    handler: function () {
        let defaultData = {stats:{muscle: 5, fat: 5, pawEye: 5, size: 5}, capacity:1}
        
        variables().player = new Character({name: `Player`, ...defaultData})
        variables().enemy = new Character({name: `Enemy`, ...defaultData})
    }
})