import { getScene } from "@js/GameEngine/GameCore"
import { logger } from "@js/Utils/Logging"

Macro.add('HealthBar', {
    skipArgs: false,
    handler: function () {
        let mainLoop = getScene('MainLoop')
        let character = this.args[0] ? mainLoop.player : mainLoop.enemy
        
        let align = this.args[1] ? 'left' : 'right'

        let $healthBar = $('<div/>')
            .addClass(`statusBar`)
            .css(`margin-${align}`, 'auto')
        let $currentHealthBar = $('<div/>')
            .addClass('currentHealthBar')
            .css('width', `${character.calcHealthPercentage()}%`)
        let $currentHealthText = $('<div/>')
            .addClass('currentStatusText')
            .text(`${character.health}/${character.healthMax}`)

        if (this.args[1])
            $healthBar.css('float', this.args[1])

        $healthBar
            .attr('id', `macro-${this.name}-${character.name}`)
            .append($currentHealthText)
            .append($currentHealthBar)
            .appendTo(this.output)
    }
})