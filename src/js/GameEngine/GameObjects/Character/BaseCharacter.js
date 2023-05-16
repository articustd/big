import { logger } from "@Utils/Logging";
import { GameObjects } from "phaser";

// Character Obj
// {stats:{muscle,fat,pawEye,size},capacity,health,healthMax}
export class BaseCharacter extends GameObjects.GameObject {
    constructor(scene, data, load) {
        super(scene, 'Character')

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

    preUpdate() { // NECESSARYEVIL I'm only here so phaser doesn't throw a fit, please don't delete me
    }

    get stats() { return this._stats }
    set stats(stats) { this._stats = stats }

    // Health Funcs
    calcHealthMax() {
        this.healthMax = 999
    }

    calcHealthPercentage() {
        return Math.clamp(Math.floor((this.health/this.healthMax)*100),0,100)
    }

    isAlive() {
        return this.stats.health > 0
    }

    resetHealth() {
        this.calcHealthMax()
        this.health = this.healthMax
    }

    // Stat Funcs
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

    // get attacks() {return this.#attacks}
    // getAttacks() {return this.#attacks}

    // Attack Funcs    
    loadAttacks() {
        this.attacks = []

        _.each(this.equippedAttacks, (name) => {
            this.attacks.push(new Attack(this, _.find(AttackData, {name})))
        })

        logger(this.attacks)
    }

    findAttack(name) {
        logger(this.attacks)
        return _.find(this.attacks, {name})
    }

    load(data) {
        _.each(data, (val, key) => {
            logger({ key, val })
            this[key] = val
        })
    }
}