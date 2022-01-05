Macro.add('playerFluffMacro', {
    skipArgs: false,
    handler: function () {
        let player = State.variables.player
        // let playerHeight = heightMeasurements(player.measurements.height,State.variables.imperial)
        console.log(findMuscle(player.stats.strg))

        State.variables.playerHeightText = convertToLargerUnits(player.measurements,State.variables.imperial).heightText
        State.variables.playerSize = lowercaseFirstLetter(findSize(player.measurements.height))
        State.variables.playerSpecies = lowercaseFirstLetter(player.species)
        State.variables.playerGender = lowercaseFirstLetter(player.gender.type)
    }
})

function lowercaseFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}