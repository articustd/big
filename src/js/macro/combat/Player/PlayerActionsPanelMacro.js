import { logger } from "@util/Logging"
import { calcDmgRange, calcHitChance, combatRoll } from "@controller/combat/CombatController";
import { attackSkill } from "@js/data"
import _ from "lodash"
import { parseReq } from "@controller/ReqParser";

Macro.add('playerActionsPanelMacro', {
    skipArgs: false,
    handler: function () {
        let panelType = this.args[0]
        let $wrapper = $('<div/>').addClass('combat-actions-panel-wrapper full-width')
        let actions = []

        switch (panelType) {
            case 'attack':
                actions = getAttackSkills(false)
                if (actions.length > 0)
                    createColumns(actions, $wrapper)
                else
                    $leftColumn.wiki('No Attacks')
                break
            case 'skill':
                actions = getAttackSkills(true)
                if (actions.length > 0)
                    createColumns(actions, $wrapper)
                else
                    $leftColumn.wiki('No Skills')
                break
            case 'dead':
                break
            default:
                logger('Default Panel Type')
        }

        $wrapper
            .appendTo(this.output)

        $(this.output).addClass('full-width')
    }
})

function getAttackSkills(skill) {
    let { player: { attacks } } = variables()
    return _.filter(_.map(attacks, ({ id, currCooldown }) => {
        return { ...attackSkill[id], currCooldown, id }
    }), { skill })
}

function createColumns(actions, $wrapper) {
    _.each(actions, (action, key) => {
        if (key < 4) {
            createAction(action, $wrapper)
        } else
            return false
    })
}

function createAction(action, $column) {
    let { player, enemy } = variables()
    let $link = $('<button/>')
        .addClass('combat-actions-panel-button full-width')
        .click(function () {
            combatRoll(action);
            Engine.play(passage(), true);
        })
        .appendTo($column)

    $link.attr('title', action.desc.atkTooltip)
    checkDisabled($link, action)

    let attackText = `${action.name}<br>`
    if (action.direct && !_.isEmpty(action.direct)) {
        let dmgRange = calcDmgRange(action, player)
        attackText += `[${dmgRange.min}-${dmgRange.max}] `
    }
    attackText += (action.currCooldown > 0) ? `${action.currCooldown} turn${(action.currCooldown > 1 ? 's' : '')}` : `${calcHitChance(action, player, enemy)}%`

    $link.tooltip({ track: true, hide: { duration: 500 } }).wiki(attackText)
}

function checkDisabled($parent, { requirements: {conditions}, currCooldown, desc }) {
    let failedReq;
    _.each(conditions, ({reqCondition, failText})=>{
        if(!boolify(parseReq(reqCondition, variables().player, variables().enemy))) {
            failedReq = failText
            return false
        }
    }) 
    
    if (failedReq && !_.isEmpty(failedReq)) 
        $parent.addClass('disabledAttack').attr('title', failedReq).off()
    else if (currCooldown > 0)
        $parent.addClass('disabledAttack').off()
    else
        $parent.removeClass('disabledAttack')
}

function boolify(value) {
    if(value === 'true' || value === 'false')
        return JSON.parse(value)
    return value
}