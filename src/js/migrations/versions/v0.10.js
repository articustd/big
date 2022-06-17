import { logger } from "@util/Logging"

let majorMinor = 'v0.10.'
let hotVersion = 0

export function migrations(variables) {
    variables.version = majorMinor + hotVersion
}

export function upgrade(variables, hotfix) {
    if (hotfix === hotVersion){
        return
    }

    migrations(variables)
}