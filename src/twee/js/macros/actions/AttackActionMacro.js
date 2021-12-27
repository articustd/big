Macro.add('attackAction', {
    skipArgs: false,
    handler: function () {
        let attack = this.args[0];
        let $wrapper = $(document.createElement('span'))
        let $link = $(document.createElement('a'))
        let dmgRange = calcDmgRange(this.args[0],State.variables.player)
        let attackText = `${this.args[0].name } [${dmgRange.minDmg}-${dmgRange.maxDmg}] ${calcHitChance(this.args[0],State.variables.player)}%`

        $link
            .wiki(attackText)
            .ariaClick(function (ev) {
                combatRoll(attack);
                Engine.play(passage(), true)
            })

        $wrapper
            .attr('id',`macro-${this.name}-${this.args.join('').replace(/[^A-Za-z0-9]/g, '')}`)
            .addClass('message-text')
            .append($link)
            .appendTo(this.output);
    }
})