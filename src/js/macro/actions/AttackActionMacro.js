import { calcDmgRange, calcHitChance, combatRoll } from "@controller/combat/CombatController";
import { attackSkill } from "@js/data"
import { logger } from "@util/Logging";

Macro.add('attackAction', {
    skipArgs: false,
    handler: function () {
        let isSkill = this.args[0]
        let { player, enemy, player: { attacks } } = variables()
        let $wrapper = $('<div/>').css('display', 'flex').css('flex-direction', 'column').appendTo(this.output)

        let attackList = _.filter(attackSkill, ({ skill, passive }, idx) => {
            return !passive && skill === isSkill && attacks.includes(idx)
        })

        _.each(attackList, (attack) => {
            let $link = $('<button/>')
                .css({ 'margin-bottom': '10px', 'flex-grow': 1 })
                .click(() => { combatRoll(attack); Engine.play(passage(), true) })
                .tooltip({ track: true, hide: { duration: 500 } })
                .appendTo($wrapper)

            if (attack.req)
                $link.prop('disabled', attack.reqs.isDisabled(player, enemy)).attr('title', attack.reqs.tooltip)
            else
                $link.attr('title', attack.desc.atkTooltip)

            let attackText = `${attack.name}<br>`
            if (attack.direct) {
                let dmgRange = calcDmgRange(attack, player)
                attackText += `[${dmgRange.min}-${dmgRange.max}] `
            }
            attackText += `${calcHitChance(attack, player, enemy)}%`

            $link.wiki(attackText)
        })
    }
})