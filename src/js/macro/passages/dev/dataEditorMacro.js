import { logger } from "@util/Logging"
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import * as data from "@js/data"
import * as dataMap from '@js/data/dataMaps'
import _ from "lodash"
import { getPropMeta } from "@util/DataMapping"


Macro.add('dataEditorMacro', {
    skipArgs: false,
    handler: function () {
        let $label = $(`<label for="dataMapDropDown"/>`).wiki(`Data Map: `)
        let $dropDown = $(`<select id="dataMapDropDown" name="dataMapDropDown"/>`)

        let $passage = $('#passage-dataeditor').parent()
        logger($passage)
        $passage.css('max-width', '100%')

        let $wrapper = $('<div/>').append($label).append($dropDown).css({ width: '100%', "margin-bottom": '10px' })
        $wrapper.appendTo(this.output)
        $dropDown.selectmenu({
            width: 200
        })
        logger(dataMap)
        _.each(dataMap, (val, key) => {
            $dropDown.append($(`<option value="${key}"/>`).wiki(val.name))
        })
        let $fieldsContainer = $('<div id="fieldsContainer"/>').appendTo(this.output)
        $dropDown.selectmenu({
            select: (event, ui) => { clearElement($fieldsContainer); createForm($fieldsContainer, dataMap[ui.item.value]); displayData($fieldsContainer, dataMap[ui.item.value], data[dataMap[ui.item.value].dataName]) }
        })

        $dropDown.selectmenu("refresh")
        let firstItem = $dropDown.val()
        // logger(dataMap[firstItem])
        createForm($fieldsContainer, dataMap[firstItem])
        displayData($fieldsContainer, dataMap[firstItem], data[dataMap[firstItem].dataName])
        let $exportBtn = $('<button id="Export"/>').append($('<i class="fa fa-floppy-o"/>')).wiki(' Export').appendTo(this.output).click(() => {
            let file = new Blob([JSON.stringify(marshallData(dataMap[$dropDown.val()]), null, 2)], { type: 'application/json' })
            let a = document.createElement('a');
            a.download = dataMap[$dropDown.val()].dataName + '.json';
            a.href = URL.createObjectURL(file);
            a.click();
        })
        let $cpyBtn = $('<button id="Copy"/>').css('margin-left', '5px').append($('<i class="fa fa-files-o"/>')).wiki(' Copy').appendTo(this.output).click(() => {
            navigator.clipboard.writeText(`${JSON.stringify(marshallData(dataMap[$dropDown.val()]), null, 2)}`);
        })
        let $stateBtn = $('<button id="Copy"/>').css('margin-left', '5px').append($('<i class="fa fa-link"/>')).wiki(' Save State').appendTo(this.output).click(() => {
            variables()[dataMap[$dropDown.val()].dataName] = marshallData(dataMap[$dropDown.val()])
            Engine.show()
        })
        // Use this to get the meta map of a data store
        // let metaMap = getPropMeta([], attacks)
        // let $button = $('<button/>').wiki('Copy JSON').click(()=>{
        //     navigator.clipboard.writeText(`${JSON.stringify(metaMap)}`);
        // })

        // $button.appendTo(this.output)
    }
})

function createForm($parent, varVal) {
    switch (varVal.type) {
        case 'Array':
            let $table = $(`<table id="${varVal.name}-table"/>`)
            let $headerRow = $('<tr/>').appendTo($table)
            _.each(varVal.children, (val, key) => {
                $headerRow.append($(`<th id="${val.propName}-column"/>`).wiki(val.name))
            })
            $parent.append($table)
            $('<Button/>').css({ "float": "right", "width": "35px", "border-radius": "5px" }).append($('<i class="fa fa-plus"/>')).click(() => {
                let emptyData = createEmpty(varVal)
                displayData($parent, varVal, emptyData)
            }).appendTo($parent)
            break
        default:
            logger(`Type ${varVal.type} not yet implement`)
    }
}

function displayData($parent, dMap, dVals) {
    // logger(dMap)
    // logger(dVals)
    switch (dMap.type) {
        case 'Array':
            let $table = $parent.find(`#${dMap.name}-table`)
            // logger($table)
            _.each(dVals, (dValsData, dValsKey) => {
                let $row = $(`<tr id="${dMap.dataName}[${dValsKey}]"/>`)
                _.each(dMap.children, (dMapData, dMapKey) => {
                    let $dataCell = $('<td/>').css('padding', '0px')
                    createField($dataCell, dMapData.type, dValsData[dMapData.propName], dMapData.propName, dValsKey)
                    // $row.append($(`<td/>`).wiki(dValsData[dMapData.propName]))
                    $row.append($dataCell)
                    // logger(dMapData)
                })
                $table.append($row)
                // logger(dValsData)
            })
            break
        default:
            logger(`Type ${dMap.type} not yet implement`)
    }
}

function createField($parent, type, data, prop) {
    let css = { "min-width": "1em" }
    switch (type) {
        case 'String':
            $parent.append($(`<input type="text" name="${prop}" value="${data}"/>`).css(css))
            break
        case 'Number':
            $parent.append($(`<input type="number" name="${prop}" value="${data}"/>`).css(css))
            break
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

function marshallData(dMap) {
    let response
    if (dMap.type === 'Array') {
        response = []
        $(`#${dMap.name}-table`).find('tr').each((idx, element) => {
            if (idx != 0) {
                logger(idx)
                logger(element)
                let obj = {}
                $(element).find('td').each((idx, element) => {
                    logger(idx)
                    logger($($(element).find('input')).attr('name'))
                    let dataVal = $($(element).find('input')).prop('value')
                    obj[$($(element).find('input')).attr('name')] = (Number(dataVal)) ? Number(dataVal) : dataVal
                })
                response.push(obj)
            }
        })
        logger(response)
    }
    return response
}

function createEmpty(dMap) {
    let response = [{}]
    _.each(dMap.children, (dVal, dKey) => {
        let prop = dVal.propName
        let val;
        switch (dVal.type) {
            case 'String':
                val = ''
                break
            case 'Number':
                val = 0
                break
        }
        response[0][prop] = val
    })
    logger(response)
    return response
}