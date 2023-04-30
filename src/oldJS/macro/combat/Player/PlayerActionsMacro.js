import { logger } from "@util/Logging"
import { attackSkill } from "@js/data"
import { combatReset, combatRoll, fleeChance, loseExp } from "@controller/combat/CombatController"
import { losePrey } from "@controller/character/CapacityController"

Macro.add('playerActionsMacro', {
    skipArgs: false,
    handler: function () {
        let { player, enemy, combat, return: returnPassage } = variables()
        let $wrapper = $('<div/>').css({ 'display': 'flex', 'flex-direction': 'column', 'margin': '5px 0px' })

        let $leaveBtn = $('<button/>').css({ 'margin-top': '5px', 'height': '50px', 'font-size': '25px', 'border-radius': '0px 0px 0px 3px', 'background-color': 'red', 'border-color': 'red' }).click(() => {
            if (player.isAlive() && enemy.isAlive() && combat) {
                combatRoll({ runaway: true })
                Engine.play(passage(), true);
                return
            }

            // REFACTOR Need to use new character class
            if (!player.isAlive()) {
                player.rest()
                variables().restText = losePrey(player)
                Engine.play('home')
            } else
                Engine.play(returnPassage)

            combatReset()
        })

        if (player.isAlive() && enemy.isAlive() && combat) {
            let $atkButton = $('<button/>').wiki(`Attacks`).css({ 'margin-bottom': '5px', 'height': '50px', 'font-size': '25px', 'border-radius': '3px 0px 0px 0px', 'position': 'relative' }).click(function () {
                switchPanels('attack')
            }).appendTo($wrapper)
            if (getAttackSkills(false).length === 0)
                $atkButton.addClass('disabledAttack').off()

            let $skillButton = $('<button/>').wiki(`Skills`).css({ 'height': '50px', 'font-size': '25px' }).click(function () {
                switchPanels('skill')
            }).appendTo($wrapper)
            if (getAttackSkills(true).length === 0)
                $skillButton.addClass('disabledAttack').off()

            $leaveBtn.wiki(`Run`).appendTo($wrapper)
        }

        $wrapper.appendTo(this.output)

        if (!player.isAlive()) {
            $leaveBtn.wiki('Pass Out').appendTo($wrapper)
            switchPanels('dead')
        }
        else if (!enemy.isAlive()) {
            switchPanels('loot')
            $wrapper.wiki(`<<consumeEnemy $enemy>>`)
        } else if (!variables().combat) {
            $leaveBtn.wiki('Leave').appendTo($wrapper)
        }

    }
})

function switchPanels(type) {
    let $actionPanel = $('#actionPanel')
    let $statPanel = $('#statPanel')
    let $lootPanel = $('#lootPanel')

    $statPanel.css({ 'display': 'none' })
    if (type === 'loot') {
        $lootPanel.css({ 'display': 'flex' })
        return
    }

    if (type === 'dead') {
        return
    }

    if ($actionPanel.data().type && $actionPanel.data().type === type) {
        $actionPanel.data({ type: 'none' })
        $actionPanel.css({ 'display': 'none' })
        $statPanel.css({ 'display': 'flex' })
        return
    }

    $actionPanel.empty()
    $actionPanel.wiki(`<<playerActionsPanelMacro ${type}>>`)
    $actionPanel.data({ type })

    $actionPanel.css({ 'display': 'flex' })
}

function getAttackSkills(skill) {
    let { player: { attacks } } = variables()
    return _.filter(_.map(attacks, ({ id, currCooldown }) => {
        return { ...attackSkill[id], currCooldown, id }
    }), { skill })
}