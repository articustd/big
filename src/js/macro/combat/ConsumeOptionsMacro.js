import { logger } from "@util/Logging"
import { calcWeight, sizeDiff } from "@controller/character/MeasurementController"

Macro.add('consumeEnemy', {
    skipArgs: false,
    handler: function () {
        let $wrapper = $('<span/>').css('display', 'block').css('text-align', 'center')
        let prey = this.args[0];
        let player = State.variables.player

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
                            let consumeObj = { consume: con, points: calcConsume(prey), sDiff: sizeDiff(player, prey) }

                            // This needs to be here to prevent players from repeatedly getting exp by refreshing
                            addPoints(consumeObj.points, player)
                            addCapacity(player, calcWeight(prey.measurements), consumeObj.consume.capacity)
                            State.variables.consumeObj = consumeObj

                            Engine.play("consume")
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
    hunter.capacity[capType] += Math.floor(prey)
}

function addPoints(points, hunter) {
    for (var point in points)
        hunter.exp[point] += points[point]
}