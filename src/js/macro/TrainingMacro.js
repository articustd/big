import { decreaseCredits } from "@controller/character/ItemController"
import { advanceTime } from "@controller/TimeController";

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

        let expType = this.args[0];
        let trainText = this.args[1];
        let cost = this.args[2];
        let modAmt = this.args[3];

        if(cost <= variables().player.credits) {
            variables().player.exp[expType] += modAmt;
            variables().trainText = trainText;

            decreaseCredits(cost);
            advanceTime(true)
        } else {
            variables().trainText = `You don't have enought credits!`;
            advanceTime(false)
        }
    }
});