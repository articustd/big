import { rollItems } from "@controller/ItemController";
import { skills } from "@js/data";
import { logger } from "@util/Logging";

/* Combat calculations */
export function combatRoll(playerAttack) {
	// Pull in player & enemy into local vars for easy access
	let enemy = variables().enemy
	let player = variables().player

	// Pull in variables() for Logs
	if (!variables().playerCombatLog)
		variables().playerCombatLog = []
	if (!variables().enemyCombatLog)
		variables().enemyCombatLog = []

	let playerCombatLog = variables().playerCombatLog
	let enemyCombatLog = variables().enemyCombatLog

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
		variables().combat = false
		variables().win = true
		variables().combatResults = `You've knocked out your enemy!`
		variables().foundItems = rollItems(enemy.loot, enemy.credits)
	}

	if (!checkHealth(player)) {
		for (let exp in player.exp) {
			player.exp[exp] = 0;
		}
		variables().combatResults = `You took a blow to the head and begin to pass out. As you pass out, you feel all your experience fading away.`
		variables().combat = false
	}
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
	let attackerAcc = attacker.stats.acc
	let defenderDex = defender.stats.dex

	let accNum = _.clamp((attackerAcc * 0.4 - defenderDex) + 9,0,8)
	logger(`attackerAcc: ${attackerAcc}`)
	logger(`defenderDex: ${defenderDex}`)
	logger(`attackerAcc * 0.4: ${attackerAcc * 0.4}`)
	logger(`attackerAcc * 0.4 - defenderDex: ${attackerAcc * 0.4 - defenderDex}`)
	logger(`accNum: ${accNum}`)
	let accPer = [15,20,30,40,45,50,65,80,100]

	// Status Effect


	// Skill
	// if (attacker.skills)
	// 	hitMod = getSkillMods('hit', attacker, hitMod)

	accNum = _.clamp(accNum,0,8)
	return accPer[accNum]
}

function calcCombatDmg(attack, attacker, crit) {
	let dmg = calcDmgRange(attack, attacker)
	if (crit)
		return Math.floor(random(dmg.min, dmg.max) * attack.critMulti)
	return random(dmg.min, dmg.max)
}

export function calcDmgRange(attack, attacker) {
	// Base Stats
	let dmgRange = { min: Math.floor(Math.pow(attacker.stats[attack.type], attack.minMod)), max: Math.floor(Math.pow(attacker.stats[attack.type], attack.maxMod)) } // FIXME This looks wrong, minMod shouldn't be used for the pow
	// Status Effect

	// Skill
	if (attacker.skills)
		dmgRange = getSkillMods('dmg', attacker, dmgRange)

	return dmgRange
}

function checkHealth(defender) {
	return (defender.stats.hlth > 0) ? true : false
}

function reduceHealth(defender, dmg) {
	defender.stats.hlth = Math.clamp(defender.stats.hlth - dmg, 0, defender.stats.hlth)
}

function getSkillMods(type, character, value) {
	let multi = []
	for (let skillId of character.skills) {
		logger('here')
		let skill = skills[skillId]
		logger(skill)
		if (skill.type === type) {
			if (skill.multi) {
				multi.push({ mod: skill.mod, min: skill.min, max: skill.max })
			} else {
				if (typeof value === Number)
					value += skill.mod
				else {
					if (skill.min)
						value.min += skill.mod
					if (skill.max)
						value.max += skill.mod
				}
			}
		}
	}

	for (let multiMod of multi) {
		if (multiMod.min)
			value.min = value.min * multiMod.mod
		if (multiMod.max)
			value.max = value.max * multiMod.mod
		else
			value = value * multiMod.mod
	}
	
	return value
}

let hitText = [
	{ give: "You wolloped them good!", take: "You were hit square in the face!" }
]
let missText = [
	{ give: "You swung wide!", take: "You dodged out of the way!" }
]
