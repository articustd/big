/* Item Logic */
function rollItems(enemyLoot, credits) {
	var text = []
	enemyLoot.forEach(function (item) {
		if (itemChance(item.chnc)) {
			let qty = addToInventory(item)
			text.push(`Found ${qty} ${State.variables.items[item.id].name}`)
		}
	})
	addCredits(credits)
	text.push(`Found ${credits} credits`)
	return text
}

function itemChance(chance) {
	if (Math.floor(random(1,100)) <= chance)
		return true
	
	return false
}

function addToInventory(lootItem) {
	var found = -1
	let qty = random(1,lootItem.qty)
	State.variables.player.inv.forEach(function (item, idx) {
		if (item.id === lootItem.id)
			found = idx
	})
	if (found > -1) {
		State.variables.player.inv[found].qty += qty
	} else {
		State.variables.player.inv.push({ id: lootItem.id, qty })
	}
	return qty
}

function addCredits(credits) {
	State.variables.player.credits += credits
	return credits
}

function getItemInfoByIndex(index) {
	return State.variables.items[index]
}

function decreaseCredits(amt) {
	State.variables.player.credits -= amt;
}