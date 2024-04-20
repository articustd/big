import { returnStatName } from "@controller/character/CharacterController";
import { findSize } from "@controller/character/MeasurementController";
import { attackSkill } from "@js/data";
import { popup } from "@util/ModalPopup";
import _ from "lodash";

Macro.add('attackSkill', {
    skipArgs: false,
    handler: function () {
        let $wrapper = $('<span/>');
        let player = variables().player

        $wrapper.append($('<span/>').wiki(`''__Self-defense class__''`))
        let $table = $('<div/>').addClass('skillTable').addClass('grid skill-grid');
        let tableData = [['Attack', 'Description', 'Requirements', 'Points']];

        _.each(attackSkill, ({ name, desc: { baseDesc }, skillPoints, reqs }, idx) => {
            if (!isLearned(idx, player))
                tableData.push([name, baseDesc, skillPoints, idx, ''])
        })

        $.each(tableData, function (rowIndex, r) {
            if (rowIndex > 0) {
                $table.append($(`<div/>`).wiki(r[0]).addClass(`skill-grid-name attack-${r[3]}`))
                $table.append($(`<div/>`).wiki(r[1]).addClass(`skill-grid-description attack-${r[3]}`))
                let reqText = ``
                $.each(r[4], function (reqName, reqValue) {
                    if (reqText !== ``)
                        reqText += `<br>`
                    reqText += `${returnStatName(reqName)}: ${reqName === 'height' ? findSize(reqValue) : reqValue}`
                })
                $table.append($(`<div/>`).wiki(reqText !== `` ? reqText : `None`).addClass(`skill-grid-requirements attack-${r[3]}`))

                var $button = $(document.createElement('button')).wiki(r[2]).addClass('inactiveButton')
                if (player.skillPoints >= r[2] && checkStatReqs(r[4], player)) { // Enough Skill Points and reqs
                    $button.ariaClick(function (ev) {
                        let notificationText = ''
                        if (variables().player.skillPoints >= r[2]) {
                            let atk = attackSkill[r[3]]
                            if(atk.passive)
                                variables().player.passives.push(r[3])
                            else
                                variables().player.learnedAttacks.push({id: r[3], cooldown: atk.cooldown, currCooldown: 0})

                            variables().player.skillPoints -= r[2]

                            $(`.attack-${r[3]}`).remove()
                            $('<li/>').wiki(`''${r[0]}'' - ${r[1]}`).hide().appendTo(`ul.no-bullets`).fadeIn(1000).fadeOut(1000).fadeIn(1000)
                            if (variables().settings.info.learnedAttackInfo && !atk.passive)
                                popup(`Learned ${r[0]}`, `You learned ${r[0]}! <br><br>To equip you'll need to go Home and change your moveset.`, { 'Ok': () => { } }, { type: "info", name: 'learnedAttackInfo' })
                        } else
                            notificationText = `You don't have enough Skill Points!`

                        // $('#notificationText').text(notificationText).show().delay(3000).fadeOut('slow')
                    }).removeClass('inactiveButton')
                }


                $table.append($(`<div/>`).append($button).addClass(`skill-grid-buy attack-${r[3]}`))
                $table.append($(`<hr/>`).addClass(`attack-${r[3]}`))
            } else {
                $.each(r, function (colIndex, c) {
                    $table.append($(`<div/>`).wiki(c).addClass('grid-header'))
                })
            }
            $table.append($table)
        });

        $wrapper
            .append($('<p/>').attr('id', 'notificationText').addClass('red-text').hide())
            .append($table)
            .appendTo(this.output)

        return $wrapper
    }
})

function checkStatReqs(reqs, player) {
    for (let req in reqs)
        if (reqs[req] > findJSONValueByKey(player, req))
            return false

    return true
}

function findJSONValueByKey(json, key) {
    let temp;
    for (let k in json) {
        if (typeof (json[k]) === "object" && !Array.isArray(json[k]))
            temp = findJSONValueByKey(json[k], key)

        if (typeof temp !== 'undefined')
            return temp

        if (k === key)
            return json[k]
    }
}

function isLearned(idx, char, response = false) {
    _.each(char.learnedAttacks, ({ id }) => {
        if (id === idx) {
            response = true
            return false
        }
    })
    return response || char.passives.includes(idx)
}