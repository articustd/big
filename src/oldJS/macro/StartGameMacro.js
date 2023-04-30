import { species, measurements, genders } from '@js/data'
import { getPronounId } from '@controller/character/PronounController'
import { Character } from '@js/objects/Character'

Macro.add('startGameRoutine', {
    skipArgs: true,
    handler: function () {
        let {species: speciesName, size: sizeName, pronouns, gender: genderName, name} = variables().player;
        let pronoun = getPronounId(pronouns)

        variables().player = new Character({
            baseStat: 15,
            speciesName,
            sizeName,
            bodyTypeName: 'Normal',
            genderName,
            pronoun,
            name,
            isPlayer: true
        })
    }
})