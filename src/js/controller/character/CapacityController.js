import { logger } from "@util/Logging"
import _ from "lodash"

export function collectCapacity({ capacity }, capType, total = 0) {
    _.each(capacity[capType], (prey) => {
        total += prey.capacityAmount
    })
    return total
}

export function digest({ capacity, exp }, digestAmt) {
    _.each(getNonMaxCapacityKeys(capacity), (capKey) => { // Loop through all available character capacities that are NOT the max
        let totalCapConsumed = 0
        _.each(capacity[capKey], (prey) => { // Loop through all prey for the given capacity
            if (!digestAmt) // If the digest amount is not given, fully digest prey
                digestAmt = prey.capacityAmount

            prey.capacityAmount -= digestAmt
            totalCapConsumed += digestAmt

            _.each(prey.exp, (preyExp, expKey) => { // Add EXP to character from prey
                if (preyExp)
                    exp[expKey] += preyExp
            })
        })

        capacityChange(capacity, capKey + 'Max', totalCapConsumed)

        _.remove(capacity[capKey], ({ capacityAmount }) => { // Remove all prey given capacity that have been fully digested
            return capacityAmount <= 0
        })
    })
}

export function losePrey({ capacity }, message) {
    let availableCaps = _.filter(capacity, (cap, key) => { return _.isArray(cap) && cap.length > 0 }) // Get any capacity that has prey and not max
    if (availableCaps.length > 0) {
        let rand = _.random(0, availableCaps.length - 1) // Randomly select capacity out of available ones
        let selectedCap = availableCaps[rand] // Selected capacity to remove prey from
        rand = _.random(0, selectedCap.length - 1)
        let escapingPrey = selectedCap[rand] // Prey that has escaped
        let capName = _.findKey(capacity, (prop) => { return _.isEqual(prop, selectedCap) })
        _.remove(selectedCap, (prey, idx) => {
            return idx === rand
        })

        message = `With a groan you roll over and reach for your head. As you pull your paw away some goo trails off a ribbon that connects to your head. <br/><br/>Gross, not sure what that is. Better get cleaned up before doing anything else. <br/><br/>On your way to the restroom you notice your ${returnCapName(capName)} is feeling lighter than before you passed out. The ${escapingPrey.name} feels like they either escaped or was taken from you. Damn.<br/>`
    } else
        message = `Your eyes flutter open, a little confused at where you are. Looking around, someone or something has brought you back home. <br/><br/>You're covered in goo? No, it's something else. <br/><br/>You decide it's probably not a good idea to think about it and to just take a shower. Getting up you're a bit stiff and slowly make your way to the restroom.<br/><br/>After a quick shower you're feeling a little more refreshed, but could be better.<br/>`

    return message
}

function getNonMaxCapacityKeys(capacity) {
    return _.filter(_.keys(capacity), (key) => { return !key.includes('Max') })
}

function capacityChange(capacity, capMaxKey, totalCapConsumed) {
    if (capacity[capMaxKey] <= totalCapConsumed)
        capacity[capMaxKey] += _.ceil(capacity[capMaxKey] / 4)
}

function returnCapName(cap) {
    switch (cap) {
        case 'stomach':
            return 'stomach'
        case 'testi':
            return 'balls'
        case 'womb':
            return 'womb'
    }
}