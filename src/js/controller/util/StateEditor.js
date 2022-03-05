import { logger } from "./Logging";
import _ from 'lodash';

export function stateEditor() {
    let $popup = $('<div id="stateEditor"/>').dialog({
        title: `State Editor`,
        resizeable: true,
        width: 360,
        height: 600,
        close: (event, ui) => { $popup.remove() }
    })

    let $dropDown = createDropdown($popup, `Variable`, `testDropdow`)
    let $fieldContainer = $('<div id="fieldContainer"/>')
    $popup.append($fieldContainer)
    addOptions($dropDown, variables())
    $dropDown.selectmenu({
        select: (event, ui) => { clearElement($fieldContainer); addField($fieldContainer, [ui.item.value], variables()[ui.item.value]) }
    })

    let firstItem = Object.keys(variables())[0]
    addField($fieldContainer, [firstItem], variables()[firstItem])

    return $popup
}

function createDropdown($parent, label, id) {
    let $label = $(`<label for="${id}"/>`).wiki(`${label}: `)
    let $dropDown = $(`<select id="${id}" name="${id}"/>`)

    let $wrapper = $('<div/>').append($label).append($dropDown).css({ width: '100%', "margin-bottom": '10px' })

    $parent.append($wrapper)
    $dropDown.selectmenu({
        width: 200
    })

    return $dropDown
}

function addOptions($dropDown, options) {
    for (let option in options)
        $dropDown.append($('<option/>').wiki(option))
    $dropDown.selectmenu("refresh")
}

function addField($parent, varPath, varVal, noLabel, rowId) {
    let varName = varPath[varPath.length - 1]
    if (rowId)
        varName = `${varName}-${rowId}`

    if (typeof varVal == "string") {
        let $wrapper = $('<div/>').css('margin-bottom', '5px')
        if (!noLabel)
            $wrapper.append($(`<label for="${varName}-text"/>`).wiki(`${varName}: `))
        $wrapper.append($(`<input type="text" id="${varName}-text" name="${varName}-text" value="${varVal}"/>`).on('input', function (e) {
            _.update(variables(), varPath, () => { return $(this).val() })
            Engine.show()
        }))
        $parent.append($wrapper)
    }
    if (typeof varVal == "boolean") {
        let $wrapper = $('<div/>').css('margin-bottom', '5px')
        if (!noLabel)
            $wrapper.append($(`<label for="${varName}-text"/>`).wiki(`${varName}: `))
        $wrapper.append($(`<input type="checkbox" id="${varName}-text" ${varVal ? 'checked' : ''}/>`).on('input', function (e) {
            _.update(variables(), varPath, () => { return $(this)[0].checked })
            Engine.show()
        }))

        $parent.append($wrapper)
    }
    if (typeof varVal == "number") {
        let $wrapper = $('<div/>').css('margin-bottom', '5px')
        if (!noLabel)
            $wrapper.append($(`<label for="${varName}-text"/>`).wiki(`${varName}: `))
        $wrapper.append($(`<input type="text" id="${varName}-text" name="${varName}-text" value="${varVal}"/>`).on('input', function (e) {
            _.update(variables(), varPath, () => { return Number($(this).val()) })
            Engine.show()
        }).inputFilter(function (value) {
            return /^-?\d*.?\d*$/.test(value);    // FIXME For some reason allows a single non-numeric character
        }));
        $parent.append($wrapper)
    }
    if (typeof varVal == "object") {
        if (Array.isArray(varVal) && !_.isEmpty(varVal)) {
            logger('Object data type of Array')

            if (typeof varVal[0] == "string" || typeof varVal[0] == "number") {
                $parent.append($(`<label for="${varName}-text"/>`).wiki(`${varName}: `))
                _.each(varVal, (item, key) => {
                    addField($parent, [...varPath, key], item, true, key)
                })
            } else {
                logger(varVal)
                let tableHeaders = Object.keys(varVal[0])
                $parent.append($(`<label for="${varName}-text"/>`).wiki(`${varName}: `)).append($('<br/>'))
                logger(tableHeaders)
                if (tableHeaders.length > 1) {
                    let $table = $('<table/>').addClass('skillTable');
                    let $row = $('<tr/>')
                    _.each(tableHeaders, (val, key) => {
                        $row.append($(`<th/>`).wiki(val))
                    })
                    $table.append($row)

                    _.each(varVal, (val, objIdx) => {
                        $row = $('<tr/>')
                        _.each(val, (item, key) => {
                            let $dataCell = $('<td/>')
                            addField($dataCell, [...varPath, objIdx, key], item, true, objIdx)
                            $row.append($dataCell)
                        })
                        $table.append($row)
                    })
                    $parent.append($table)
                } else {
                    _.each(varVal, (item, key) => {
                        let objKey = Object.keys(item)[0]
                        $parent.append($(`<label for="${objKey}-text"/>`).wiki(`${objKey}: `))
                        addField($parent, [...varPath, key, objKey], item[objKey], false, objKey)
                    })
                    
                }
            }


        } else {
            logger('Object data type of JSON')
            for (let field in varVal)
                addField($parent, [...varPath, field], varVal[field])
        }
    }
}

function clearElement($ele) {
    $ele.empty()
}

// Filter for numeric text fields
(function ($) {
    $.fn.inputFilter = function (inputFilter) {
        return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    };
}(jQuery));