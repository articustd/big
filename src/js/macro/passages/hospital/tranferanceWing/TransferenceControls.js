import { logger } from "@util/Logging"

Macro.add('TransferenceControls', {
    skipArgs: false,
    handler: function () {
        let [transType, secondTrans] = this.args
        let { player } = variables()
        let total = temporary()[transType]
        let secondTotal = temporary()[secondTrans]

        let $addBtn = $('<button/>').addClass('full-width').append($('<i/>').addClass(`fa fa-plus`)).click(() => { changeTotals(false) })
        let $subBtn = $('<button/>').addClass('full-width').append($('<i/>').addClass(`fa fa-minus`)).click(() => { changeTotals(true) })
        let $dropdown = createDropdown({ '1': 1, '10': 10, '50': 50, '100': 100, '1000': 1000 }, `${transType}Select`, "1").addClass('full-width')
        $dropdown.change(()=>{
            checkDisabled()
            logger($('.trans').data('counters'))
        })
        $(this.output)
            .append($addBtn)
            .append($dropdown)
            .append($subBtn)

        function changeTotals(negative) {
            let selectedVal = getSelected() * ((negative) ? -1 : 1)

            total += selectedVal
            secondTotal -= selectedVal
            updateCounters()
        }

        function updateCounters() {
            temporary()[transType] = total
            temporary()[secondTrans] = secondTotal
            checkDisabled()
            $('body').trigger('UpdateCounters')
        }

        function checkDisabled() {
            $addBtn.prop('disabled', true)
            $subBtn.prop('disabled', true)
            let selectedVal = getSelected()
            if (-player[transType] <= (total - selectedVal))
                $subBtn.prop('disabled', false)
            if (-player[secondTrans] <= (secondTotal - selectedVal))
                $addBtn.prop('disabled', false)
        }

        function getSelected() {
            return _.toInteger($dropdown.find(':selected').text())
        }

        doAfterRender(() => {
            $('body').on(`UpdateChange`, () => {
                total = temporary()[transType]
                secondTotal = temporary()[secondTrans]
                checkDisabled()
            })
        })

        checkDisabled()
    }
})

function createDropdown(list, name, selected) {
    let $dropdown = $(`<select name="${name}"/>`)
    _.each(list, (data, key) => {
        $dropdown.append($('<option/>').attr('value', key).prop('selected', key === selected).wiki(data))
    })
    return $dropdown
}

function doAfterRender(callback) {
    if (Engine.isRendering())
        setTimeout(doAfterRender, 50, callback)
    else
        callback()
}