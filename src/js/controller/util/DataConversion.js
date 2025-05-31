/**
 * Turns the string representation of True and False into their boolean data types.
 * 
 * @param {*} value Value to be tested 
 * @returns Boolean if passing in true or false. Any data type if anything else.
 */
export function boolify(value) {
    if(typeof value === 'string' && (value.toLowerCase() === "true" || value.toLowerCase() === "false"))
        return JSON.parse(value)
    return value
}