import { incrementTime } from "@controller/TimeController"

Macro.add('timeAction', {
    skipArgs: false,
    tags: null,
    handler: function () {
        let link = $('<a/>');

        // Stay in place and advance time
        if (this.args.length == 3) {
            $(link).text(`${this.args[0]} - ${this.args[1]}:${(this.args[2] < 10) ? '0' + this.args[2] : this.args[2]}`)
            $(link).ariaClick(
                (function (args, passage, content) {
                    return this.createShadowWrapper(
                        function () {
                            $.wiki(content);
                        },
                        function () {
                            if (State.temporary.advanceTime) incrementTime(args[1], args[2])
                            state.display(state.active.title, null, "back")
                        }
                    );
                }).call(this, this.args, passage, this.payload[0].contents.trim())
            )
        } else { // Proceed to another screen and advance time
            $(link).text(`${this.args[0]} - ${this.args[2]}:${(this.args[3] < 10) ? '0' + this.args[3] : this.args[3]}`)
            $(link).ariaClick(
                (function (args, passage, content) {
                    return this.createShadowWrapper(
                        function () {
                            $.wiki(content);
                        },
                        function () {
                            incrementTime(args[2], args[3])
                            if (checkCapacity(State.variables.player) && args[1] !== "fight") {
                                let sizeIdx = findSize(State.variables.player.measurements.height)
                                for(let sizeId in sizes)
                                    (Object.keys(sizes[sizeId])[0] == sizeIdx)?sizeIdx=sizeId:sizeIdx
                                let upperSize = (sizeIdx+2)<=(sizes.length-1)?(sizeIdx+2):sizes.length-1
                                $.wiki(`<<enemyMacro ${sizeIdx} ${upperSize}>>`)
                                Engine.play("fight")
                            } else
                                Engine.play(args[1])
                            
                        }
                    );
                }).call(this, this.args, passage, this.payload[0].contents.trim())
            )
        }
        $(this.output).append(link)
    }
})

function checkCapacity(player) {
    for(let cap in player.capacity) {
        if(!cap.includes('Max') && player.capacity[cap] > player.capacity[`${cap}Max`]) {
            let rand = random(1,100)
            if(rand < 21)
                return true
        }
    }

    return false
}