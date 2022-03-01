import { logger } from "@util/Logging"
import { calcWeight, sizeDiff } from "@controller/character/MeasurementController"
import { popup } from "@util/ModalPopup";

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
            { method: 'Sound', gen: 'penis', desc: `You shove the enemy in your man bits`, capacity: 'testi' }
        ]

        consume.forEach(function (con) {
            if (con.gen == '' || player.gender[con.gen]) {
                $wrapper.append(
                    $('<button/>')
                        .wiki(con.method)
                        .ariaClick(function (ev) {
                            let consumeAmt = Math.floor(calcWeight(prey.measurements))
                            if(variables().settings.warnings.overConsumeWarning && isOverMaxCapacity(player, consumeAmt, con.capacity)) 
                                popup(`Over Capacity`,`You are about to go over your max capacity. If you continue you will be attacked randomly until you rest at home. <br><br>Do you wish to consume?`, 
                                    {"Yes": ()=>{$( '#overConsumeWarning' ).dialog( "destroy" );consumeContinue(con,consumeAmt,player,prey)}, "No": false}, {type: "warning", name: "overConsumeWarning"})
                            else
                                consumeContinue(con,consumeAmt,player,prey)
                        })
                        .css({ 'width': '90%', 'margin-bottom': '10px' })
                )
            }
        })

        $wrapper
            .attr('id', `macro-${this.name}`)
            .addClass('consumes')
            .appendTo(this.output);
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
    logger((player.capacity[capType]+amt))
    if((player.capacity[capType]+amt) >= player.capacity[`${capType}Max`])
        return true
    return false
}

function consumeContinue(con, consumeAmt, player, prey) {
    let consumeObj = { consume: con, points: calcConsume(prey), sDiff: sizeDiff(player, prey) }

    // This needs to be here to prevent players from repeatedly getting exp by refreshing
    addPoints(consumeObj.points, player)
    addCapacity(player, consumeAmt, consumeObj.consume.capacity)
    variables().consumeObj = consumeObj

    
    Engine.play("consume")
}