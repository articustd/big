Macro.add('healthBarMacro', {
    skipArgs: false,
    handler: function () {
        let character = this.args[0]
        let align = this.args[1]
        let $healthBar = $('<div/>')
                            .addClass(`statusBar`)
                            .css(`margin-${align?'left':'right'}`,'auto')
        let $currentHealthBar = $('<div/>')
                    .addClass('currentHealthBar')
                    .css('width', `${Math.clamp(Math.floor((character.stats.hlth/character.stats.maxHlth)*100),0,100)}%`)
        let $currentHealthText = $('<div/>')
                    .addClass('currentStatusText')
                    .text(`${character.stats.hlth}/${character.stats.maxHlth}`)
        
        if(this.args[1])
            $healthBar.css('float', this.args[1])

        $healthBar
            .attr('id', `macro-${this.name}-${character.name}`)
            .append($currentHealthText)
            .append($currentHealthBar)
            .appendTo(this.output)
    }
})
