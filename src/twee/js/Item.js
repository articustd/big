/* Item Logic */
window.rollItems = function (tableId) {
	var items = State.variables.loot[tableId]
	var text = []
	
	items.forEach(function(item){
		if(item.id >= 0) {
			if(itemChance(item.chnc)) {
				addToInventory(item.id)
				text.push(`Found 1 ${State.variables.items[item.id].name}`)
			}
		} else {
			var creditsAmt = addCredits(item.amnt)
			text.push(`Found ${creditsAmt} credits`)
		} 
	})
	
	return text
}

window.itemChance = function (chance) {
	if(Math.floor(Math.random() * 101) <= chance) {
		return true	
	}
	return false
}

window.addToInventory = function (id) {
	var found = -1
	State.variables.player.inv.forEach(function(item,idx){
		if(item.id == id) {
			found = idx
		}
	})
	if(found > -1) {
		State.variables.player.inv[found].qty++
	} else {
		State.variables.player.inv.push({id,qty:1})
	}
}

window.addCredits = function (amount) {
	var randomPercent = Math.clamp(Math.floor(Math.random() * 101),75,100)/100
	var credits = Math.floor(amount*randomPercent);
	State.variables.player.credits += credits
	return credits
}

function getItemInfoByIndex(index) {
	return State.variables.items[index]
}

function decreaseCredits(amt) {
	State.variables.player.credits -= amt;
}