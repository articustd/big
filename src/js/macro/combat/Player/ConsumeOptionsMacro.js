import { logger } from "@util/Logging"
import { popup } from "@util/ModalPopup";
import { combatReset } from "@controller/combat/CombatController";
import { infoBubble } from "@util/UISugar";
import _ from "lodash";
import { isOverMaxCapacity } from "@controller/character/CapacityController";
import { consumeEntity, reducePreyObject } from "@controller/character/ConsumeController";

/**
 * Macro used for consume options when a player wins combat.
 * 
 * @type {Array} [Entity player is consuming]
 */

Macro.add('consumeEnemy', {
    skipArgs: false,
    handler: function () {
        let prey = reducePreyObject(this.args[0])
        let { player, settings: { skip, warning }, return: passageReturn } = variables()

        let consume = [
            { method: 'Eat', gen: '', desc: `You shove the enemy down your gullet.`, capacity: 'stomach' },
            { method: 'Anal', gen: '', desc: `You shove the enemy up your hole`, capacity: 'stomach' },
            { method: 'Unbirth', gen: 'vagina', desc: `You shove the enemy up your lady bits.`, capacity: 'womb' },
            { method: 'Urethral', gen: 'penis', desc: `You shove the enemy in your man bits`, capacity: 'testi' }
        ]

        _.each(consume, (con) => {
            if (con.gen === '' || player.gender[con.gen]) {
                let $conBtn = $('<button/>')
                    .addClass('combat-actions-button full-width')
                    .wiki(con.method)
                    .click(() => {
                        if (warning.overConsumeWarning && isOverMaxCapacity(player, prey.capacityAmount, con.capacity))
                            popup(`Over Capacity`,
                                `You are about to go over your max capacity. If you continue you will be attacked randomly until you rest at home. <br><br>Do you wish to consume?`,
                                {
                                    "Yes": () => { consumeEntity(con, player, prey) },
                                    "No": false
                                },
                                { type: "warning", name: "overConsumeWarning" }
                            )
                        else
                            consumeEntity(con, player, prey)
                    })                    
                
                //Add the exclamation mark to the button, much more user friendly than a popup
                if(isOverMaxCapacity(player, prey.capacityAmount, con.capacity))
                    $conBtn.append("<i class='fa fa-exclamation-triangle consume-alert blinking'></i>")

                $(this.output).append($conBtn)
            }
        })
        let $fastConsume = $('<div/>').append(
            $('<label/>').wiki(`Fast Consume `).addClass('combat-fast-consume-label').prepend(
                $(`<input id="fastConsume" type="checkbox" ${skip.consumeText ? 'checked' : ''}/>`)
                    .on('input', function (e) {
                        skip.consumeText = $(this)[0].checked
                    })
            ).append(infoBubble(`Skips over consume text.`))
        ).addClass('combat-fast-consume')

        let $leaveBtn = $('<button/>')
            .wiki('Leave')
            .addClass('combat-actions-button full-width combat-actions-leave')            
            .click(() => {
                combatReset()
                Engine.play(passageReturn)
            })

        $(this.output).append($leaveBtn)
        $(this.output).append($fastConsume)
    }
})