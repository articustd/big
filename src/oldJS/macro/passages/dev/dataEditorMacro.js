import { logger } from "@util/Logging"
import * as dataObjs from "@js/data"
import * as dataMaps from '@js/data/dataMaps'
import _ from "lodash"
import { getPropMeta } from "@util/DataMapping"
import { createButton, createDropdown, createEmpty, createField } from "@util/Input"
import { createTable, updateRow } from "@util/Table"

Macro.add('dataEditorMacro', {
    skipArgs: false,
    handler: function () {
        let $dropDown = createDropdown({
            $parent: this.output,
            label: 'Data Map: ',
            data: dataMaps,
            displayProp: 'name',
            callback: (value) => {
                $fieldsContainer.empty()
                let dataMap = dataMaps[value]
                let data = dataObjs[dataMap.dataName]
                createTable({
                    $parent: $fieldsContainer,
                    dataMap, data, field: {},
                    name: dataMap.name,
                    btns: { hasDelete: true, hasAdd: createEmpty },
                    rowCallback: ({ $table, $row, data, dataMap, name }) => { openFormEditor({ $table, $row, data, dataMap, name }) }
                })
            },
            style: { wrapper: false, input: false }
        })

        let $fieldsContainer = $('<div/>').attr('id', 'fieldsContainer').appendTo(this.output)

        let dataMap = dataMaps[$dropDown.val()]
        let data = dataObjs[dataMap.dataName]

        let $table = createTable({
            $parent: $fieldsContainer,
            dataMap, data, field: {},
            name: dataMap.name,
            btns: { hasDelete: true, hasAdd: createEmpty },
            rowCallback: ({ $row, data, dataMap, name }) => { openFormEditor({ $row, data, dataMap, name }) }
        })

        createButton({
            type: 'Action',
            icon: 'fa-floppy-o',
            text: ' Export',
            callback: () => {
                let file = new Blob([JSON.stringify(marshallData(dataMap), null, 0)], { type: 'application/json' })
                let a = document.createElement('a')
                a.download = dataMap.dataName + '.json'
                a.href = URL.createObjectURL(file)
                a.click()
            }
        }).appendTo(this.output)
        createButton({
            type: 'Action',
            icon: 'fa-files-o',
            text: ' Copy',
            style: { 'margin-left': '5px' },
            callback: () => {
                navigator.clipboard.writeText(`${JSON.stringify(marshallData(dataMap), null, 1)}`)
            }
        }).appendTo(this.output)
        createButton({
            type: 'Action',
            icon: 'fa-floppy-o',
            text: ' Save State',
            style: { 'margin-left': '5px' },
            callback: () => {
                variables()[dataMap.dataName] = marshallData(dataMap)
                Engine.show()
            }
        }).appendTo(this.output)

        // Use this to get the meta map of a data store
        let metaMap = getPropMeta([], dataObjs.attackSkill)
        let $button = $('<button/>').css({'margin-left': '5px'}).wiki('Copy JSON').click(()=>{
            navigator.clipboard.writeText(`${JSON.stringify(metaMap)}`);
        })

        $button.appendTo(this.output)
    }
})

function marshallData({ type, response }) {
    if (type === 'Array') {
        response = []
        $('.dataEditorTable > tr.dataRow').each(function () {
            response.push($(this).data())
        })
    }
    return response
}

function openFormEditor({ $row, data, dataMap, name }) {
    let $popup = $('<form id="formEditor"/>').dialog({
        modal: true,
        title: name,
        resizeable: true,
        width: 800,
        height: 600,
        buttons: {
            "Save": () => { updateRow({ $row, data: formSerialize({ $form, data }) }) },
            "Save & Close": () => { updateRow({ $row, data: formSerialize({ $form, data }) }); $popup.remove() }
        },
        close: (event, ui) => { $popup.remove() }
    })
    let $form = $('<form/>')

    _.each(dataMap, function ({ name, propName, type, field, children }) {
        createField({
            $parent: $form,
            data: data[propName],
            dataObj: dataObjs[field.data],
            type, field, name,
            prop: propName,
            label: `${name}: `,
            map: { children },
            style: { wrapper: false, input: false }
        })
    })

    $popup.append($form)
}

function formSerialize({ $form, data }) {
    $form.find('> div[name]').each(function() {
        data[$(this).attr('name')] = $(this).data()
        formSerialize({$form:$(this), data:data[$(this).attr('name')]})
    })
    $form.find('> div > input').each(function () {
        data[$(this).attr('name')] = numify($(this).val())
    })
    $form.find('> div > select').each(function () {
        data[$(this).attr('name')] = boolify(numify($(this).val()))
    })
    $form.find('> table').each(function ({ arr = [] }) {
        logger($(this).text())
        logger(data)
        $(this).find('tr.dataRow').each(function () {
            arr.push($(this).data())
        })
        data[$(this).attr('name')] = arr
    })
    return data
}

function numify(value) {
    let isNum = parseFloat(value)
    if(isNaN(isNum))
        return value
    return isNum
}

function boolify(value) {
    if(value === 'true' || value === 'false')
        return JSON.parse(value)
    return value
}