import { getAttackSkill, getSkillById, returnStatName } from "@controller/character/CharacterController";
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

	// Ready storage for damage done
	let playerDmg, enemyDmg;

	// Check if player hits
	let { hit, crit } = calcCombatHit(playerAttack, player, enemy)
	if (hit) { // CLEANUP Messy for both player and enemy sections
		if (playerAttack.direct && !_.isEmpty(playerAttack.direct)) {
			playerDmg = calcCombatDmg(playerAttack, player, crit)
			reduceHealth(enemy, playerDmg)
			playerCombatLog.push(getHitHTML("Pummled the enemy"))
			enemyCombatLog.push(getDmgHTML(`Took the hit on the jaw for ${playerDmg} damage`))
		}
		if (playerAttack.status && !_.isEmpty(playerAttack.status)) {
			inflictStatus(playerAttack, enemy)
		}

	} else {
		playerCombatLog.push(getMissHTML("Swung wide and missed"))
		enemyCombatLog.push(getDodgeHTML(`Jumped to the side`))
	}

	// Random enemy attack and roll for enemy hit
	let enemyAttack = getEnemyAttack(enemy)
	enemyAttack = { ...attackSkill[enemyAttack.id], ...enemyAttack } // CLEANUP Compress down into getEnemyAttack()
	if (checkHealth(enemy)) { // Check to see if enemy is alive first
		({ hit } = calcCombatHit(enemyAttack, enemy, player))
		if (hit) {
			if (enemyAttack.direct && !_.isEmpty(enemyAttack.direct)) {
				enemyDmg = calcCombatDmg(enemyAttack, enemy, false)
				reduceHealth(player, enemyDmg)
				enemyCombatLog.push(getHitHTML(`Pummeled you`))
				playerCombatLog.push(getDmgHTML(`You took the hit on the jaw for ${enemyDmg} damage`))
			}
			if (enemyAttack.status && !_.isEmpty(enemyAttack.status)) {
				inflictStatus(enemyAttack, player)
			}
		} else {
			enemyCombatLog.push(getDodgeHTML(`Swung wide and missed`))
			playerCombatLog.push(getMissHTML("Jumped to the side"))
		}

	}

	// Reduce Status Effects
	reduceStatusEffect(player)
	reduceStatusEffect(enemy)

	// Reduce Cooldowns
	reduceCooldowns(player)
	reduceCooldowns(enemy)

	// Set new cooldowns
	setCooldown(player, playerAttack)
	setCooldown(enemy, enemyAttack)

	if (!checkHealth(enemy)) {
		// enemyHitText = "Enemy has passed out!"
		setState({ combat: false, win: true, combatResults: `You've knocked out your enemy!`, foundItems: rollItems(enemy.loot, enemy.credits) })
		variables().player.statusEffect = []
		resetCooldown(player)
	}

	if (!checkHealth(player)) {
		for (let exp in player.exp)
			player.exp[exp] = 0;

		setState({
			combat: false,
			combatResults: `You took a blow to the head and begin to pass out. As you pass out, you feel all your experience fading away.`
		})
		variables().player.statusEffect = []
		resetCooldown(player)
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

function getHitHTML(text) {
	return `<span style="color:green">${text}</span>`
}

function getDmgHTML(text) {
	return `<span style="color:red">${text}</span>`
}

function getMissHTML(text) {
	return `<span style="color:white">${text}</span>`
}

function getDodgeHTML(text) {
	return `<span style="color:white">${text}</span>`
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
	if (attack.direct)
		baseHit = attack.direct.hit
	else
		baseHit = attack.status.hit

	hitPer = ((atkDex / 4) + baseHit) + atkCon - defCon

	// Skill
	if (attacker.skills)
		hitPer += getHitSkillMod(attacker)

	// Status Effects
	// CLEANUP This needs to be attached to a data object instead of explicitly looking for a name
	_.each(attacker.statusEffect, function ({ name, mod }) {
		if (name === 'Blind') {
			hitPer = 0
			return false
		}
	})
	return _.clamp(_.floor(hitPer), 0, 100)
}

function calcCombatDmg(attack, attacker, crit) {
	let { min, max } = calcDmgRange(attack, attacker)
	return _.floor(_.random(min, max) * ((crit) ? attack.critMulti : 1))
}

export function calcDmgRange({ direct: { dmg, stat } }, attacker) {
	// Base Stats
	let dmgRange = { min: Math.floor(Math.pow(attacker.stats[stat], dmg.min)), max: Math.floor(Math.pow(attacker.stats[stat], dmg.max)) }

	// Skill
	if (attacker.passives)
		dmgRange = getDmgSkillMod(attacker, dmgRange)

	// Status Effect

	return dmgRange
}

function checkHealth(defender) {
	return (defender.stats.hlth > 0) ? true : false
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

let hitText = [
	{ give: "You wolloped them good!", take: "You were hit square in the face!" }
]
let missText = [
	{ give: "You swung wide!", take: "You dodged out of the way!" }
]

export function combatReset() {
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

function inflictStatus({ status: { type, duration } }, enemy) {
	let { name } = statusEffect[type]
	enemy.statusEffect.push({ name, duration })
}

function reduceStatusEffect({ statusEffect }) {
	_.each(statusEffect, (status, idx) => {
		statusEffect = _.remove(statusEffect, (n) => { return n.duration === 0 })
		status.duration -= 1
	})
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

function getEnemyAttack(enemy) {
	return _.sample(_.filter(enemy.attacks, { currCooldown: 0 }))
}