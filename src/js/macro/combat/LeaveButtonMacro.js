Macro.add('leaveButtonMacro', {
    skipArgs: false,
    tags: null,
    handler: function () {
        let buttonText = this.args[0]
        let passage = this.args[1]
        let styles = {
            "background-color": "red",
            "border-color": "#560000",
            "width": "100%",
            "height": "50px"
        }
        let $button = $('<button/>').text(buttonText).css(styles)

        $button.ariaClick((function (args, passage, content) {
            return this.createShadowWrapper(
                function () {
                    $.wiki(content);
                },
                function () {
                    Engine.play(args[1])
                }
            );
        }).call(this, this.args, passage, this.payload[0].contents.trim())).appendTo(this.output)
    }
})