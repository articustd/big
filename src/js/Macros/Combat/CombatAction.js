import { Character } from "@GameObjects/Character/Character";
import { logger } from "@Utils/Logging";

Macro.add('CombatAction', {
    skipArgs: false,
    handler: function () {
        let attack = this.args[0]
        let $attackBtn = $('<button/>').wiki(attack.name)

        logger('The attack')
        logger(attack)
        logger(attack.owner)

        $attackBtn.appendTo(this.output)
    }
})