Macro.add('restMacro', {
    skipArgs: false,
    handler: function () {
        // if (this.args.length < 1) {
        //     var errors = [];
        //     if (this.args.length < 1) { errors.push('Var 1 Missing') }
        //     if (this.args.length < 2) { errors.push('Var 2 Missing') }
        //     return this.error(`${errors[0]}  ${errors.length == 2 ? "and " + errors[1] : ""}`)
        // }
        // Args: LevelUp - Boolean, Visible - Boolean

        let levelUp = this.args[0]
        let visible = this.args[1]
        let player = State.variables.player;

        if (!visible) {
            player.stats.hlth = player.stats.maxHlth;

            if (levelUp) {
                let leveled = false
                Object.entries(player.exp).forEach(([stat, value]) => {
                    if (value > 0) {
                        let statMap = statMapping(stat)
                        if (statMap.length == 1) {
                            player[statMap[0]] += value
                        }
                        if (statMap.length == 2) {
                            player[statMap[0]][statMap[1]] += value
                        }
                        player.exp[stat] = 0
                        
                        leveled = true
                    }
                });
                
                if(leveled) {
                    State.variables.restText = "You feel the effects of your experience"
                }
                State.variables.restText = `You feel rested and rejuvenated!`
            }

            advanceTime(true)
        }
    }
})

function statMapping(stat) {
    switch (stat) {
        case 'muscle':
            return ['stats', 'strg']
        case 'fat':
            return ['measurements', 'weight']
        case 'size':
            return ['measurements', 'height']
        case 'skill':
            return ['skillPoints']
        case 'pawEye':
            return ['stats', 'acc']
        case 'agility':
            return ['stats', 'dex']
    }
}