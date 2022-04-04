import { getSkillById, returnStatName } from "@controller/character/CharacterController";
import { rollItems } from "@controller/character/ItemController";
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
	let hitChance = calcCombatHit(playerAttack, player, enemy)
	if (hitChance.hit) {
		playerDmg = calcCombatDmg(playerAttack, player, hitChance.crit)
		reduceHealth(enemy, playerDmg)
		playerCombatLog.push(getHitHTML("Pummled the enemy"))
		enemyCombatLog.push(getDmgHTML(`Took the hit on the jaw for ${playerDmg} damage`))
	} else {
		playerCombatLog.push(getMissHTML("Swung wide and missed"))
		enemyCombatLog.push(getDodgeHTML(`Jumped to the side`))
	}

	// Random enemy attack and roll for enemy hit
	// let enemyAttack = randomEnemyAttack(enemy.attackSet);
	let enemyAttack = playerAttack;
	if (checkHealth(enemy)) { // Check to see if enemy is alive first
		hitChance = calcCombatHit(enemyAttack, enemy, player)
		if (hitChance.hit) {
			enemyDmg = calcCombatDmg(enemyAttack, enemy, false)
			reduceHealth(player, enemyDmg)
			enemyCombatLog.push(getHitHTML(`Pummeled you`))
			playerCombatLog.push(getDmgHTML(`You took the hit on the jaw for ${enemyDmg} damage`))
		} else {
			enemyCombatLog.push(getDodgeHTML(`Swung wide and missed`))
			playerCombatLog.push(getMissHTML("Jumped to the side"))
		}
	} else { // Enemy is knocked out
		// enemyHitText = "Enemy has passed out!"
		setState({ combat: false, win: true, combatResults: `You've knocked out your enemy!`, foundItems: rollItems(enemy.loot, enemy.credits) })
	}

	if (!checkHealth(player)) {
		for (let exp in player.exp)
			player.exp[exp] = 0;

		setState({ 
			combat: false, 
			combatResults: `You took a blow to the head and begin to pass out. As you pass out, you feel all your experience fading away.` 
		})
	}
}

function setState(obj) {
	_.each(obj, (value, key) => {
		variables()[key] = value
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

export function calcHitChance(attack, attacker, defender) {
	// Base Stats
	let { stats: { con: atkCon, dex: atkDex } } = attacker
	let { stats: { con: defCon, dex: defDex } } = defender

	let baseHit = 0
	if (attack.direct)
		baseHit = attack.direct.hit
	else
		baseHit = attack.status.hit

	let hitPer = ((atkDex / 4) + baseHit) + atkCon - defCon
	// Status Effect


	// Skill
	if (attacker.skills)
		hitPer += getHitSkillMod(attacker)

	return _.clamp(_.floor(hitPer), 1, 100)
}

function calcCombatDmg(attack, attacker, crit) {
	let { min, max } = calcDmgRange(attack, attacker)
	return _.floor(_.random(min, max) * ((crit) ? attack.critMulti : 1))
}

export function calcDmgRange({ direct: { dmg, stat } }, attacker) {
	// Base Stats
	let dmgRange = { min: Math.floor(Math.pow(attacker.stats[stat], dmg.min)), max: Math.floor(Math.pow(attacker.stats[stat], dmg.max)) }
	// Status Effect

	// Skill
	// if (attacker.skills)
	// 	dmgRange = getDmgSkillMod(attacker, dmgRange)

	return dmgRange
}

function checkHealth(defender) {
	return (defender.stats.hlth > 0) ? true : false
}

function reduceHealth(defender, dmg) {
	defender.stats.hlth = _.clamp(defender.stats.hlth - dmg, 0, defender.stats.hlth)
}

function getHitSkillMod(character) {
	let hitMod = 0

	_.each(character.skills, (skillId) => {
		let { mod, type } = getSkillById(skillId)
		if (type === "hit")
			hitMod += mod
	})

	return hitMod
}

function getDmgSkillMod(character, value) {
	let multipliers = []

	_.each(character.skills, (skillId) => {
		let { mod, type, multi, min, max } = getSkillById(skillId)
		if (type === "dmg") {
			if (multi)
				multipliers.push({ mod, min, max })
			else {
				if (min)
					value.min += mod
				if (max)
					value.max += mod
			}
		}
	})

	_.each(multipliers, ({ min, max, mod }) => {
		if (min)
			value.min *= mod
		if (max)
			value.max *= mod
	})

	return value
}

let hitText = [
	{ give: "You wolloped them good!", take: "You were hit square in the face!" }
]
let missText = [
	{ give: "You swung wide!", take: "You dodged out of the way!" }
]

export function combatReset() {
	delete State.variables.enemyHitDmg
	delete State.variables.enemyCombatLog
	delete State.variables.foundItems
	delete State.variables.playerHitDmg
	delete State.variables.combatResults
	delete State.variables.playerCombatLog
	delete State.variables.enemy
	delete State.variables.willing
	delete State.variables.consumeObj

	State.variables.combat = false;
	State.variables.win = false;
}

export function loseExp() {
	for (let exp in State.variables.player.exp)
		State.variables.player.exp[exp] = 0

	for (let cap in State.variables.player.capacity)
		if (!cap.contains('Max'))
			State.variables.player.capacity[cap] = 0

}

export function getExpText(consumePoints) {
	let consumeExp = []
	for (let cp in consumePoints)
		consumeExp.push(`Gained +${Math.ceil(consumePoints[cp])} ${returnStatName(cp)} to Experience`)
	return consumeExp
}