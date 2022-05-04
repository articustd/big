Macro.add('enemyDescriptionMacro', {
    skipArgs: false,
    handler: function () {
        let { enemy } = variables()
        let message = `A ?eHeight tall ?eSpecies weighing in at ?eWeight.`
        message += `<br/>They have ?eMuscle muscles and ?eFatSingular ?eFat amount of fat` 
        // message += `<br/> They are equipped with ${collectGenitals(enemy)}.`

        $(this.output).wiki(message)
    }
})

function collectGenitals({ gender: { penis, balls, vagina, breasts } }, genitalArr = []) {
    if (penis)
        genitalArr.push(`a ?ePenis sized penis`)
    if (balls)
        genitalArr.push(`?eBalls sized testicles`)
    if (vagina)
        genitalArr.push(`a moist slit`)
    if (breasts)
        genitalArr.push(`?eBreast Cup breasts`)

    if (genitalArr.length > 1)
        genitalArr[genitalArr.length-1] = 'and ' + genitalArr[genitalArr.length-1]

    return (genitalArr.length > 2) ? genitalArr.join(", ") : genitalArr.join(" ")
}