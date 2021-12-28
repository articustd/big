Macro.add('enemyMacro', {
    skipArgs: false,
    handler: function () {
        let minSize = this.args[0]
        let maxSize = this.args[1]
        let player = State.variables.player;
        State.variables.enemy = genChar(statPoints(player),random(0,species.length-1),[minSize,maxSize],[0,4],random(0,6));
        State.variables.combat = true
    }
})

function statPoints(player) {
    return (player.stats.strg + player.stats.con + player.stats.dex + player.stats.acc)/4
}