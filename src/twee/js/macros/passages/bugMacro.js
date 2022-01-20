Macro.add('bugMacro', {
    skipArgs: false,
    handler: function () {
        let player = State.variables.player
        let $wrapper = $('<span/>')
        // let $general = $('<span/>')
        // let $upperBody = $('<span/>')
        // let $lowerBody = $('<span/>')
        // let $allAround = $('<span/>')

        // let playerSize = lowercaseFirstLetter(findSize(player.measurements.height))
        // let playerHeightText = convertToLargerUnits(player.measurements, State.variables.imperial).heightText
        // let playerMuscle = findMuscle(player.stats.strg)
        // let playerMuscleKey = Object.keys(playerMuscle)[0]
        // let playerFat = findFat(player.measurements.bodyFat)
        // let playerFatKey = Object.keys(playerFat)[0]
        // $general
        //     .text(`Your ${playerSize} ${playerHeightText} frame is supporting ${playerMuscle[playerMuscleKey].singular} ${lowercaseFirstLetter(playerMuscleKey)} amount of muscles and ${playerMuscle[playerMuscleKey].singular} ${lowercaseFirstLetter(playerFatKey)} amount of body fat.`)
        //     .append('<br><br>')

        // $upperBody
        //     .text(`Your chest sports ${getBreastText(player)}${playerMuscle[playerMuscleKey].pecs} pectoral muscles. 
        //             Looking at your arms, ${playerMuscle[playerMuscleKey].arms}. 
        //             With your ${lowercaseFirstLetter(playerMuscleKey)} amount of muscles, your arms ${playerMuscle[playerMuscleKey].armsSecond}. 
        //             Looking down at your stomach ${checkAbs(playerFat[playerFatKey],playerFatKey,playerMuscle[playerMuscleKey],playerMuscleKey)}.`)
        //     .append('<br><br>')

        // // logger(playerMuscle)

        // $lowerBody // Ok, kinda done
        //     .text(`Your eyes and paws work their way down to explore below your waist. ${collectGenitals(player)}`)//the only equipment you find are your weak looking legs and a vagina.`)
        //     .append('<br><br>')

        // $allAround
        //     .text(`All around you are a ${playerSize} looking ${lowercaseFirstLetter(player.gender.type)} ${lowercaseFirstLetter(player.species)}.`)

        $wrapper.text(`${JSON.stringify(State.variables.player,)}`)
            // .append($general)
            // .append($upperBody)
            // .append($lowerBody)
            // .append($allAround)
            .appendTo(this.output)
    }
})