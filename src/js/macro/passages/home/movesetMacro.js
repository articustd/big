import { attacks } from '@js/data'
import { logger } from '@util/Logging'

Macro.add('movesetMacro', {
    skipArgs: false,
    handler: function () {
        let player = State.variables.player
        let $wrapper = $('<div/>')

        let $columnOne = createLane('equipped', 3)

        // $columnOne.append($('<span/>').text('Attacks').css('width','100%').css('float', 'left'))
        for (let attackId of player.attacks)
            $columnOne.append(createCard(attackId))

        let $columnTwo = createLane('available', 30)

        for (let attackId of player.learnedAttacks)
            if (!player.attacks.includes(attackId))
                $columnTwo.append(createCard(attackId))

        $wrapper
            .append($('<span/>').text('Equipped Attacks')
                .css({ "font-size": "x-large", "border-bottom": "2px dotted white", "cursor": "help" })
                .tooltip({ track: true, hide: { duration: 500 } })
                .attr('title', `Drag attacks to either equip or unquip them. Equipped attacks will appear in order from left to right.`))
            .append($('<span/>').text(`${player.attacks.length}/3`).attr('id', 'outOf').css({ "font-size": "x-large", "padding-left": "0.5em" }))
            .append($columnOne)
            .append($('<br>'))
            .append($('<span/>').text('Available Attacks').css({ "font-size": "x-large" }))
            .append($columnTwo)
            .appendTo(this.output)


    }
})

function createCard(attackId) {
    let attack = attacks.attacks[attackId]
    let $portlet = $('<div/>')
        .addClass('portlet')
        .addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
        .attr('value', attackId)

    let $portletHeader = $('<div/>').addClass('portlet-header').text(attack.name)
    // let $portletToggle = $("<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>")
    // $portletToggle.on("click", function () {
    //     var icon = $(this);
    //     icon.toggleClass("ui-icon-minusthick ui-icon-plusthick");
    //     icon.closest(".portlet").find(".portlet-content").toggle();
    // });
    $portletHeader
        .addClass("ui-widget-header ui-corner-all")
    // .append($portletToggle);
    $portlet.append($portletHeader)
    $portlet.append($('<div/>').addClass('portlet-content').wiki(attack.desc))

    return $portlet
}

function createLane(id, size) {
    return $('<div/>').addClass('portlet-row').attr('id', id).sortable({
        connectWith: ".portlet-row",
        handle: ".portlet-header",
        tolerance: "pointer",
        forcePlaceholderSize: true,
        cursor: "grabbing",
        update: function (event, ui) {
            if (this.id === 'equipped') {
                State.variables.player.attacks = $(this).sortable("toArray", { attribute: 'value' }).map(Number);
                $('#outOf').text(`${State.variables.player.attacks.length}/3`)
            }
        },
        receive: function (event, ui) {
            if ($(this).children().length > size)
                $(ui.sender).sortable('cancel');
        }
    })
}