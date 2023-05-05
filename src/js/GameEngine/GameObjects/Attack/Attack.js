import { logger } from "@js/Utils/Logging"

export class Attack {
    constructor(owner, data, load) {
        this.owner = owner
        _.each(data, (val, key) => {
            this[`${key}`] = val
        })
    }
}