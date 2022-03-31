import { logger } from "./Logging"

export function createDropdown({ $parent, $menuParent, label, name, data, prop, displayProp, selectedData, callback }) {
    let $label = $(`<label for=${name}/>`).wiki(label)
    let $dropDown = $(`<select name="${name}"/>`)

    let $wrapper = $('<div/>').append($label).append($dropDown).css({ width: '100%', "margin-bottom": '10px', "margin-top": '10px' })
    $wrapper.appendTo($parent)
    $dropDown.selectmenu({
        appendTo: $menuParent,
        width: 200
    })

    _.each(data, (val, key) => {
        logger({ key, val })
        $dropDown.append($(`<option value="${val[prop] || key}"/>`).wiki(val[displayProp || prop]))
    })

    if (callback)
        $dropDown.selectmenu({
            select: callback
        })

    $dropDown.selectmenu("refresh", true)

    

    if (selectedData)
        $dropDown.val(selectedData).selectmenu("refresh", true)

    return $dropDown
}

export function createButton({ type, icon, text, style, callback }) {
    let $btn = $('<Button/>')

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

export function createInputField({ type, label, prop, data, style }) {
    let $label = $('<label/>').attr('for', prop).wiki(label)
    let $inputField = $('<input/>').attr('type', type).attr('name', prop)

    if (data)
        $inputField.val(data)

    return $('<div/>').css({ 'margin-top': '10px', 'margin-bottom': '10px' }).append($label).append($inputField)
}