Macro.add('combatReset', {
    skipArgs: true,
    handler: function () {
        combatReset()
    }
})

function combatReset() {
    delete State.variables.enemyHitDmg
    delete State.variables.enemyHitText
    delete State.variables.foundItems
    delete State.variables.playerHitDmg
    delete State.variables.playerHitText
    delete State.variables.combatResults
    delete State.variables.playerCombatLog

    State.variables.combat = false;
    State.variables.win = false;
}