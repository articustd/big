import { logger } from "./Logging";
import { popup } from "./ModalPopup";

export function stateEditor() {
    let $popup = $('<div id="stateEditor"/>').dialog({
        title: `State Editor`,
        resizeable: true,
        close: (event, ui)=>{$popup.remove()}
    })

    let $dropDown = createDropdown($popup, `Variable`, `testDropdow`)
    addOptions($dropDown, variables())
    $dropDown.selectmenu({
        select: (event, ui) => { logger(variables()[ui.item.value]); addFields($popup, ui.item.value ,variables()[ui.item.value]) }
    })

    let firstItem = Object.keys(variables())[0]
    addFields($popup, firstItem ,variables()[firstItem])

    return $popup
}

function createDropdown($parent, label, id) {
    let $label = $(`<label for="${id}"/>`).wiki(`${label}: `)
    let $dropDown = $(`<select id="${id}" name="${id}"/>`)

    $parent.append($label).append($dropDown)
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

function addFields($parent, variable, varVal) {
    logger(typeof variable)
    if (typeof varVal == "string") {
        let $label = $(`<label for="${variable}-text"/>`).wiki(`${variable}: `)
        let $dropDown = $(`<input type="text" id="${variable}-text" name="${variable}-text" value="${varVal}"/>`).on('input',function (e){
            variables()[variable] = $(this).val()
            Engine.show()
        })
        $parent.append($label).append($dropDown)
    }
}