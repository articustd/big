import { checkCapacity } from "@controller/character/CapacityController";
import { findSize } from "@controller/character/MeasurementController";
import { incrementTime } from "@controller/TimeController"
import { measurements } from "@js/data";
import { logger } from "@util/Logging";
import _ from "lodash";

Macro.add('timeAction', {
    skipArgs: false,
    tags: null,
    handler: function () {
        let [linkText, passageName, hours, minutes, fightLocation] = this.args
        let { player } = variables()
        let $link = $('<a/>').wiki(linkText)

        $link.click(this.createShadowWrapper(
            () => { // Run payload
                $.wiki(this.payload[0].contents.trim())
            },
            () => { // After payload, either move on or stay in place
                if (passage() === passageName) { // Stay in place and advance time
                    if (temporary().advanceTime) incrementTime(hours, minutes)
                    Engine.play(passageName, true)
                } else { // Move to passage and advance time
                    incrementTime(hours, minutes)
                    if (!checkCapacity(player) && passageName !== 'fight' && _.random(0,100) < 20) { // If full capacity and traveling, 20% random fight chance
                        let sizeIdx = _.findIndex(measurements.sizes, { name: findSize(player.measurements.height) })
                        let upperSize = (sizeIdx + 2) <= (measurements.sizes.length - 1) ? (sizeIdx + 2) : measurements.sizes.length - 1

                        $.wiki(`<<enemyMacro ${sizeIdx} ${upperSize} "${fightLocation}">>`)
                        Engine.play("fight")
                    } else
                        Engine.play(passageName)
                }
            }
        ))

        $(this.output).append($link)
    }
})