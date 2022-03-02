import { calcDmgRange, calcHitChance, combatRoll } from "@controller/combat/CombatController";
import { attacks } from "@js/data"
import { logger } from "@util/Logging";

Macro.add('attackAction', {
    skipArgs: false,
    handler: function () {
        let playerAttacks = this.args[0];
        let player = variables().player;
        let enemy = variables().enemy;
        let $wrapper = $('<div/>').css('display', 'flex').css('flex-direction', 'column')

        for (let attackId of playerAttacks) {
            let attack = attacks[attackId]


            let $link = $('<button/>')
            if (attack.reqs.isDisabled(player, enemy)) {
                $link.prop('disabled', attack.reqs.isDisabled(player, enemy))
                    .tooltip({ track: true, hide: { duration: 500 } })
                    .attr('title', attack.reqs.disabledToolTip)
            }

            let dmgRange = calcDmgRange(attack, State.variables.player)
            let attackText = `${attack.name}<br>[${dmgRange.min}-${dmgRange.max}] ${calcHitChance(attack, State.variables.player)}%`

            $link
                .wiki(attackText)
                .ariaClick(function (ev) {
                    combatRoll(attack);
                    Engine.play(passage(), true)
                })
                .css('margin-bottom', '10px')
                .css('flex-grow', '1')
                // .attr('id', `macro-${this.name}-${this.args.join('').replace(/[^A-Za-z0-9]/g, '')}`)
                .appendTo($wrapper);
        }

        $wrapper
            .appendTo(this.output);
    }
})