import { returnStatName } from "@controller/character/CharacterController";
import { findSize } from "@controller/character/MeasurementController";
import { attackSkill } from "@js/data";
import { popup } from "@util/ModalPopup";
import _ from "lodash";

Macro.add('attackSkill', {
    skipArgs: false,
    handler: function () {
        // REFACTOR Need to use new character class
        let $wrapper = $('<span/>');
        let { player } = variables()

        $wrapper.append($('<span/>').wiki(`''__Self Defense Class__''`))
        let $table = $('<table/>').addClass('skillTable').addClass('skillTable');
        let tableData = [['Attack', 'Description', 'Requirements', 'Points']];

        _.each(attackSkill, ({ name, desc: { baseDesc }, skillPoints, reqs }, idx) => {
            if (!isLearned(idx, player))
                tableData.push([name, baseDesc, skillPoints, idx, ''])
        })

        $.each(tableData, function (rowIndex, r) {
            var $row = $('<tr/>').attr('id', `attack-${r[3]}`)
            if (rowIndex > 0) {
                $row.append($(`<td/>`).wiki(r[0]))
                $row.append($(`<td/>`).wiki(r[1]))
                let reqText = ``
                $.each(r[4], function (reqName, reqValue) {
                    if (reqText !== ``)
                        reqText += `<br>`
                    reqText += `${returnStatName(reqName)}: ${reqName === 'height' ? findSize(reqValue) : reqValue}`
                })
                $row.append($(`<td/>`).wiki(reqText !== `` ? reqText : `None`))

                var $button = $(document.createElement('button')).wiki(r[2]).addClass('inactiveButton')
                if (player.skillPoints >= r[2] && checkStatReqs(r[4], player)) { // Enough Skill Points and reqs
                    $button.ariaClick(function (ev) {
                        let notificationText = ''
                        if (variables().player.skillPoints >= r[2]) {
                            let atk = attackSkill[r[3]]
                            if (atk.passive)
                                variables().player.passives.push(r[3])
                            else
                                variables().player.learnedAttacks.push({ id: r[3], cooldown: atk.cooldown, currCooldown: 0 })

                            variables().player.skillPoints -= r[2]

                            $(`#attack-${r[3]}`).remove()
                            $('<li/>').wiki(`''${r[0]}'' - ${r[1]}`).hide().appendTo(`ul.no-bullets`).fadeIn(1000).fadeOut(1000).fadeIn(1000)
                            if (variables().settings.info.learnedAttackInfo && !atk.passive)
                                popup(`Learned ${r[0]}`, `You learned ${r[0]}! <br><br>To equip you'll need to go Home and change your moveset.`, { 'Ok': () => { } }, { type: "info", name: 'learnedAttackInfo' })
                        } else
                            notificationText = `You don't have enough Skill Points!`

                        // $('#notificationText').text(notificationText).show().delay(3000).fadeOut('slow')
                    }).removeClass('inactiveButton')
                }


                $row.append($(`<td/>`).addClass('fullSizeTableButton').append($button))
            } else {
                $.each(r, function (colIndex, c) {
                    $row.append($(`<th/>`).wiki(c))
                })
            }
            $table.append($row)
        });

        $wrapper
            .append($('<p/>').attr('id', 'notificationText').css('color', 'red').hide())
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