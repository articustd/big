Macro.add('enemyDifficultyMacro', {
    skipArgs: false,
    handler: function () {
        let { player, enemy } = variables()
        let diff = getStatTotal(enemy) - getStatTotal(player)
        let message = 'Appears that this will be a fair fight'

        if(diff < -10)
            message = 'Might not even be worth your time'
        if(diff < -3)
            message = 'Looks like this will be an easier fight than normal'
        if(diff > 3)
            message = 'Might have some trouble with this fight'
        if(diff > 10)
            message = `It's your funeral, I just work here`
            

        $(this.output).wiki(message)
    }
})

function getStatTotal({ stats: { strg, dex, con } }) {
    return strg + dex + con
}