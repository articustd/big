Macro.add('combatReset', {
    skipArgs: false,
    handler: function () {
        combatReset()
        if(this.args[0]) {
            loseExp()
            State.variables.player.stats.hlth = 1
        }
    }
})

function combatReset() {
    delete State.variables.enemyHitDmg
    delete State.variables.enemyCombatLog
    delete State.variables.foundItems
    delete State.variables.playerHitDmg
    delete State.variables.combatResults
    delete State.variables.playerCombatLog

    State.variables.combat = false;
    State.variables.win = false;
}

function loseExp() {
    for(let exp in State.variables.player.exp)
        State.variables.player.exp[exp] = 0

    for(let cap in State.variables.player.capacity)
        if(!cap.contains('Max'))
            State.variables.player.capacity[cap] = 0
    
}