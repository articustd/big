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





