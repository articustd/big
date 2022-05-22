import { genChar, statPoints } from "@controller/character/CharacterController"
import { logger } from "@util/Logging";
import { genders, measurements } from "@js/data";
import { getPronounId } from "@controller/character/PronounController";

Macro.add('genCharMacro', {
    skipArgs: false,
    handler: function () {
        let $wrapper = $('#test')
        let [size, species, pronoun, gender, bodyType] = this.args
        let { player } = variables()

        let speciesKey = species.indexOf(species)
        let sizeKey = _.findIndex(measurements.sizes, {'name': size})
        let bodyTypeKey = findObjIdx(bodyType, measurements.bodyTypes)
        let pronounKey = getPronounId(pronoun)
        let genderKey = findObjIdx(gender, genders)
        
        variables().enemy = genChar(statPoints(player), speciesKey, sizeKey, bodyTypeKey, genderKey)
        $wrapper.empty()

        $wrapper.append($('<span/>').wiki(`!!?eName<br/>`))
        $wrapper.append($('<span/>').wiki(`!!!Gender<br/>`))
        $wrapper.append($('<span/>').wiki(`Penis: ?EPenis<br/>`))
        $wrapper.append($('<span/>').wiki(`Balls: ?EBalls<br/>`))
        $wrapper.append($('<span/>').wiki(`Breast: ?eBreast<br/>`))
        $wrapper.append($('<span/>').wiki(`Vagina: ${variables().enemy.gender.vagina}<br/>`))
        $wrapper.append($('<span/>').wiki(`!!!Stats<br/>`))
        $wrapper.append($('<span/>').wiki(`Health: ${variables().enemy.stats.hlth}<br/>`))
        $wrapper.append($('<span/>').wiki(`Strength: ${variables().enemy.stats.strg}<br/>`))
        $wrapper.append($('<span/>').wiki(`Consititution: ${variables().enemy.stats.con}<br/>`))
        $wrapper.append($('<span/>').wiki(`Dexterity: ${variables().enemy.stats.dex}<br/>`))
        $wrapper.append($('<span/>').wiki(`!!!Measurements<br/>`))
        $wrapper.append($('<span/>').wiki(`Height: ?eHeight<br/>`))
        $wrapper.append($('<span/>').wiki(`Weight: ?eWeight<br/>`))
        $wrapper.append($('<span/>').wiki(`Body Fat: ${variables().enemy.measurements.bodyFat}<br/><br/>`))
        $wrapper.append($('<span/>').wiki(`!!!EXP<br/>`))
        $wrapper.append($('<span/>').wiki(`Size: ${variables().enemy.exp.size}<br/>`))
        $wrapper.append($('<span/>').wiki(`<<enemyDescriptionMacro>>`))
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