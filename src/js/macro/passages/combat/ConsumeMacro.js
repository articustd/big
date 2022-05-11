import { returnStatName } from "@controller/character/CharacterController"
import { findSize } from "@controller/character/MeasurementController"
import { getExpText } from "@controller/combat/CombatController"
import { largerText, muchLargerText, muchSmallerText, sameText, smallerText } from "@js/data/combat/ConsumeTextTable"
import _ from "lodash"

Macro.add('consumeMacro', {
    skipArgs: false,
    handler: function () {
        let { enemy, consumeObj, consumeText } = variables()
        let $header = $('<h1/>').wiki(`${consumeObj.consume.method}ing ${enemy.name}`)
        let $body = $('<span/>')
        let $exp = $('<span/>')
        temporary().enemyText = { sizeLC: _.lowerFirst(findSize(enemy.measurements.height)) }

        if (consumeObj.consume.method !== 'Eat')
            $body.wiki(consumeObj.consume.desc)
        else {
            switch (consumeObj.sDiff) {
                case 2:
                    $body.wiki(muchSmallerText[consumeObj.consume.method])
                    break
                case 1:
                    $body.wiki(smallerText[consumeObj.consume.method])
                    break
                case 0:
                    $body.wiki(sameText[consumeObj.consume.method])
                    break
                case -1:
                    $body.wiki(largerText[consumeObj.consume.method])
                    break
                case -2:
                    $body.wiki(muchLargerText[consumeObj.consume.method])
                    break
            }
        }

        _.each(consumeText, (text) => {
            $exp.append($('<span/>').wiki(text + '<br>'))
        })

        $header
            .appendTo(this.output)
        $('<br>')
            .appendTo(this.output)
        $body
            .appendTo(this.output)
        $('<br><br>')
            .appendTo(this.output)
        $exp
            .appendTo(this.output)
    }
})

