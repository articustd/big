export class Attack {
    constructor(data, load) {
        _.each(data, (val, key) => {
            this[`${key}`] = val
        })
    }
}