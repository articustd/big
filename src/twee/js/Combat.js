var maxHitPer = 85;
var minDmgMult = 60;

/* Combat calculations */
function calcCombatHit(defHitPer, type, attacker) {
	var hitMod = Math.floor(Math.log(attacker.stats[type])/Math.log(2))
	var hitPer = Math.clamp(defHitPer+hitMod,1,maxHitPer)
	return (hitPer-Math.floor(Math.random() * 101)) > 0 ? true : false
}

function calcCombatDmg(maxDmg, type, attacker) {
	var dmgMod = Math.floor(Math.log(attacker.stats[type])/Math.log(2))
	var dmgMulti = Math.clamp(Math.floor(Math.random()*101),minDmgMult,100)/100
	var dmg = Math.floor(maxDmg*dmgMulti)+dmgMod;
	return dmg;
}

window.combatRoll = function (playerAttack, enemyAttack) {
	var enemy = State.variables.enemy
	var player = State.variables.player
	var playerHitText, enemyHitText = ""
	var playerHitDmg = 0
	var	enemyHitDmg = 0
	//{hitPer: 0, maxDmg:0, type: "strg"}
	if(calcCombatHit(playerAttack.hitPer, playerAttack.type, player)) {
		playerHitDmg = calcCombatDmg(playerAttack.maxDmg, playerAttack.type, player)
		reduceHealth(enemy, playerHitDmg)
		playerHitText = "You pummled the enemy!"
	} else {
		playerHitText = "You swung wide and missed!"
	}
	
	if(checkHealth(enemy)) {
		if(calcCombatHit(enemyAttack.hitPer, enemyAttack.type, enemy)) {
			enemyHitDmg = calcCombatDmg(enemyAttack.maxDmg, enemyAttack.type, enemy)
			reduceHealth(player, enemyHitDmg)
			enemyHitText = "They pummled you!"
		} else {
			enemyHitText = "They swung wide and missed!"
		}
	}	else {
		enemyHitText = "Enemy has passed out!"
		State.variables.combat = false
		State.variables.win = true
		State.variables.combatResults = `You've knocked out your enemy!`
		State.variables.foundItems = rollItems(enemy.loot)
	}
	
	if(!checkHealth(player)) {
		for(var exp in player.exp) {
			player.exp[exp] = 0;
		}
		State.variables.combatResults = `You took a blow to the head and begin to pass out. As you pass out, you feel all your experience fading away.`
		State.variables.combat = false
	}
	
	State.variables.playerHitText = playerHitText
	State.variables.playerHitDmg = playerHitDmg
	State.variables.enemyHitText = enemyHitText
	State.variables.enemyHitDmg = enemyHitDmg
}

window.checkHealth = function (defender) {
	return (defender.stats.hlth > 0) ? true : false
}

window.reduceHealth = function (defender, dmg) {
	defender.stats.hlth = Math.clamp(defender.stats.hlth-dmg,0,defender.stats.hlth)	
}