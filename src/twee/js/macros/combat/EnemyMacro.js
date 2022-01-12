Macro.add('enemyMacro', {
    skipArgs: false,
    handler: function () {
        let minSize = this.args[0]
        let maxSize = this.args[1]
        let player = State.variables.player;
        State.variables.enemy = genChar(statPoints(player),random(0,species.length-1),[minSize,maxSize],[0,4],random(0,6));
        State.variables.combat = true

        checkWilling(player.skills)
    }
})

function checkWilling(playerSkills) {
    for(let skillId of playerSkills) {
        let skill = skills[skillId]

        if(skill.type === 'ability') {
            if(skill.subType === 'willing') {
                let rand = random(1,100)
                if(rand <= skill.mod) {
                    State.variables.win = true
                    State.variables.combat = false
                    State.variables.foundItems = rollItems(State.variables.enemy.loot, State.variables.enemy.credits)
                    State.variables.enemyCombatLog = [`${State.variables.enemy.name} has submitted and is willing`]
                    State.variables.willing = true
                }
            }
        }
    }
}