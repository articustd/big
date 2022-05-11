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

        capacityChange(capacity, capKey+'Max', totalCapConsumed)

        _.remove(capacity[capKey], ({capacityAmount}) => { // Remove all prey given capacity that have been fully digested
            return capacityAmount <= 0
        })
    })
}

function getNonMaxCapacityKeys(capacity) {
    return _.filter(_.keys(capacity), (key) => { return !key.includes('Max') })
}

function capacityChange(capacity, capMaxKey, totalCapConsumed) {
    if(capacity[capMaxKey] <= totalCapConsumed)
        capacity[capMaxKey] += _.ceil(capacity[capMaxKey]/4)
}