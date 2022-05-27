import { losePrey } from "@controller/character/CapacityController";
import { returnStatName } from "@controller/character/CharacterController";
import { rollItems } from "@controller/character/ItemController";
import { attackSkill, statusEffect } from "@js/data";
import { logger } from "@util/Logging";
import _ from "lodash";

/* Combat calculations */
export function combatRoll(playerAttack) {
	// Pull in variables() for Logs
	if (!variables().playerCombatLog || !variables().enemyCombatLog)
		setState({ playerCombatLog: [], enemyCombatLog: [] })

	let { player, playerCombatLog, enemy, enemyCombatLog } = variables()

	// Get enemy attack
	let enemyAttack = getEnemyAttack(enemy, { runaway: true })

	// Who goes first based on dex
	decideTurnOrder(
		player,
		enemy,
		attackTurn(player, enemy, playerAttack, true, playerCombatLog),
		attackTurn(enemy, player, enemyAttack, false, enemyCombatLog)
	)

	// Reduce Status Effects
	reduceStatusEffect(player)
	reduceStatusEffect(enemy)

	// Reduce Cooldowns
	reduceCooldowns(player)
	reduceCooldowns(enemy)

	// Set new cooldowns
	setCooldown(player, playerAttack)
	setCooldown(enemy, enemyAttack)

	if (_.isBoolean(temporary().playerDead)) {
		if (temporary().playerDead)
			setState({
				combat: false,
				combatResults: `You took a blow to the head and begin to pass out. As you pass out, you feel all your experience fading away.`
			})
		else
			setState({ combat: false, win: true, combatResults: `You've knocked out your enemy!`, foundItems: rollItems(enemy, enemy.credits) })

		variables().player.statusEffect = []
	}
}

function setState(obj) {
	_.each(obj, (value, key) => {
		variables()[key] = value
	})
}

function deleteState(obj) {
	_.each(obj, (value, key) => {
		delete variables()[key]
	})
}

function getHTML(text, css = { 'color': 'white' }) {
	return $('<span/>').css(css).wiki(text)
}

function calcCombatHit(attack, attacker, defender) {
	let hitChance = 100 - calcHitChance(attack, attacker, defender);
	let hitRoll = random(1, 100)
	if (hitRoll > hitChance) {
		if (hitRoll >= 100)
			return { hit: true, crit: true }
		return { hit: true, crit: false }
	}
	return { hit: false, crit: false }
}

export function calcHitChance(attack, attacker, defender, baseHit = 0, hitPer = 0) {
	// Base Stats
	let { stats: { con: atkCon, dex: atkDex } } = attacker
	let { stats: { con: defCon, dex: defDex } } = defender

	// Direct Attack
	if (attack.direct && !_.isEmpty(attack.direct))
		baseHit = attack.direct.hit
	else
		baseHit = attack.status.hit

	hitPer = ((atkDex / 4) + baseHit) + atkCon - defCon

	// Skill
	if (attacker.skills)
		hitPer += getHitSkillMod(attacker)

	// Status Effects
	_.each(_.filter(attacker.statusEffect, { mod: { type: "hit" } }), function ({ mod, finalEffect }) {
		hitPer += mod.amt
		return !finalEffect
	})
	_.each(_.filter(defender.statusEffect, { mod: { type: "hit" } }), function ({ name, mod, finalEffect }) {
		if(name === 'Blind') // FIXME temporary fix for v0.9.2
			hitPer += 15
		return !finalEffect
	})

	return _.clamp(_.floor(hitPer), 0, 100)
}

function calcCombatDmg(attack, attacker, crit) {
	let { min, max } = calcDmgRange(attack, attacker)
	return _.floor(_.random(min, max)) * ((crit && attack.direct.dmg.crit.canCrit) ? attack.direct.dmg.crit.critMulti : 1)
}

export function calcDmgRange({ direct: { dmg, stat } }, attacker) {
	// Base Stats
	let dmgRange = {
		min: Math.floor(Math.pow(attacker.stats[stat], dmg.min)),
		max: Math.floor(Math.pow(attacker.stats[stat], dmg.max))
	}
	// Skill
	if (attacker.passives)
		dmgRange = getDmgSkillMod(attacker, dmgRange)

	// Status Effect
	return dmgRange
}

function checkHealth({ stats: { hlth } }) {
	return hlth > 0
}

function reduceHealth(defender, dmg) {
	defender.stats.hlth = _.clamp(defender.stats.hlth - dmg, 0, defender.stats.hlth)
}

function getHitSkillMod(character, hitMod = 0) {
	let passiveList = getPassiveSkills('hit', character)

	_.each(passiveList, ({ status: { mod: { type, min, max, amt, multi } } }) => {
		hitMod += amt
	})

	return hitMod
}

function getDmgSkillMod(character, value, multipliers = []) {
	let passiveList = getPassiveSkills('dmg', character)

	_.each(passiveList, ({ status: { mod: { type, min, max, amt, multi } } }) => {
		if (multi)
			multipliers.push({ min, max, amt })
		else {
			(min) ? value.min += min : 0;
			(max) ? value.max += max : 0
		}
	})

	_.each(multipliers, ({ min, max, amt }) => {
		(min) ? value.min *= min : 0;
		(max) ? value.max *= max : 0
	})

	return value
}

function getPassiveSkills(type, { passives }) {
	return _.filter(_.map(passives, (node) => {
		return attackSkill[node]
	}), { status: { mod: { type } } })
}

export function combatReset() {
	resetCooldown(variables().player)

	deleteState({
		enemyHitDmg: true,
		enemyCombatLog: true,
		foundItems: true,
		playerHitDmg: true,
		combatResults: true,
		playerCombatLog: true,
		enemy: true,
		willing: true,
		consumeObj: true
	})

	setState({ combat: false, win: false })
}

export function loseExp() {
	for (let exp in State.variables.player.exp)
		variables().player.exp[exp] = 0

	for (let cap in State.variables.player.capacity)
		if (!cap.contains('Max'))
			variables().player.capacity[cap] = 0

}

export function getExpText(consumePoints) {
	let consumeExp = []
	for (let cp in consumePoints)
		consumeExp.push(`Gained +${Math.ceil(consumePoints[cp])} ${returnStatName(cp)} to Experience`)
	return consumeExp
}

function inflictStatus({ status: { type, duration, mod, dmg } }, defender) {
	let { name, finalEffect } = statusEffect[type]
	if (_.isEmpty(_.filter(defender.statusEffect, { name }))) {
		defender.statusEffect.push({ name, duration, mod, dmg, finalEffect })
		return true
	}
	return false
}

function reduceStatusEffect({ statusEffect }) {
	_.remove(statusEffect, (n) => { return n.duration === 0 })
	_.each(statusEffect, (status) => {
		status.duration -= 1
	})
}

function statusDamage({ statusEffect }, combatMessage, dmg = 0) {
	_.each(_.filter(statusEffect, (se) => { return !_.isEmpty(se.dmg) }), ({ name, dmg: { min, max } }) => {
		let damage = _.floor(_.random(min, max))
		dmg += damage
		combatMessage.push(`Took ${damage} damage from ${name}!`)
	})
	return dmg
}

function setCooldown(character, { cooldown, id }) {
	_.each(character.attacks, (atk) => {
		if (atk.id === id)
			atk.currCooldown = cooldown
	})
}

function resetCooldown(character) {
	_.each(character.attacks, (atk) => {
		atk.currCooldown = 0
	})
}

function reduceCooldowns({ attacks }) {
	_.each(attacks, (atk) => {
		if (atk.currCooldown > 0)
			atk.currCooldown -= 1
	})
}

function getEnemyAttack(enemy, atk = {}) {
	if ((enemy.stats.hlth / enemy.stats.maxHlth) <= 0.1 && _.random(0, 100) < 5)
		return atk

	atk = _.sample(_.filter(enemy.attacks, { currCooldown: 0 }))
	return { ...attackSkill[atk.id], ...atk }
}

function endCombat(isPlayer) {
	temporary().playerDead = isPlayer
}

export function fleeChance({ stats: { dex: atkDex } }, { stats: { dex: defDex } }) {
	return _.clamp(atkDex * (200 / defDex) / 4, 1, 100)
}

function attemptFlee(attacker, defender) {
	return fleeChance(attacker, defender) >= _.random(1, 100)
}

function decideTurnOrder(player, enemy, playerAttack, enemyAttack) {
	if (player.stats.dex > enemy.stats.dex) {
		playerAttack
		enemyAttack
	} else {
		enemyAttack
		playerAttack
	}
}

function buildCombatMessage(combatMessage, css = {'color':'white'}) {
	return getHTML(_.join(combatMessage, '<br/>'), css)
}

function attackTurn(attacker, defender, attack, isPlayer, combatLog, combatMessage = []) {
	if (checkHealth(attacker) && checkHealth(defender) && variables().combat) { // Check if both are alive and combat is still going
		if (typeof attack.runaway !== 'undefined') { // Attacker is attempting to run
			if (attemptFlee(attacker, defender)) {
				variables().combat = false
				combatLog.push(getHTML(`${attacker.name} turned tail and fled!`)) // Push directly into the combat log
				return // No need to do the rest
			} else
				combatMessage.push(`${attacker.name} tried to run, but was unable to!`)
		} else { // Normal attack
			let { hit, crit, combatText = "" } = calcCombatHit(attack, attacker, defender)
			if (hit) { // See if there is a hit
				if (attack.direct && !_.isEmpty(attack.direct)) { // Attack has direct damage
					let damage = calcCombatDmg(attack, attacker, isPlayer ? crit : false)
					reduceHealth(defender, damage)
					combatText = `Hit ${defender.name} for ${damage} damage`
					if (attack.status && !_.isEmpty(attack.status)) { // Attack also has status effect that has it's own hit accuracy (Bleed etc...)
						({ hit } = calcCombatHit({ status: attack.status }, attacker, defender))
						if (hit) {
							if (inflictStatus(attack, defender))
								combatText += ` and inflicted ${statusEffect[attack.status.type].name}`
						}
					}
					combatText += '!'
				} else if (attack.status && !_.isEmpty(attack.status)) { // Attack only has a status effect and hit chance was already calculated
					if (inflictStatus(attack, defender))
						combatText += `${attack.name} ${defender.name}, inflicting them with ${statusEffect[attack.status.type].name}`
					else
						combatText += `Nothing happened, ${defender.name} already has ${statusEffect[attack.status.type].name}`
				}

				combatMessage.push(combatText) // Add to message stack

				if (!checkHealth(defender)) // Check defender health
					endCombat(!isPlayer)
			} else // Attack missed, notify
				combatMessage.push(`Missed ${defender.name} with ${attack.name}!`)
		}

		if (!_.isBoolean(temporary().playerDead)) { // Check to see if combat ended
			let damage = statusDamage(attacker, combatMessage)
			reduceHealth(attacker, damage)
			if (!checkHealth(attacker)) {
				combatMessage.push(`${attacker.name} passed out!`)
				endCombat(isPlayer)
			}
		}
	} else if (checkHealth(defender) && !variables().combat) { // Check to see if defender ran 
		combatMessage.push(`Not quick enough to catch up as ${defender.name} runs away.`)
	} else // Attacker has died, notify their combat log
		combatMessage.push(`${attacker.name} passed out!`)

	combatLog.push(buildCombatMessage(combatMessage))
}