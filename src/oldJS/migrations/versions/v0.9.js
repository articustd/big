import { v010 } from ".";

let majorMinor = 'v0.9.'
let hotVersion = 2

export function migrations(variables) {
    variables.version = majorMinor + hotVersion
}

export function upgrade(variables, hotfix) {
    if (hotfix === hotVersion){
        v010.migrations(variables)
        return
    }

    migrations(variables)
}