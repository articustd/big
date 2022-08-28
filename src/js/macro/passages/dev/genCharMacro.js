import { logger } from "@util/Logging";
import { getPronounId } from "@js/controllers/character/PronounController";
import { Character } from "@js/objects/Character";

Macro.add('genCharMacro', {
    skipArgs: false,
    handler: function () {
        let $wrapper = $('#test')
        let [sizeName, speciesName, pronoun, genderName, bodyTypeName] = this.args
        let pronounId = getPronounId(pronoun)
        
        variables().enemy = new Character({
            sizeName, bodyTypeName, speciesName, genderName, pronounId, isPlayer: false
        })

        logger(new Character())
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
        $wrapper.append($('<span/>').wiki(`Constitution: ${variables().enemy.stats.con}<br/>`))
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