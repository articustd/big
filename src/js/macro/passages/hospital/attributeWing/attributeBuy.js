import { logger } from "@util/Logging"
import { RecalcStats } from "@controller/character/CharacterController"
import _ from "lodash"

Macro.add('AttributeBuy', {
    skipArgs: false,
    handler: function () {

        /*Currently we set the values hard coded. Values are as follows:
            type: the first nested property after player e.g. player.STAT
            stat: The last nested property after type e.g. player.stat.STRG
            currentValue: holds the starting value of the stat, i.e. the current strength of the player
            newValue: holds the target value of the stat
            cost: Cost of raising/lowering the stat per point of experience required
        */
        let statChange = [
            {stat: 'strg', currentValue: 0, newValue: 0, type: 'stat', cost: 10, change: 0}
            ,{stat: 'con', currentValue: 0, newValue: 0, type: 'stat', cost: 10, change: 0}
            ,{stat: 'dex', currentValue: 0, newValue: 0, type: 'stat', cost: 10, change: 0}
            ,{stat: 'height', currentValue: 0, newValue: 0, type: 'measurement', cost: 10, change: 0}
            ,{stat: 'bodyFat', currentValue: 0, newValue: 0, type: 'measurement', cost: 10, change: 0}
        ]

        let{player: {credits, stats}} = variables()
        let { player } = variables()
       //Fill the stats and set the current values to it as well
        _.each(statChange, (change) => {
            if (change.type == 'measurement'){
                change.currentValue = player.measurements[change.stat]
                
                //Bodyfat is a float percentile, make it whole integers like with the exp bars
                if (change.stat == 'bodyFat'){
                    change.currentValue = Math.round(change.currentValue * 100, 0)
                }
            }

            else{
                change.currentValue = player.stats[change.stat]
            }
            change.newValue = change.currentValue
        })

        //console.log(getTotalCost())
        //console.log(statChange)
        
        let $total = $('<div/>').text(`Awaiting Changes`)
        let $buyBtn = $('<button/>').wiki('Waiting...').prop('disabled', true).click(() => {
            _.each(statChange, ({change}) => {
                
                if(type="stat")
                    stats[change.stat] += change.change
                
            })
            
            variables().player.credits -= getTotalCost()
            
            //From CharacterController, necessary to set the stats to the proper values (currently only health)
            RecalcStats(player)
            Engine.show()
        })

        $(this.output)
            .append($total)
            .append($buyBtn)

        doAfterRender(() => {
            $('body').on('changeStat', ({ stat, type, newStat }) => {
                /*totalChange += change
                let statToChange = _.find(statChange, { stat })
                _.set(statToChange, 'change', statToChange.change += change)*/
                checkResequence()
            })
        })

        function checkResequence() {
            let CreditCost = getTotalCost()

            $buyBtn.prop('disabled', credits < CreditCost || CreditCost == 0)
            console.log('check disabled buy button')
            if (_.some(statChange, ({ currentValue, newValue }) => { currentValue > newValue || newValue < currentValue})) {
                
                console.log('if statChange')
                
                // set the cost of the change
                if (CreditCost > 0) $total.text(`Cost: ` + CreditCost)
                if (CreditCost == 0) $total.text('No Charge')
                if (CreditCost < 0) $total.text(`Rebate: ` + CreditCost)
                
                console.log('name change totals')

                if (CreditCost <= credits) {
                    $buyBtn.text('Accept Changes')
                    $buyBtn.prop('disabled', false)
                } else
                    $buyBtn.text('Not Enough Credits')

                console.log ('Amount of credits check')
            } else {
                console.log(CreditCost)

                $total.text('Awaiting Changes')
                $buyBtn.text('Waiting...')
            }
        }

        // Cost equals the amount of experience gained/lost per level times the cost
        function getTotalCost() {
            let totalCost = 0
             _.each(statChange, ({currentValue, newValue, cost}) => {
                if(currentValue < newValue){
                    for(let x = currentValue; x < (newValue); x++ ){
                        totalCost += x * cost
                    }
                }
                
                if(currentValue > newValue){
                    for(let x = currentValue; x > (newValue); x-- ){
                        totalCost -= x * cost
                    }
                }
             })
            return totalCost
        }
    }
})

function doAfterRender(callback) {
    if (Engine.isRendering())
        setTimeout(doAfterRender, 50, callback)
    else
        callback()
}