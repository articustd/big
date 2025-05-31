import { logger } from "@util/Logging"
import { isAlive, rest } from "@controller/character/CharacterController"
import { combatReset, combatRoll, fleeChance, getAttackSkills, loseExp } from "@controller/combat/CombatController"
import { losePrey } from "@controller/character/CapacityController"

/**
 * Macro used to display action buttons for the player on the combat screen. Includes Attacks, Skills, Run/Leave.
 */
Macro.add('playerActionsMacro', {
    skipArgs: false,
    handler: function () {
        let { player, enemy } = variables()
        let playerAlive = isAlive(player)
        let enemyAlive = isAlive(enemy)
        let $wrapper = $('<div/>').addClass("combat-actions-wrapper")

        let $leaveBtn = $('<button/>').addClass('combat-actions-button combat-actions-leave').click(() => {
            if (playerAlive && enemyAlive && variables().combat) {
                combatRoll({ runaway: true })
                Engine.play(passage(), true);
                return
            }

            if (!playerAlive) {
                rest(player)
                variables().restText = losePrey(player)
                Engine.play('home')
            } else
                Engine.play(variables().return)

            combatReset()
        })

        if (playerAlive && enemyAlive && variables().combat) {
            let $atkButton = $('<button/>').addClass('combat-actions-button combat-actions-attack').wiki(`Attacks`).click(function () {
                switchPanels('attack')
            }).appendTo($wrapper)
            if (getAttackSkills(false, player).length === 0)
                $atkButton.addClass('disabledAttack').off()

            let $skillButton = $('<button/>').addClass('combat-actions-button combat-actions-skills').wiki(`Skills`).click(function () {
                switchPanels('skill')
            }).appendTo($wrapper)
            if (getAttackSkills(true, player).length === 0)
                $skillButton.addClass('disabledAttack').off()

            $leaveBtn.wiki(`Run`).appendTo($wrapper)
        }

        $wrapper.appendTo(this.output)

        if (!playerAlive) {
            $leaveBtn.wiki('Pass Out').appendTo($wrapper)
            switchPanels('dead')
        }
        else if (!enemyAlive) {
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