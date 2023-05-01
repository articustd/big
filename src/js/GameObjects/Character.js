import { logger } from "@Utils/Logging"
import _ from "lodash"

// Character Obj
// {stats:{muscle,fat,pawEye,size},capacity,health,healthMax}
export class Character {
    constructor(data, load) {
        if (load) {
            this.load(load)
            return
        }

        _.each(data, (val, key) => {
            this[`${key}`] = val
        })

        this.calcStats()
        this.resetHealth()

        this.capacity = 1
    }

    get stats() { return this._stats }
    set stats(stats) { this._stats = stats }

    calcHealthMax() {
        this.stats.healthMax = 5
    }

    calcStats() {
        if (this._stats)
            return

        if (!this._baseStat)
            this._baseStat = this.size.statBase

        this.stats = {}
        _.each(this.bodyType.statMods, (statRange, statName) => {
            this._stats[statName] = _.ceil(this._baseStat * _.ceil(_.random(statRange[0], statRange[1]), 2))
        })
    }

    isAlive() {
        return this.stats.hlth > 0
    }

    resetHealth() {
        this.calcHealthMax()
        this.health = this.healthMax
    }

    load(data) {
        _.each(data, (val, key) => {
            logger({ key, val })
            this[key] = val
        })
    }
}