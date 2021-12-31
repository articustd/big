var maxHitPer = 85;
var minDmgMult = 60;

/* Combat calculations */
function combatRoll(playerAttack) {
	// Pull in player & enemy into local vars for easy access
	let enemy = State.variables.enemy
	let player = State.variables.player

	// Pull in State Variables for Logs
	if(!State.variables.playerCombatLog)
		State.variables.playerCombatLog = []
	if(!State.variables.enemyCombatLog)
		State.variables.enemyCombatLog = []

	let playerCombatLog = State.variables.playerCombatLog
	let enemyCombatLog = State.variables.enemyCombatLog

	// Ready storage for damage done
	let playerDmg, enemyDmg;

	// Check if player hits
	let hitChance = calcCombatHit(playerAttack, player)
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
		hitChance = calcCombatHit(enemyAttack, enemy)
		if (hitChance.hit) {
			enemyDmg = calcCombatDmg(enemyAttack, enemy, false)
			reduceHealth(player, enemyDmg)
			enemyCombatLog.push(getHitHTML(`Pummeled you`))
			playerCombatLog.push(getDmgHTML(`You took the hit on the jaw for ${playerDmg} damage`))
		} else {
			enemyCombatLog.push(getDodgeHTML(`Swung wide and missed`))
			playerCombatLog.push(getMissHTML("Jumped to the side"))
		}
	} else { // Enemy is knocked out
		// enemyHitText = "Enemy has passed out!"
		State.variables.combat = false
		State.variables.win = true
		State.variables.combatResults = `You've knocked out your enemy!`
		State.variables.foundItems = rollItems(enemy.loot, enemy.credits)
	}

	if (!checkHealth(player)) {
		for (let exp in player.exp) {
			player.exp[exp] = 0;
		}
		State.variables.combatResults = `You took a blow to the head and begin to pass out. As you pass out, you feel all your experience fading away.`
		State.variables.combat = false
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

function calcCombatHit(attack, attacker) {
	let hitChance = 100 - calcHitChance(attack, attacker);
	let hitRoll = random(1, 100)
	if (hitRoll > hitChance) {
		if (hitRoll >= 100)
			return { hit: true, crit: true }
		return { hit: true, crit: false }
	}
	return { hit: false, crit: false }
}

function calcHitChance(attack, attacker) {
	// Base Stats
	let hitMod = attacker.stats.acc;

	// Status Effect


	// Skill
	if (attacker.skills) {
		for (let skill in attacker.skills) {
			if (skills[skill].type == 'hit') {
				hitMod = checkSkillMod(skills[skill].mod, hitMod)
			}
		}
	}

	return Math.clamp(Math.floor(((4 * Math.log2(hitMod)) + attack.baseHitChnc)), 1, 100);
}

function calcCombatDmg(attack, attacker, crit) {
	let dmg = calcDmgRange(attack, attacker)
	if (crit)
		return Math.floor(random(dmg.minDmg, dmg.maxDmg) * attack.critMulti)
	return random(dmg.minDmg, dmg.maxDmg)
}

function calcDmgRange(attack, attacker) {
	// Base Stats
	let maxDmg = Math.floor(Math.pow(attacker.stats[attack.type], attack.maxMod))
	let minDmg = Math.floor(Math.pow(attacker.stats[attack.type], attack.minMod))
	// Status Effect

	// Skill
	if (attacker.skills) {
		for (let skill in attacker.skills) {
			if (skills[skill].type == 'dmg') {
				switch (skills[skill].bound) {
					case 'max':
						maxDmg = checkSkillMod(skills[skill].mod, maxDmg);
						break
					case 'min':
						minDmg = checkSkillMod(skills[skill].mod, minDmg);
						break
					case 'min/max':
						maxDmg = checkSkillMod(skills[skill].mod, maxDmg);
						minDmg = checkSkillMod(skills[skill].mod, minDmg);;
						break
				}
			}
		}
	}

	return { minDmg, maxDmg }
}

function checkHealth(defender) {
	return (defender.stats.hlth > 0) ? true : false
}

function reduceHealth(defender, dmg) {
	defender.stats.hlth = Math.clamp(defender.stats.hlth - dmg, 0, defender.stats.hlth)
}

function checkSkillMod(mod, value) {
	if (mod % 1 != 0) // Check for a decimal
		return Math.floor(value * mod)
	return value + mod
}

let hitText = [
	{give:"You wolloped them good!", take: "You were hit square in the face!"}
]
let missText = [
	{give:"You swung wide!", take: "You dodged out of the way!"}
]
