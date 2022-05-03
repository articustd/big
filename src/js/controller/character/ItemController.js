/* Item Logic */
export function rollItems(enemyLoot, credits) {
	var text = []
	enemyLoot.forEach(function (item) {
		if (itemChance(item.chnc)) {
			let qty = addToInventory(item)
			text.push(`${qty} ${State.variables.items[item.id].name}`)
		}
	})
	addCredits(credits)
	text.push(`${credits} credits`)
	return text
}

function itemChance(chance) {
	if (Math.floor(random(1,100)) <= chance)
		return true
	
	return false
}

export function addToInventory(lootItem) {
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
	variables().player.credits += credits
	return credits
}

export function getItemInfoByIndex(index) {
	return variables().items[index]
}

export function decreaseCredits(amt) {
	variables().player.credits -= amt;
}