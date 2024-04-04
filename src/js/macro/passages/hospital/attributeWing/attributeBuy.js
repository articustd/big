import { logger } from "@util/Logging"
import _ from "lodash"
//import { RecalcStats } from "@controller/character/CharacterController"

Macro.add('AttributeBuy', {
    skipArgs: false,
    handler: function () {
        let totalChange = 0
        let statChange = [{ stat: 'strg', change: 0 }, { stat: 'con', change: 0 }, { stat: 'dex', change: 0 }]
        let { cost } = temporary()
        let { player: { credits, stats } } = variables()

        let $total = $('<div/>').text(`Awaiting Changes`)
        let $buyBtn = $('<button/>').wiki('Waiting...').prop('disabled', true).click(() => {
            _.each(statChange, ({stat, change}) => {
                stats[stat] += change
            })
            variables().player.credits -= totalCost()
            //RecalcStats(player) //WIP we need to recalculate before resting
            Engine.show()
        })

        $(this.output)
            .append($total)
            .append($buyBtn)

        doAfterRender(() => {
            $('body').on('changeStat', ({ stat, change }) => {
                totalChange += change
                let statToChange = _.find(statChange, { stat })
                _.set(statToChange, 'change', statToChange.change += change)
                checkResequence()
            })
        })

        function checkResequence() {
            $buyBtn.prop('disabled', credits < totalCost() || totalCost() === 0)
            if (_.some(statChange, ({ change }) => { return change !== 0 })) {
                if (totalChange > 0)
                    $total.text(`Cost: ${totalCost()}`)
                if (totalChange === 0)
                    $total.text('No Charge')
                if (totalChange < 0)
                    $total.text(`Rebate: ${-totalCost()}`)
                if (totalCost() <= credits) {
                    $buyBtn.text('Accept Changes')
                    $buyBtn.prop('disabled', false)
                } else
                    $buyBtn.text('Not Enough Credits')
            } else {
                $total.text('Awaiting Changes')
                $buyBtn.text('Waiting...')
            }


        }

        function totalCost() {
            return totalChange * cost
        }
    }
})

function doAfterRender(callback) {
    if (Engine.isRendering())
        setTimeout(doAfterRender, 50, callback)
    else
        callback()
}