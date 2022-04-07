import { logger } from "./Logging"
import { createTable } from "./Table"

export function createDropdown({ $parent, $menuParent, label, name, data, prop, displayProp, selectedData, callback, style: { wrapper, input } }) {
    let $wrapper = $('<div/>')
    let $dropDown = $(`<select name="${name}"/>`)

    if (label)
        $wrapper.append($(`<label for=${name}/>`).wiki(label))

    $wrapper.append($dropDown).css(wrapper || { width: '100%', "margin-bottom": '10px', "margin-top": '10px' })
    $wrapper.appendTo($parent)
    $dropDown.selectmenu({
        appendTo: $menuParent,
        width: 200
    })

    _.each(data, (val, key) => {
        $dropDown.append($(`<option value="${(typeof val[prop] !== 'undefined') ? val[prop] : key}"/>`).wiki(val[displayProp || prop]))
    })

    if (callback)
        $dropDown.selectmenu({
            select: function (event, ui) {
                let value = ui.item.value
                callback(isNaN(value) ? value : Number(value))
            }
        })

    $dropDown.selectmenu("refresh", true)
    
    if (typeof selectedData !== 'undefined')
        $dropDown.val(selectedData.toString()).selectmenu("refresh", true)
    

    return $dropDown
}

export function createButton({ type, icon, text, style, callback }) {
    let $btn = $('<Button type="button"/>')

    $btn.css(style || {})
    $btn.click(callback)

    if (icon)
        $btn.append($('<i/>').addClass(`fa ${icon}`))

    $btn.wiki(text || '')

    switch (type) {
        case 'Delete':
            $btn.css({ 'background-color': 'red' })
            break
    }

    return $btn
}

export function createInputField({ type, label, prop, data, style: { wrapper, input }, callback }) {
    let $wrapper = $('<div/>').css(wrapper || { 'margin-top': '10px', 'margin-bottom': '10px' })
    let $inputField = $('<input/>').attr('type', type).attr('name', prop).css(input || { 'margin-top': '0px' })

    if (data)
        $inputField.val(data)

    if (label)
        $wrapper.append($('<label/>').attr('for', prop).wiki(label))

    if (callback)
        $inputField.change(function () {
            callback((type === 'number') ? Number($(this).val()) : $(this).val())
        })

    return $wrapper.append($inputField)
}

export function createField({ $parent, type, field, data, dataObj, prop, label, map, style, callback }) {
    switch (field.type || type) {
        case 'String':
            $parent.append(createInputField({ type: "text", prop, label, data, style, callback }))
            break
        case 'Number':
            $parent.append(createInputField({ type: "number", prop, label, data, style, callback }))
            break
        case 'Dropdown':
            createDropdown({ $parent, $menuParent: $parent, label, prop: field.dataProp, displayProp: field.displayProp, data: dataObj, selectedData: data, name: prop, style, callback })
            break
        case 'Boolean':
            logger({ label, prop, field, data })
            createDropdown({ $parent, $menuParent: $parent, label, prop: field.dataProp, data: field.data, displayProp: field.displayProp, selectedData: data, name: prop, style, callback })
            break
        case 'Array':
            createTable({
                $parent,
                dataMap: map,
                data,
                name: prop,
                title: label,
                btns: { hasAdd: createEmpty(map), hasDelete: true },
                editable: function () { },
                dataCallback: callback
            })
    }
}

export function createEmpty({ children, response = {} }) {
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