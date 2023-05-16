import { logger } from "@Utils/Logging";
import { Scene } from "phaser";

export class MainLoop extends Scene {
    autosaveTick

    constructor() {
        super("MainLoop")

        this.autosaveTick = 0
    }

    create() {
    }

    update(t, dt) { // FIXME When off tab, updates are not calced, use previous time state to figure out what the new delta is and compensate
        this.autosaveTick += 1
        if (this.autosaveTick >= 300) {
            this.autosaveTick = 0
            // Save.autosave.save()
        }
    }

    createCharacter(data, isPlayer) {
        if(isPlayer)
            this.player = this.add.character(data)
        else
            this.enemy = this.add.character(data)
    }

    // toJSON() {
    //     let actions = _.map(this.actions, (action) => { return action.toJSON() })
    //     return { actions, cheats: this._cheats }
    // }

    // loadData(data) {
    //     _.each(this.actions, (action) => {
    //         action.loadData(_.find(data.actions, { name: action.name }))
    //     })
    //     this.cheats = data.cheats
    // }

}