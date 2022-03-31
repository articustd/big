import { logger } from "@util/Logging"
import * as dataObjs from "@js/data"
import * as dataMaps from '@js/data/dataMaps'
import _ from "lodash"
import { getPropMeta } from "@util/DataMapping"
import { createButton, createDropdown, createInputField } from "@util/Input"
import { createTable, updateRow } from "@util/Table"


Macro.add('dataEditorMacro', {
    skipArgs: false,
    handler: function () {
        let $dropDown = createDropdown({
            $parent: this.output,
            label: 'Data Map: ',
            data: dataMaps,
            displayProp: 'name',
            callback: (event, ui) => {
                $fieldsContainer.empty()
                let dataMap = dataMaps[ui.item.value]
                let data = dataObjs[dataMap.dataName]
                createTable({
                    $parent: $fieldsContainer,
                    dataMap,
                    data,
                    name: dataMap.name,
                    btns: { hasDelete: true, hasAdd: createEmpty(dataMap) },
                    rowCallback: ({ $table, rowIdx, data, dataMap, name }) => { openFormEditor({ $table, rowIdx, data, dataMap, name }) }
                })
            }
        })

        let $fieldsContainer = $('<div/>').attr('id', 'fieldsContainer').appendTo(this.output)

        let dataMap = dataMaps[$dropDown.val()]
        let data = dataObjs[dataMap.dataName]

        let $table = createTable({
            $parent: $fieldsContainer,
            dataMap,
            data,
            name: dataMap.name,
            btns: { hasDelete: true, hasAdd: createEmpty(dataMap) },
            rowCallback: ({ $table, $row, data, dataMap, name }) => { openFormEditor({ $table, $row, data, dataMap, name }) }
        })

        createButton({
            type: 'Action',
            icon: 'fa-floppy-o',
            text: ' Export',
            callback: () => {
                let file = new Blob([JSON.stringify(marshallData(dataMap), null, 2)], { type: 'application/json' })
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
                navigator.clipboard.writeText(`${JSON.stringify(marshallData(dataMap), null, 2)}`)
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
        // let metaMap = getPropMeta([], data.stores)
        // let $button = $('<button/>').wiki('Copy JSON').click(()=>{
        //     navigator.clipboard.writeText(`${JSON.stringify(metaMap)}`);
        // })

        // $button.appendTo(this.output)
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

function createEmpty({ children, response = {} }) {
    _.each(children, ({ propName, type }) => {
        switch (type) {
            case 'String':
                response[propName] = 'New Data'
                break
            case 'Number':
                response[propName] = 0
                break
        }
    })
    return response
}

function openFormEditor({ $table, $row, data, dataMap, name }) {
    // logger($table)
    // logger({ $row, data, dataMap })

    let $popup = $('<form id="formEditor"/>').dialog({
        autoOpen: true,
        title: name,
        resizeable: true,
        width: 800,
        height: 600,
        buttons: {
            "Save": () => {
                logger(formSerialize({ $form }))
                updateRow({ $row, data: formSerialize({ $form }) })
            },
            "Close": () => { $popup.remove() }
        },
        close: (event, ui) => { $popup.remove() }
    })
    let $form = $('<form/>')

    _.each(dataMap, ({ name, propName, type, field }) => {
        createField({ $parent: $form, data: data[propName], type, field, prop: propName, name })
    })

    $popup.append($form)
}

function createField({ $parent, type, field, data, prop, name }) {
    switch (field.type || type) {
        case 'String':
            $parent.append(createInputField({ type: "text", prop, label: `${name}: `, data }))
            break
        case 'Number':
            $parent.append(createInputField({ type: "number", prop, label: `${name}: `, data }))
            break
        case 'Dropdown':
            createDropdown({ $parent, $menuParent: $parent, label: `${name}: `, prop: field.dataProp, displayProp: field.displayProp, data: dataObjs[field.data], selectedData: data, name: prop })
            break
    }
}

function formSerialize({ $form }) {
    return $form.serializeArray().reduce((obj, item) => {
        obj[item.name] = item.value;
        return obj;
    }, {})
}