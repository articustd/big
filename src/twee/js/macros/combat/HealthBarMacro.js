Macro.add('healthBarMacro', {
    skipArgs: false,
    handler: function () {
        let character = this.args[0]
        
        let $healthBar = $('<div/>')
                            .addClass(`healthBar`)
        let $currentHealthBar = $('<div/>')
                    .addClass('currentHealthBar')
                    .css('width', `${Math.floor((character.stats.hlth/character.stats.maxHlth)*100)}%`)
        let $currentHealthText = $('<div/>')
                    .addClass('currentHealthText')
                    .text(`${character.stats.hlth}/${character.stats.maxHlth}`)
        
        if(this.args[1])
            $healthBar.css('float', this.args[1])

        $healthBar
            .attr('id', `macro-${this.name}`)
            .append($currentHealthBar)
            .append($currentHealthText)
            .appendTo(this.output)
    }
})
