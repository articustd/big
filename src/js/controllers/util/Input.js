import _ from "lodash"
import { logger } from "./Logging"
import * as dataObjs from "@js/data"
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
    if (typeof selectedData !== 'undefined' && selectedData !== null)
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
            $btn.css({ 'background-color': 'red', 'border-color': 'red' })
            break
    }

    return $btn
}

export function createInputField({ type, label, prop, data, style: { wrapper, input }, callback }) {
    let $wrapper = $('<div/>').css(wrapper || { 'margin-top': '10px', 'margin-bottom': '10px' })
    let $inputField = $('<input/>').attr('type', type).attr('name', prop).css(input || { 'margin-top': '0px' })

    if (data || data === 0)
        $inputField.val(data)

    if (label)
        $wrapper.append($('<label/>').attr('for', prop).wiki(label))

    if (callback)
        $inputField.change(function () {
            callback((type === 'number') ? Number($(this).val()) : $(this).val())
        })

    return $wrapper.append($inputField)
}

export function createTextArea({ label, prop, data, style: { wrapper, input }, callback }) {
    let $wrapper = $('<div/>').css(wrapper || { 'margin-top': '10px', 'margin-bottom': '10px' })
    let $inputArea = $('<textarea/>').attr('name', prop).css(input || { 'margin-top': '0px' })

    if (data || data === 0)
        $inputArea.text(data)

    if (label)
        $wrapper.append($('<label/>').css({ "display": "block" }).attr('for', prop).wiki(label))

    if (callback)
    $inputArea.change(function () {
        callback($(this).val())
    })

    return $wrapper.append($inputArea)
}

export function createSection({ label, map, prop, data, field: { sectionLevel }, field }) {
    let $sectionTitle = $('<div/>').css({ 'display': 'flex', 'flex-direction': 'row', 'align-items': 'center' }).wiki(`${_.repeat('!', sectionLevel)}__${label}__`)
    let $wrapper = $('<div/>').attr('name', prop).append($sectionTitle).data(data)
    if (field.hasAdd) {
        let $addBtn = createButton({
            type: 'Add',
            icon: 'fa-plus',
            style: { "width": "35px", "height": "35px", "border-radius": "5px", "margin-left": "10px", "display": (data && !_.isEmpty(data)) ? 'none' : 'block' },
            callback: function () {
                let data = createEmpty({ children: map.children, deep: true })
                $wrapper.data(data)
                if (data)
                    _.each(map.children, ({ name, propName, type, field, children }) => {
                        createField({
                            $parent: $wrapper,
                            data: data[propName],
                            dataObj: dataObjs[field.data],
                            type, field,
                            prop: propName,
                            label: `${name}: `,
                            map: { children },
                            style: { wrapper: false, input: false },
                            callback: function(value){$wrapper.data(propName,value)}
                        })
                    })
                $(this).css('display', 'none')
                $delBtn.css('display', 'block')
            }
        }).appendTo($sectionTitle)
        let $delBtn = createButton({
            type: 'Delete',
            icon: 'fa-times',
            style: { "width": "35px", "height": "35px", "border-radius": "5px", "margin-left": "10px", "display": (data && !_.isEmpty(data)) ? 'block' : 'none' },
            callback: function () {
                $wrapper.removeData()
                $sectionTitle.siblings().remove()
                $(this).css('display', 'none')
                $addBtn.css('display', 'block')
            }
        }).appendTo($sectionTitle)
    }
    if (data && !_.isEmpty(data))
        _.each(map.children, ({ name, propName, type, field, children }) => {
            createField({
                $parent: $wrapper,
                data: data[propName],
                dataObj: dataObjs[field.data],
                type, field,
                prop: propName,
                label: `${name}: `,
                map: { children },
                style: { wrapper: false, input: false },
                callback: function(value){$wrapper.data(propName,value)}
            })
        })

    return $wrapper
}

export function createField({ $parent, type, field, data, dataObj, prop, label, map, style, callback }) {
    switch (field.type || type) {
        case 'String':
            $parent.append(createInputField({ type: "text", prop, label, data, style, callback }))
            break
        case 'TextArea':
            $parent.append(createTextArea({ label, prop, data, style, callback }))
            break
        case 'Number':
            $parent.append(createInputField({ type: "number", prop, label, data, style, callback }))
            break
        case 'Dropdown':
            createDropdown({ $parent, $menuParent: $parent, label, prop: field.dataProp, displayProp: field.displayProp, data: dataObj, selectedData: data, name: prop, style, callback })
            break
        case 'Boolean':
            createDropdown({ $parent, $menuParent: $parent, label, prop: field.dataProp, displayProp: field.displayProp, data: field.data, selectedData: data, name: prop, style, callback })
            break
        case 'Section':
            $parent.append(createSection({ label, map, prop, data, field, dataObj }))
            break
        case 'Array':
            createTable({
                $parent,
                dataMap: map,
                data,
                name: prop,
                title: label,
                btns: { hasAdd: createEmpty, hasDelete: true },
                editable: function () { },
                dataCallback: callback,
                field
            })
            break
    }
}

export function createEmpty({ children, deep = false, response = {} }) {
    _.each(children, ({ propName, type, children, deep }) => {
        switch (type) {
            case 'String':
                response[propName] = 'New Data'
                break
            case 'Number':
                response[propName] = 0
                break
            case 'Boolean':
                response[propName] = false
                break
            case 'Object':
                response[propName] = (deep) ? createEmpty({ children, deep }) : null
                break
        }
    })
    return response
}