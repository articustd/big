Macro.add('combatReset', {
    skipArgs: true,
    handler: function () {
        delete State.variables.enemyHitDmg
        delete State.variables.enemyHitText
        delete State.variables.foundItems
        delete State.variables.playerHitDmg
        delete State.variables.playerHitText

        State.variables.combat = false;
        State.variables.win = false;
    }
})