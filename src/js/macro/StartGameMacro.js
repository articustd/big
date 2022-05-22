import { species, measurements, genders } from '@js/data'
import { getPronounId } from '@controller/character/PronounController'
import { genChar } from '@controller/character/CharacterController'
import { logger } from '@util/Logging'

Macro.add('startGameRoutine', {
    skipArgs: true,
    handler: function () {
        let {player} = variables();
        let speciesKey = species.indexOf(player.species)
        let sizeKey = _.findIndex(measurements.sizes, {'name': player.size})
        let bodyTypeKey = findObjIdx("Normal", measurements.bodyTypes)
        let pronounKey = getPronounId(player.pronouns)
        let genderKey = findObjIdx(player.gender, genders)

        variables().player = genChar(15, speciesKey, sizeKey, bodyTypeKey, genderKey, player.name, pronounKey)
    }
})

function findObjIdx(item, arr) {
    let response;
    arr.forEach(function (el, idx) {
        if (Object.keys(el)[0] === item)
            response = idx
    })
    return response
}