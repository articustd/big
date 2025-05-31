import { logger } from "@util/Logging";
import _ from "lodash"
import { sizeDiff } from "./MeasurementController";
import { addCapacity } from "./CapacityController";
import { getExpText } from "@controller/combat/CombatController";

/**
 * Used to reduce the object of the entity consumed.
 * 
 * @param {Object} Entity  The entity consumed
 * @returns Reduced Entity Object
 */
export function reducePreyObject({ name, species, exp, capacityAmount, measurements }) {
    return { name, species, exp, capacityAmount, measurements }
}

/**
 * Used to gather experience points from consumed entity.
 * 
 * @param {Object} entity The consumed entity the hunter entity is consuming
 * @param {Object} response The collection of experience points being taken from the consumed entity
 * @returns Response object
 */
function calcConsume(entity, response = {}) {
    logger(entity.exp)
    for (let points in entity.exp) {
        let point = randPoints(entity.exp[points])
        if (point > 0) response[points] = point
    }

    return response;
}

/**
 * Used to consume consume an entity. Takes an object on how the prey is being consumed by the hunter.
 * 
 * @param {Object} con The consume object for all the information of how the prey is being consumed
 * @param {Object} hunter The entity consuming
 * @param {Object} prey The entity being consumed
 */
export function consumeEntity(con, hunter, prey) {
    let consumeObj = { consume: con, points: calcConsume(prey), sDiff: sizeDiff(hunter, prey) }

    // This needs to be here to prevent players from repeatedly getting exp by refreshing
    addCapacity(hunter, prey, consumeObj.consume.capacity)
    variables().consumeObj = consumeObj

    variables().consumeText = _.map(getExpText(consumeObj.points), (text) => {
        return text
    })

    // variables().consumeText.push(`Filled your ${con.capacity} by ${prey.capacityAmount} point${prey.capacityAmount > 1 ? 's' : ''}`)

    if (variables().settings.skip.consumeText) {
        combatReset()
        Engine.play(variables().return)
    } else
        Engine.play("consume")
}

/**
 * Used to calculate random points. Takes an array of two values.
 * 
 * @param {Array<Number>} range Range of values in an array to get random points for
 * @returns {Number} A random integer value between the two provided values
 */
function randPoints(range) {
    return (Array.isArray(range)) ? random(range[0], range[1]) : range
}