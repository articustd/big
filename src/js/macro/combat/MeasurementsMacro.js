Macro.add('measurementsMacro', {
    skipArgs: false,
    handler: function () {
        let character = this.args[0]
        let $wrapper = $('<div/>')

        $wrapper.append($('<div/>').wiki(`Height: ${character.stats.strg}`))
        $wrapper.append($('<div/>').wiki(`Weight: ${character.stats.dex}`))
        if (character.gender.penis)
            $wrapper.append($('<div/>').wiki(`Penis Size: ${character.gender.penis}`))
        if (character.gender.balls)
            $wrapper.append($('<div/>').wiki(`Testicle Size: ${character.gender.balls}`))
        if (character.gender.breasts)
            $wrapper.append($('<div/>').wiki(`Breast Size: ${character.gender.breasts}`))

        $wrapper.appendTo(this.output)
    }
})
