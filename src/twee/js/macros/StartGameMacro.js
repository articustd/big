Macro.add('startGameRoutine', {
    skipArgs: true,
    handler: function () {
        let player = State.variables.player;
        let speciesKey = species.indexOf(player.species)
        let sizeKey = findObjIdx(player.size, sizes)
        let bodyTypeKey = findObjIdx("Normal", bodyTypes)
        let genderKey = findObjIdx(player.gender, genders)
        
        State.variables.player = genChar(10,speciesKey,sizeKey,bodyTypeKey,genderKey,player.name)
    }
})

function findObjIdx(item, arr) {
    let response;
    arr.forEach(function(el, idx) {
        if(Object.keys(el)[0] === item)
            response = idx
    })
    return response
}