import { attackSkill } from '@js/data'
import { logger } from '@util/Logging';
import { popup } from '@controller/util/ModalPopup'
import _ from 'lodash';

export function skillPassage() {
    let $wrapper = $('<span/>');

    $wrapper.append($('<span/>').wiki(`''__Learned Skills__''`))
    let { passives } = variables().player
    let $list = $('<ul/>').addClass('no-bullets')
    _.each(passives, (skillId) => {
        let { name, desc: { baseDesc } } = attackSkill[skillId]
        $list.append($('<li/>').wiki(`''${name}'' - ${baseDesc}`))
    })
    $wrapper.append($list).append('<br>')
    
    // DEPRECATED
    // $wrapper.append($('<span/>').wiki(`''__Available Skills''`))
    // let $table = $('<table/>').addClass('skillTable');
    // let tableData = [['Skill', 'Description', 'Points']];
    // attackSkill.forEach(function ({ name, desc: { baseDesc }, skillPoints }, idx) {
    //     if (!passives.includes(idx))
    //         tableData.push([name, baseDesc, skillPoints, idx])
    // })

    // $.each(tableData, function (rowIndex, r) {
    //     var $row = $('<tr/>').attr('id', `skill-${r[3]}`)
    //     if (rowIndex > 0) {
    //         $row.append($(`<td/>`).wiki(r[0]))
    //         $row.append($(`<td/>`).wiki(r[1]))
    //         var $button = $(document.createElement('button')).wiki(r[2]).addClass('inactiveButton')
    //         if (variables().player.skillPoints >= r[2]) {
    //             $button.ariaClick(function (ev) {
    //                 let notificationText = ''
    //                 if (variables().player.skillPoints >= r[2]) {
    //                     passives.push(r[3])
    //                     variables().player.skillPoints -= r[2]

    //                     $(`#skill-${r[3]}`).remove()
    //                     $('<li/>').wiki(`''${r[0]}'' - ${r[1]}`).hide().appendTo(`ul.no-bullets`).fadeIn(1000).fadeOut(1000).fadeIn(1000)
    //                 } else
    //                     notificationText = `You don't have enough Skill Points!`

    //                 $('#notificationText').text(notificationText).show().delay(3000).fadeOut('slow')
    //             }).attr('title', 'Test').removeClass('inactiveButton')
    //         }
    //         $row.append($(`<td/>`).addClass('fullSizeTableButton').append($button))
    //     } else {
    //         $.each(r, function (colIndex, c) {
    //             $row.append($(`<th/>`).wiki(c))
    //         })
    //     }
    //     $table.append($row)
    // });

    // $wrapper
    //     .append($('<p/>').attr('id', 'notificationText').css('color', 'red').hide())
    //     .append($table)

    return $wrapper
}