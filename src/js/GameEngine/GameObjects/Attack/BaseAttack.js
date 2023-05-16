import { GameObjects } from "phaser";

export class BaseAttack extends GameObjects.GameObject {
    constructor(scene, data, load) {
        this.owner = owner
        _.each(data, (val, key) => {
            this[`${key}`] = val
        })
    }
}