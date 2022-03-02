import { logger } from "./Logging";

export function stateEditor() {
    let $popup = $('<div id="stateEditor"/>').dialog({
        title: `State Editor`,
        resizeable: true,
        width: 400,
        height: 200,
        close: (event, ui)=>{$popup.remove()}
    })

    let $dropDown = createDropdown($popup, `Variable`, `testDropdow`)
    let $fieldContainer = $('<div id="fieldContainer"/>')
    $popup.append($fieldContainer)
    addOptions($dropDown, variables())
    $dropDown.selectmenu({
        select: (event, ui) => { clearElement($fieldContainer); addField($fieldContainer, ui.item.value ,variables()[ui.item.value]) }
    })

    let firstItem = Object.keys(variables())[0]
    addField($fieldContainer, firstItem ,variables()[firstItem])

    return $popup
}

function createDropdown($parent, label, id) {
    let $label = $(`<label for="${id}"/>`).wiki(`${label}: `)
    let $dropDown = $(`<select id="${id}" name="${id}"/>`)

    let $wrapper = $('<div/>').append($label).append($dropDown).css({width: '100%',"margin-bottom":'10px'})

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

function addField($parent, variable, varVal) {
    logger(typeof variable)
    if (typeof varVal == "string") {
        let $label = $(`<label for="${variable}-text"/>`).wiki(`${variable}: `)
        let $textbox = $(`<input type="text" id="${variable}-text" name="${variable}-text" value="${varVal}"/>`).on('input',function (e){
            variables()[variable] = $(this).val()
            Engine.show()
        })
        $parent.append($('<div/>').append($label).append($textbox))
    }
    if (typeof varVal == "boolean") {
        let $label = $(`<label for="${variable}-text"/>`).wiki(`${variable}: `)
        let $checkbox = $(`<input type="checkbox" id="${variable}-text" ${varVal?'checked':''}/>`).on('input',function (e){
            variables()[variable] = $(this)[0].checked
            Engine.show()
        })

        $parent.append($('<div/>').append($label).append($checkbox))
    }
    if (typeof varVal == "number") {
        let $label = $(`<label for="${variable}-text"/>`).wiki(`${variable}: `)
        let $textbox = $(`<input type="text" id="${variable}-text" name="${variable}-text" value="${varVal}"/>`).on('input',function (e){
            variables()[variable] = Number($(this).val())
            Engine.show()
        }).inputFilter(function(value) {
            return /^-?\d*.?\d*$/.test(value);    // FIXME For some reason allows a single non-numeric character
          });
        $parent.append($('<div/>').append($label).append($textbox))
    }
}

function clearElement($ele) {
    $ele.empty()
}

// Filter for numeric text fields
(function($) {
    $.fn.inputFilter = function(inputFilter) {
      return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function() {
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