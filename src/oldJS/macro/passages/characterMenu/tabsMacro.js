import { attacksPassage } from './attackSkillsMacro'
import { characterStats } from './characterStats'
import { skillPassage } from './skillPassage'

Macro.add('tabMacro', {
    skipArgs: false,
    handler: function () {
        $('#passages:has(#passage-character)').css('max-width', '60em')
        let $wrapper = $('<div/>')
        let $contentWrapper = $('<div/>').addClass('flex-container')
        let $tabs = $('<div/>').addClass('tab')

        let $skillsTab = $('<button/>').addClass('tabLinks').addClass('active').ariaClick(function (ev) {
            variables().charTab = 'skills'
            openTab(ev, 'skills')
        }).text(`Skills`).attr('id', 'skillsTab')

        $tabs.append($skillsTab)

        // let $attacksTab = $('<button/>').addClass('tabLinks').ariaClick(function (ev) {
        //     variables().charTab = 'attacks'
        //     openTab(ev, 'attacks')
        // }).text(`Attacks`).attr('id', 'attacksTab')

        // $tabs.append($attacksTab)

        $wrapper.append($tabs)

        characterStats().appendTo($contentWrapper)

        skillPassage()
            .addClass('tabOpen')
            .addClass('tabContent')
            .attr('id', 'skills')
            .appendTo($contentWrapper)

        // attacksPassage()
        //     .addClass('tabContent')
        //     .attr('id', 'attacks')
        //     .appendTo($contentWrapper)

        $wrapper.append($contentWrapper).appendTo(this.output);
    }
})

function openTab(evt, tabName) {
    $('.tabOpen').removeClass('tabOpen');
    $('button.active').removeClass('active')
    $(`#${tabName}`).addClass('tabOpen')
    $(`#${tabName}Tab`).addClass('active')
}