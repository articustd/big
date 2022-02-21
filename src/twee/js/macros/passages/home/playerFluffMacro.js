Macro.add('playerFluffMacro', {
    skipArgs: false,
    handler: function () {
        let player = State.variables.player
        let $wrapper = $('<span/>')
        let $general = $('<span/>')
        let $upperBody = $('<span/>')
        let $lowerBody = $('<span/>')
        let $allAround = $('<span/>')

        let playerSize = lowercaseFirstLetter(findSize(player.measurements.height))
        let playerHeightText = convertToLargerUnits(player.measurements, State.variables.imperial).heightText
        let playerWeightText = convertToLargerUnits(player.measurements, State.variables.imperial).weightText
        let playerMuscle = findMuscle(player.stats.strg)
        let playerMuscleKey = Object.keys(playerMuscle)[0]
        let playerFat = findFat(player.measurements.bodyFat)
        let playerFatKey = Object.keys(playerFat)[0]
        $general
            .text(`Your ${playerSize} ${playerHeightText} frame is supporting ${playerMuscle[playerMuscleKey].singular} ${lowercaseFirstLetter(playerMuscleKey)} amount of muscles and ${playerMuscle[playerMuscleKey].singular} ${lowercaseFirstLetter(playerFatKey)} amount of body fat. With your muscles and fat, your total weight comes out to ${playerWeightText}.`)
            .append('<br><br>')

        $upperBody
            .text(`Your chest sports ${getBreastText(player)}${playerMuscle[playerMuscleKey].pecs} pectoral muscles. 
                    Looking at your arms, ${playerMuscle[playerMuscleKey].arms}. 
                    With your ${lowercaseFirstLetter(playerMuscleKey)} amount of muscles, your arms ${playerMuscle[playerMuscleKey].armsSecond}. 
                    Looking down at your stomach ${checkAbs(playerFat[playerFatKey],playerFatKey,playerMuscle[playerMuscleKey],playerMuscleKey)}.`)
            .append('<br><br>')

        // logger(playerMuscle)

        $lowerBody // Ok, kinda done
            .text(`Your eyes and paws work their way down to explore below your waist. ${collectGenitals(player)}`)//the only equipment you find are your weak looking legs and a vagina.`)
            .append('<br><br>')

        $allAround
            .text(`All around you are a ${playerSize} looking ${lowercaseFirstLetter(player.gender.type)} ${lowercaseFirstLetter(player.species)}.`)

        $wrapper
            .append($general)
            .append($upperBody)
            .append($lowerBody)
            .append($allAround)
            .appendTo(this.output)
    }
})

function lowercaseFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

function getBreastText(character) {
    if (character.gender.breasts)
        return `${findBreastSize(character)} cup breasts and `
    return ``
}

function collectGenitals(character) {
    let penis = character.gender.penis, balls = character.gender.balls, vagina = character.gender.vagina;

    if (penis)
        penis = `You take your ${lowercaseFirstLetter(findPenisSize(character))} sized member in your paw. `
    if (balls) {
        balls = `Slowly moving your paws down to your ${lowercaseFirstLetter(findBallSize(character))} sized orbs you roll them around and emit a small purr of approval. `
        if (penis)
            balls = `Underneath your ${lowercaseFirstLetter(findPenisSize(character))} member you roll your ${lowercaseFirstLetter(findBallSize(character))} sized testicles in your paws. `
    }
    if (vagina) {
        vagina = `You find a pert vagina. Taking your fingers you spread your wet lips and slip one in. A moan escapes your muzzle and you snap back to reality as you pull your paw away.`
        if (penis)
            vagina = `Lifting up your ${lowercaseFirstLetter(findPenisSize(character))} sized member you find a pert vagina. `
        if (balls)
            vagina = `Lifting up your ${lowercaseFirstLetter(findBallSize(character))} sized orbs you find a pert vagina. `
    }

    return `${penis ? penis : ''}${balls ? balls : ''}${vagina ? vagina : ''}`
}

function checkAbs(fat,fatKey,muscle,muscleKey) {
    if(fat.showAbs)
        return `${fat.stomach} ${muscle.abs}`
    if(!fat.showAbs && muscle.muscleGut)
        return `you see a ${lowercaseFirstLetter(fatKey)} muscle gut`
    return `${fat.stomach}`
}