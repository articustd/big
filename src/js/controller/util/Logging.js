import config from '@js/config.json'
export function logger(message) {
    if (config.logging)
        console.log(message)
}