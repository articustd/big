import { items } from "@js/data"
import { logger } from "@util/Logging"
import _ from "lodash"

/* Item Logic */
export function rollItems({ loot }, credits, text = []) {
	_.each(loot, ({ id, qty }) => {
		qty = _.random(1, qty)
		addToInventory({ id, qty })
		text.push(`${qty} ${items[id].name}`)
	})
	addCredits(credits)
	text.push(`${credits} credits`)
	return text
}

function itemChance(chance) {
	if (Math.floor(random(1, 100)) <= chance)
		return true

	return false
}

export function addToInventory({ id, qty }) { // FIXME Let me die father...
	let { player } = variables()
	let found = _.findIndex(player.inv, { id })

	if (found > -1)
		player.inv[found].qty += qty
	else
		player.inv.push({ id, qty })

	return qty
}

function addCredits(credits) {
	variables().player.credits += credits
	return credits
}

export function getItemInfoByIndex(index) {
	return items[index]
}

export function decreaseCredits(amt) {
	variables().player.credits -= amt;
}