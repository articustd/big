Macro.add('statsMacro', {
    skipArgs: false,
    handler: function () {
        let character = this.args[0]
        let $wrapper = $('<div/>')

        $wrapper.append($('<div/>').wiki(`Strength: ${character.stats.strg}`))
        $wrapper.append($('<div/>').wiki(`Dexterity: ${character.stats.dex}`))
        $wrapper.append($('<div/>').wiki(`Constitution: ${character.stats.con}`))

        $wrapper.appendTo(this.output)
    }
})
