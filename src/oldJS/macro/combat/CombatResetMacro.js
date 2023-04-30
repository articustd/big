import { combatReset, loseExp } from "@controller/combat/CombatController"

Macro.add('combatReset', {
    skipArgs: false,
    handler: function () {
        combatReset()
        if (this.args[0]) {
            loseExp()
            variables().player.stats.hlth = 1
        }
    }
})