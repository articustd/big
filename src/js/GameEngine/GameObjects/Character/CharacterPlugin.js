import { Plugins } from "phaser";
import { BaseCharacter } from "./BaseCharacter";

export class CharacterPlugin extends Plugins.BasePlugin {
    constructor(pluginManager) {
        super(pluginManager)

        pluginManager.registerGameObject('character', this.character)
    }
    character(data, load) {return this.updateList.add(new BaseCharacter(this.scene, data, load))}
}