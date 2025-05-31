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
	addCredits(credits, variables().player)
	text.push(`${credits} credits`)
	return text
}

function itemChance(chance) {
	if (Math.floor(random(1, 100)) <= chance)
		return true

	return false
}

export function addToInventory({ id, qty }) { // FIXME Let me die father...
	let { inv } = variables().player
	let found = _.findIndex(inv, { id })

	if (found > -1)
		inv[found].qty += qty
	else
		inv.push({ id, qty })

	return qty
}

/**
 * Decreases the given entity's inventory. If an item quantity is reduced to 0 or below, it's removed from the entity's inventory array.
 * 
 * @param {Number} idx - Index of the item in the entity's inventory to decrease
 * @param {Array<Object>} inv - Entity inventory to decrease item in
 * @param {Number} quantity - Number of items to remove from inventory
 */
export function decreaseInventory(idx, inv, quantity) {
	inv[idx].qty -= quantity

	if (inv[idx].qty <= 0)
		inv.splice(idx, 1)
}

/**
 * Adds credits to the given entity's holdings.
 * 
 * @param {Number} credits - Number of credits to add to the entity's holdings
 * @param {Object} entity - Entity which will be receiving the credits, must have credits as a child property
 * @returns {Number} Credits awarded to entity (Soon to be deprecated)
 */
function addCredits(credits, entity) {
	entity.credits += credits
}

/**
 * Returns an item object containing all of the item's data.
 * 
 * @param {Number} index - Index of the item in the ItemTable json
 * @returns An item object containing the item data
 */
export function getItemInfoByIndex(index) {
	return items[index]
}

export function decreaseCredits(amt) {
	variables().player.credits -= amt;
}

/** 
 * Allows the player to sell items.
 * 
 * @param {number} itemIdx - Item index in the seller's inventory
 * @param {Array<Object>} seller - The seller, must have inv as a child property
 * @param {number} price - Price seller is selling item for
 * @param {number} quantity - Number to sell, default 1
 * 
 */
export function sellItem(itemIdx, seller, price, quantity = 1) {
	decreaseInventory(itemIdx, seller.inv, quantity)
	addCredits(price * quantity, seller)
}