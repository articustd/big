import { decreaseCredits } from "@controller/character/ItemController"
import { advanceTime } from "@controller/TimeController";
import { logger } from "@util/Logging";

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
        let {settings:{tweak:{hyperMode}}} = variables()
        logger({hyperMode})
        if(cost <= variables().player.credits) {
            let mod = modAmt * (hyperMode?4:1)
            variables().player.exp[expType] += mod;
            variables().trainText = `${trainText} ${mod} ${expType}!`;

            decreaseCredits(cost);
            advanceTime(true)
        } else {
            variables().trainText = `You don't have enough credits!`;
            advanceTime(false)
        }
    }
});