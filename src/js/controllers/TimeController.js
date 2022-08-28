import { stores } from "@js/data"
import { logger } from "@util/Logging"

export function incrementTime(hour, min) {
    let checkHour = State.variables.time.hour + hour
    let checkMin = State.variables.time.min + min
    let checkDay = State.variables.time.day
    if (checkMin / 60 >= 1) {
        checkHour += Math.floor(checkMin / 60)
        checkMin = checkMin % 60
    }
    if ((checkHour == 24 && checkMin > 0) || checkHour > 24) {
        checkHour -= 24
        logger(checkHour)
        checkDay += 1
        logger(checkDay)
        restockStore(checkDay)
    }
    State.variables.time = {day: checkDay, hour: checkHour, min: checkMin };
}

function convertTwelveHour() {
    let checkHour = (State.variables.time.hour % 12) || 12
    let checkMin = State.variables.time.min
    let amPM = State.variables.time.hour>11?'pm':'am'
    
    return `${checkHour}:${checkMin>9?checkMin:'0'+checkMin}${amPM}`
}

function returnTime(twelveHour) {
    if(twelveHour)
        return convertTwelveHour()
    return `${State.variables.time.hour}:${State.variables.time.min>9?State.variables.time.min:'0'+State.variables.time.min}`
}

export function advanceTime(advTime = true) {
    temporary().advanceTime = advTime
}

export function restockStore(day) {
    if(day%7 == 0)
        variables().stores = stores
}

export {returnTime}