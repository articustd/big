import { logger } from "@util/Logging"
import { calcWeight, sizeDiff } from "@controller/character/MeasurementController"
import { popup } from "@util/ModalPopup";
import { combatReset, getExpText } from "@controller/combat/CombatController";
import { infoBubble } from "@util/UISugar";
import _ from "lodash";

Macro.add('consumeEnemy', {
    skipArgs: false,
    handler: function () {
        let $wrapper = $('<span/>').css('display', 'block').css('text-align', 'center')
        let prey = this.args[0];
        let player = variables().player

        let consume = [
            { method: 'Eat', gen: '', desc: `You shove the enemy down your gullet.`, capacity: 'stomach' },
            { method: 'Anal', gen: '', desc: `You shove the enemy up your hole`, capacity: 'stomach' },
            { method: 'Unbirth', gen: 'vagina', desc: `You shove the enemy up your lady bits.`, capacity: 'womb' },
            { method: 'Urethral', gen: 'penis', desc: `You shove the enemy in your man bits`, capacity: 'testi' }
        ]

        _.each(consume, (con) => {
            if (con.gen == '' || player.gender[con.gen]) {
                let $conBtn = $('<button/>')
                    .wiki(con.method)
                    .ariaClick(function (ev) {
                        let consumeAmt = Math.floor(calcWeight(prey.measurements))
                        if (variables().settings.warning.overConsumeWarning && isOverMaxCapacity(player, consumeAmt, con.capacity))
                            popup(`Over Capacity`, `You are about to go over your max capacity. If you continue you will be attacked randomly until you rest at home. <br><br>Do you wish to consume?`,
                                { "Yes": () => { $('#overConsumeWarning').dialog("destroy"); consumeContinue(con, consumeAmt, player, prey) }, "No": false }, { type: "warning", name: "overConsumeWarning" })
                        else
                            consumeContinue(con, consumeAmt, player, prey)
                    })
                    .css({ 'height': '50px', 'font-size': '25px', 'margin-bottom': '5px' })
                if (con.method === 'Eat')
                    $conBtn.css({ 'border-radius': '3px 0px 0px 0px' })

                $(this.output).append($conBtn)
            }
        })
        let $fastConsume = $('<div/>').append($('<label/>').wiki(`Fast Consume `).css({ 'cursor': 'pointer' }).prepend($(`<input id="fastConsume" type="checkbox" ${variables().settings.skip.consumeText ? 'checked' : ''}/>`).on('input', function (e) {
            variables().settings.skip.consumeText = $(this)[0].checked
        })).append(infoBubble(`Skips over consume text.`))).css({ 'align-self': 'center' })

        let $leaveBtn = $('<button/>').wiki('Leave').css({ 'height': '50px', 'font-size': '25px', 'border-radius': '0px 0px 0px 3px', 'background-color': 'red', 'border-color': 'red' }).click(() => {
            combatReset()
            Engine.play(variables().return)
        })

        $(this.output).append($leaveBtn)
        $(this.output).append($fastConsume)

        $(this.output).css({ 'display': 'flex', 'flex-direction': 'column' })
    }
})

function calcConsume(prey) {
    let response = {};
    for (let points in prey.exp) {
        let point = randPoints(prey.exp[points])
        if (point > 0) response[points] = point
    }

    return response;
}

function randPoints(range) {
    logger(`Rand Points: ${range}`)
    if (Array.isArray(range))
        return random(range[0], range[1]);
    return range
}

function addCapacity(hunter, prey, capType) {
    hunter.capacity[capType] += prey
}

function addPoints(points, hunter) {
    for (var point in points)
        hunter.exp[point] += points[point]
}

function isOverMaxCapacity(player, amt, capType) {
    logger((player.capacity[capType] + amt))
    if ((player.capacity[capType] + amt) >= player.capacity[`${capType}Max`])
        return true
    return false
}

function consumeContinue(con, consumeAmt, player, prey) {
    let consumeObj = { consume: con, points: calcConsume(prey), sDiff: sizeDiff(player, prey) }

    // This needs to be here to prevent players from repeatedly getting exp by refreshing
    addPoints(consumeObj.points, player)
    addCapacity(player, consumeAmt, consumeObj.consume.capacity)
    variables().consumeObj = consumeObj

    if (variables().settings.skip.consumeText) {
        let textArr = []
        _.each(getExpText(consumeObj.points), (text) => {
            textArr.push(text)
        })
        variables().consumeText = textArr
        combatReset()
        Engine.play(variables().return)
    } else
        Engine.play("consume")
}