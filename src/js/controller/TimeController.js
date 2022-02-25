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
        checkDay += 1
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

function advanceTime(advTime) {
    State.temporary.advanceTime = advTime
}

function restockStore(day) {
    if(day%7 == 0) {
        State.variables.stores = Object.assign({},stores)
    }
}

export {returnTime}