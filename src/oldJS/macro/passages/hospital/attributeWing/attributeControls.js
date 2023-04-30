import { logger } from "@util/Logging"
import _, { set } from "lodash"

Macro.add('AttributeControls', {
    skipArgs: false,
    handler: function () {
        let [stat] = this.args
        let { player } = variables()
        let newStat = player.stats[stat]

        let $statContainer = $('<div/>').attr('id', stat).data(stat, newStat).append(player.stats[stat])

        let $controlContainer = $('<div/>').addClass('attribute-controls')
        let $removeButton = $('<button/>').append($('<i/>').addClass(`fa fa-minus`)).click(() => { statChange(true) })
        let $addButton = $('<button/>').append($('<i/>').addClass(`fa fa-plus`)).click(() => { statChange(false) })
        let $dropdown = createDropdown({ '1': 1, '2': 2, '5': 5, '10': 10 }, `${stat}Select`)

        $controlContainer
            .append($removeButton)
            .append($dropdown)
            .append($addButton)

        let $resetButton = $('<button/>').prop('disabled', true).wiki('Reset').click(() => {
            let change = player.stats[stat] - newStat
            newStat = player.stats[stat]
            setData(change)
            $dropdown.find(`option[value="1"]`).prop('selected', true)
            updateControls()
        })

        $(this.output)
            .append($statContainer)
            .append($controlContainer)
            .append($resetButton)

        function statChange(negative) {
            let selectedVal = _.toInteger($dropdown.find(':selected').text())
            if (negative)
                selectedVal = -selectedVal

            newStat += selectedVal
            setData(selectedVal)
            updateControls()
        }

        function updateControls() {
            let selectedVal = _.toInteger($dropdown.find(':selected').text())
            $statContainer.empty()
            if (newStat !== player.stats[stat]) {
                $resetButton.prop('disabled', false)
                $statContainer.wiki(`${player.stats[stat]} <i class="fa fa-arrow-right"/> ${newStat}`)
            } else {
                $resetButton.prop('disabled', true)
                $statContainer.append(player.stats[stat])
            }
            $removeButton.prop('disabled', false)
            if ((newStat - selectedVal) < 1)
                $removeButton.prop('disabled', true)
        }

        function setData(change) {
            $statContainer.data(stat, newStat).trigger({ type: "changeStat", stat, change })
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