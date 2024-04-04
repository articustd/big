import { attackSkill } from '@js/data'
import { logger } from '@util/Logging'
import _ from 'lodash'

//Added JQuery-ui-touch-punch code to fix behavior on mobile devices
//https://github.com/furf/jquery-ui-touch-punch
!function(a){function f(a,b){if(!(a.originalEvent.touches.length>1)){a.preventDefault();var c=a.originalEvent.changedTouches[0],d=document.createEvent("MouseEvents");d.initMouseEvent(b,!0,!0,window,1,c.screenX,c.screenY,c.clientX,c.clientY,!1,!1,!1,!1,0,null),a.target.dispatchEvent(d)}}if(a.support.touch="ontouchend"in document,a.support.touch){var e,b=a.ui.mouse.prototype,c=b._mouseInit,d=b._mouseDestroy;b._touchStart=function(a){var b=this;!e&&b._mouseCapture(a.originalEvent.changedTouches[0])&&(e=!0,b._touchMoved=!1,f(a,"mouseover"),f(a,"mousemove"),f(a,"mousedown"))},b._touchMove=function(a){e&&(this._touchMoved=!0,f(a,"mousemove"))},b._touchEnd=function(a){e&&(f(a,"mouseup"),f(a,"mouseout"),this._touchMoved||f(a,"click"),e=!1)},b._mouseInit=function(){var b=this;b.element.bind({touchstart:a.proxy(b,"_touchStart"),touchmove:a.proxy(b,"_touchMove"),touchend:a.proxy(b,"_touchEnd")}),c.call(b)},b._mouseDestroy=function(){var b=this;b.element.unbind({touchstart:a.proxy(b,"_touchStart"),touchmove:a.proxy(b,"_touchMove"),touchend:a.proxy(b,"_touchEnd")}),d.call(b)}}}(jQuery);

Macro.add('movesetMacro', {
    skipArgs: false,
    handler: function () {
        let player = variables().player
        let $wrapper = $('<div/>')

        let $columnOne = createLane('equipped', 3)

        // $columnOne.append($('<span/>').text('Attacks').css('width','100%').css('float', 'left'))
        _.each(player.attacks, (atk) => { $columnOne.append(createCard(atk)) })

        let $columnTwo = createLane('available', 30)

        _.each(_.filter(player.learnedAttacks, function ({ id }) {
            return _.filter(player.attacks, { id }).length === 0
        }), (atk) => { $columnTwo.append(createCard(atk)) })

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

function createCard(atk) {
    let { name, desc } = attackSkill[atk.id]
    let $portlet = $('<div/>')
        .addClass('portlet')
        .addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
        .attr('value', atk.id)
        .data(atk)

    let $portletHeader = $('<div/>').addClass('portlet-header').text(name)
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

    $portlet.append($('<div/>').addClass('portlet-content').wiki(desc.baseDesc))
    $portlet.append($('<div/>').addClass('portlet-body-header').wiki(`''Crit:'' ${desc.critDesc}`))
    $portlet.append($('<div/>').addClass('portlet-body-header').wiki(`''Stat Mod:''`))
    $portlet.append($('<div/>').addClass('portlet-body-content').wiki(getList(desc.statMods)))
    $portlet.append($('<div/>').addClass('portlet-body-header').wiki(`''Reqs:''`))
    $portlet.append($('<div/>').addClass('portlet-body-content').wiki(getList(desc.reqs)))
    return $portlet
}

function getList(desc, response = '') {
    _.each(desc, (val) => {
        response += `- ${_.values(val)[0]}<br/>`
    })
    return response
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
                let newAtks = []
                $(this).find('> .portlet').each(function () {
                    let { id, cooldown, currCooldown } = $(this).data()
                    newAtks.push({ id, cooldown, currCooldown })
                })
                variables().player.attacks = newAtks;
                $('#outOf').text(`${variables().player.attacks.length}/3`)
            }
        },
        receive: function (event, ui) {
            if ($(this).children().length > size)
                $(ui.sender).sortable('cancel');
        }
    })
}