import { returnStatName } from "@controller/character/CharacterController"
import { findSize } from "@controller/character/MeasurementController"
import { getExpText } from "@controller/combat/CombatController"
import { getVoreText } from "@js/data/combat/ConsumeTextTable"
import { getReplaceVoreSetting } from "@controller/character/CharacterController"
import _ from "lodash"

Macro.add('consumeMacro', {
    skipArgs: false,
    handler: function () {
        let { enemy, consumeObj, consumeText } = variables()
        let $header = $('<h1/>').wiki(`${consumeObj.consume.method}ing ${enemy.name}`)
        let $body = $('<span/>')
        let $exp = $('<span/>')
        temporary().enemyText = { sizeLC: _.lowerFirst(findSize(enemy.measurements.height)) }

        $body.wiki(getVoreText(consumeObj.sDiff, getReplaceVoreSetting())[consumeObj.consume.method])


        _.each(consumeText, (text) => {
            $exp.append($('<span/>'))
        })
        
        $header.appendTo(this.output)
        //$('<br>').appendTo(this.output)
        $body.appendTo(this.output)
        $exp.appendTo(this.output)
    }
})

