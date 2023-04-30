import { calcDmgRange, calcHitChance, combatRoll } from "@controller/combat/CombatController";
import { attackSkill } from "@js/data"
import { logger } from "@util/Logging";
import _ from "lodash";

Macro.add('attackAction', {
    skipArgs: false,
    handler: function () {
        let { player, enemy, player: { attacks } } = variables()

        _.each(attackList, (attack) => {
            let $link = $('<button/>')
                .css({ 'margin-bottom': '10px', 'flex-grow': 1 })
                .click(function () {
                    combatRoll(attack);
                    Engine.play(passage(), true);
                })
                .appendTo($column)

            $link.attr('title', attack.desc.atkTooltip)
            checkDisabled($link, attack)

            let attackText = `${attack.name}<br>`
            if (attack.direct && !_.isEmpty(attack.direct)) {
                let dmgRange = calcDmgRange(attack, player)
                attackText += `[${dmgRange.min}-${dmgRange.max}] `
            }
            attackText += (attack.currCooldown>0)?`${attack.currCooldown} turn${(attack.currCooldown > 1 ? 's' : '')}`:`${calcHitChance(attack, player, enemy)}%`

            $link.tooltip({ track: true, hide: { duration: 500 } }).wiki(attackText)
        })
    }
})

function checkDisabled($parent, { req, currCooldown, desc }) {
    if (req && !_.isEmpty(req))
        $parent.addClass('disabledAttack').attr('title', req.tooltip).off()
    else if (currCooldown > 0)
        $parent.addClass('disabledAttack').off()
    else
        $parent.removeClass('disabledAttack')
}