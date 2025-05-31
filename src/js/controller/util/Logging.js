import config from '@js/config.json'

/**
 * Logs message to the console if logging is enabled in the config.
 * 
 * @param {*} message Message to log out, if provided with an object it will display only object
 * @param {Object} object Object to render if paired with string
 */
export function logger(message, object) {
    if (config.logging)
        if(object)
            console.log(message,object)
        else
            console.log(message)
}