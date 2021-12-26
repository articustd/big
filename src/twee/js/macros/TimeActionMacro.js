Macro.add('timeAction', {
    skipArgs: false,
    tags: null,
    handler: function () {
        let link = document.createElement("a");
        
        if (this.args.length == 3) {
            jQuery(link).text(`${this.args[0]} - ${this.args[1]}:${(this.args[2] < 10) ? '0' + this.args[2] : this.args[2]}`)
            jQuery(link).ariaClick(
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
        } else {
            jQuery(link).text(`${this.args[0]} - ${this.args[2]}:${(this.args[3] < 10) ? '0' + this.args[3] : this.args[3]}`)
            jQuery(link).ariaClick(
                (function (args, passage, content) {
                    return this.createShadowWrapper(
                        function () {
                            $.wiki(content);
                        },
                        function () {
                            incrementTime(args[2], args[3])
                            Engine.play(args[1])
                        }
                    );
                }).call(this, this.args, passage, this.payload[0].contents.trim())
            )   
        }
        jQuery(this.output).append(link)
    }
})

function incrementTime(hour, min) {
    let checkHour = State.variables.time.hour + hour
    let checkMin = State.variables.time.min + min
    if (checkMin / 60 >= 1) {
        checkHour += Math.floor(checkMin / 60)
        checkMin = checkMin % 60
    }
    if ((checkHour == 24 && checkMin > 0) || checkHour > 24) {
        checkHour -= 24
    }
    State.variables.time = { hour: checkHour, min: checkMin };
}

function advanceTime(advTime) {
    State.temporary.advanceTime = advTime
}

