import { Plugins } from "phaser";
import { BaseAttack } from "./BaseAttack";

export class AttackPlugin extends Plugins.BasePlugin {
    constructor(pluginManager) {
        super(pluginManager)

        pluginManager.registerGameObject('attack', this.attack)
    }
    attack(data, load) {return this.updateList.add(new BaseAttack(this.scene, data, load))}
}