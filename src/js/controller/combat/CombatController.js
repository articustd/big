import { getSkillById } from "@controller/character/CharacterController";
import { rollItems } from "@controller/ItemController";
import { skills } from "@js/data";
import { logger } from "@util/Logging";
import _ from "lodash";

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
	let { stats: { con: atkCon, dex: atkDex } } = attacker
	let { stats: { con: defCon, dex: defDex } } = defender

	let hitPer = ((atkDex / 4) + attack.baseHitChnc) + atkCon - defCon
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

export function calcDmgRange(attack, attacker) {
	// Base Stats
	let dmgRange = { min: Math.floor(Math.pow(attacker.stats[attack.type], attack.minMod)), max: Math.floor(Math.pow(attacker.stats[attack.type], attack.maxMod)) }
	// Status Effect

	// Skill
	if (attacker.skills)
		dmgRange = getDmgSkillMod(attacker, dmgRange)

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

	_.each(character.skills, (skillId)=>{
		let {mod, type} = getSkillById(skillId)
		if(type === "hit")
			hitMod += mod
	})

	return hitMod
}

function getDmgSkillMod(character, value) {
	let multipliers = []
	
	_.each(character.skills, (skillId)=>{
		let {mod, type, multi, min, max} = getSkillById(skillId)
		if(type === "dmg") {
			if(multi)
				multipliers.push({mod,min,max})
			else {
				if(min)
					value.min += mod
				if(max)
					value.max += mod
			}
		}
	})

	_.each(multipliers, ({min,max,mod})=>{
		if(min)
			value.min *= mod
		if(max)
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