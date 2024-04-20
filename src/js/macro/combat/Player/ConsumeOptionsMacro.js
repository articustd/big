import { logger } from "@util/Logging"
import { calcWeight, sizeDiff } from "@controller/character/MeasurementController"
import { popup } from "@util/ModalPopup";
import { combatReset, getExpText } from "@controller/combat/CombatController";
import { infoBubble } from "@util/UISugar";
import _ from "lodash";
import { collectCapacity } from "@controller/character/CapacityController";

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
                                    "Yes": () => { consumeContinue(con, player, prey) },
                                    "No": false
                                },
                                { type: "warning", name: "overConsumeWarning" }
                            )
                        else
                            consumeContinue(con, player, prey)
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

        //$(this.output).addClass('combat-buttons-wrapper')
    }
})

function reducePreyObject({ name, species, exp, capacityAmount, measurements }) {
    return { name, species, exp, capacityAmount, measurements }
}

function calcConsume(prey, response = {}) {
    for (let points in prey.exp) {
        let point = randPoints(prey.exp[points])
        if (point > 0) response[points] = point
    }

    return response;
}

function randPoints(range) {
    return (Array.isArray(range)) ? random(range[0], range[1]) : range
}

function addCapacity(hunter, prey, capType) {
    hunter.capacity[capType].push(prey)
}

function isOverMaxCapacity(player, amt, capType) {
    return (collectCapacity(player, capType) + amt) >= player.capacity[`${capType}Max`]
}

function consumeContinue(con, player, prey) {
    let consumeObj = { consume: con, points: calcConsume(prey), sDiff: sizeDiff(player, prey) }

    // This needs to be here to prevent players from repeatedly getting exp by refreshing
    addCapacity(player, prey, consumeObj.consume.capacity)
    variables().consumeObj = consumeObj

    variables().consumeText = _.map(getExpText(consumeObj.points), (text) => {
        return text
    })

    // variables().consumeText.push(`Filled your ${con.capacity} by ${prey.capacityAmount} point${prey.capacityAmount > 1 ? 's' : ''}`)

    if (variables().settings.skip.consumeText) {
        combatReset()
        Engine.play(variables().return)
    } else
        Engine.play("consume")
}