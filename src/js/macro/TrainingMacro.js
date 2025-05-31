import { increaseExp } from "@controller/character/CharacterController";
import { decreaseCredits } from "@controller/character/ItemController"
import { advanceTime } from "@controller/TimeController";
import { logger } from "@util/Logging";

/**
 * Macro used to provide experience training for the player.
 * 
 * @type {Array} [Experience Type, Text for UI for when training is done, Credit cost for training, The amount of experience given for training]
 */

Macro.add('trainMacro', {
    skipArgs: false,
    // tags    : [],
    handler: function () {
        // if (this.args.length < 1) {
        //     var errors = [];
        //     if (this.args.length < 1) { errors.push('Var 1 Missing') }
        //     if (this.args.length < 2) { errors.push('Var 2 Missing') }
        //     return this.error(`${errors[0]}  ${errors.length == 2 ? "and " + errors[1] : ""}`)
        // }
        // Args: LevelUp - Boolean, Visible - Boolean

        let [expType, trainText, cost, modAmt] = this.args
        let { player } = variables()

        if (cost <= player.credits) {
            let expIncrease = increaseExp(player, expType, modAmt)
            setTrainText(`${trainText} ${expIncrease} ${expType}!`)

            decreaseCredits(cost);
            advanceTime(true)
        } else {
            setTrainText(`You don't have enough credits!`)
            advanceTime(false)
        }

        function setTrainText(text) { variables().trainText = text }
    }
});