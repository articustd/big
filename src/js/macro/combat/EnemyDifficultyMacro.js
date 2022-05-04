Macro.add('enemyDifficultyMacro', {
    skipArgs: false,
    handler: function () {
        let { player, enemy } = variables()
        let diff = getStatTotal(enemy) - getStatTotal(player)
        let message =''

        if(diff < -3)
            message = 'Looks like this will be an easier fight than normal'
        else if(diff > 3)
            message = 'Might have some trouble with this fight'
        else
            message = 'Appears that this will be a fair fight'

        $(this.output).wiki(message)
    }
})

function getStatTotal({ stats: { strg, dex, con } }) {
    return strg + dex + con
}