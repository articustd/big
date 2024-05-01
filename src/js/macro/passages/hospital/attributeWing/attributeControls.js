import { logger } from "@util/Logging"
import _, { set } from "lodash"

Macro.add('AttributeControls', {
    skipArgs: false,
    handler: function () {
        let stat = this.args[0]
        let type = this.args[1]
        let { player } = variables()
        let newStat 
        
        //Determine what we're actually adjusting. A core stat, or the player's measurements?
        if(type == 'measurement'){
            newStat = player.measurements[stat]
            
            //Body fat is a special case, which needs to be multiplied by 100
            if (stat =='bodyFat'){
                newStat =  Math.round(stat * 100, 0)
            }                
        }
        else
            newStat = player.stats[stat]

        //Make a new container housing the stat and any changes. Measurements are special, more types might follow
        let $statContainer = $('<div/>').attr('id', stat).data(stat, newStat)
        if(type == 'measurement')
            $statContainer.append(player.measurements[stat])
        else
            $statContainer.append(player.stats[stat])
        
        //Prep the number controls, which, left to right, are subtact, multiplier, and add. Surrounding it is a wrapping element to group them
        let $controlContainer = $('<div/>').addClass('attribute-controls')
        let $removeButton = $('<button/>').append($('<i/>').addClass(`fa fa-minus`)).click(() => { statChange(true) })
        let $addButton = $('<button/>').append($('<i/>').addClass(`fa fa-plus`)).click(() => { statChange() })
        let $dropdown = createDropdown({ '1': 1, '2': 2, '5': 5, '10': 10 }, `${stat}Select`)

        $controlContainer
            .append($removeButton)
            .append($dropdown)
            .append($addButton)

        //Prep the reset button, once again measurements are specific, and need to be handled separately
        let $resetButton = $('<button/>').prop('disabled', true).wiki('Reset').click(() => {
            let change            
            if(type == 'measurement'){
                player.measurements[stat] - newStat
                newStat = player.measurements[stat]
            }
            else{
                player.stats[stat] - newStat
                newStat = player.stats[stat]
            }
            
            setData()
            $dropdown.find(`option[value="1"]`).prop('selected', true)
            updateControls()
        })

        //Put all elements on the page
        $(this.output)
            .append($statContainer)
            .append($controlContainer)
            .append($resetButton)

        //Subtracts or adds the amount to the temporary value, defaults to false
        function statChange(negative = false) {
            let selectedVal = _.toInteger($dropdown.find(':selected').text())
            if (negative)
                selectedVal = -selectedVal

            newStat += selectedVal
            setData()
            updateControls(stat, type)
        }

        function updateControls() {
            let selectedVal = _.toInteger($dropdown.find(':selected').text())
            $statContainer.empty()

            if (newStat !== player.stats[stat] && type == 'stat') {
                $resetButton.prop('disabled', false)

                if(newStat !== player.measurements[stat] &&type == 'measurement')
                    $statContainer.wiki(`${player.measurements[stat]} <i class="fa fa-arrow-right"/> ${newStat}`)
                else
                    $statContainer.wiki(`${player.stats[stat]} <i class="fa fa-arrow-right"/> ${newStat}`)
            } 

            else {
                $resetButton.prop('disabled', true)
                if (type == 'measurement')
                    $statContainer.append(player.measurements[stat])
                else
                    $statContainer.append(player.stats[stat])
            }

            $removeButton.prop('disabled', false)
            if ((newStat - selectedVal) < 1)
                $removeButton.prop('disabled', true)
        }

        function setData() {
            // When using .trigger(...) the "type" element is reserved by jquery to name the trigger event
            // In this case it's going to be either "stat" or "measurement"
            // Anything listening on the body must listen for "stat" or "measurement"
            $statContainer.data(stat, type, newStat).trigger({ 
                type: type, 
                stat: stat, 
                newValue: newStat,
                
            })
        }
    }
})

function createDropdown(list, name, selected) {
    let $dropdown = $(`<select name="${name}"/>`)
    _.each(list, (data, key) => {
        $dropdown.append($('<option/>').attr('value', key).prop('selected', key === selected).wiki(data))
    })
    return $dropdown
}