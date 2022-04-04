import { rest } from "@controller/character/CharacterController"

Macro.add('leaveButtonMacro', {
    skipArgs: false,
    tags: null,
    handler: function () {
        let buttonText = this.args[0]
        let passage = this.args[1]
        let passedOut = this.args[2] | false
        let styles = {
            "background-color": "red",
            "border-color": "#560000",
            "width": "100%",
            "height": "50px",
            "margin-top": "13px"
        }
        let $button = $('<button/>').text(buttonText).css(styles)

        $button.ariaClick((function (args, passage, content) {
            return this.createShadowWrapper(
                function () {
                    $.wiki(content);
                },
                function () {
                    if(passedOut) {
                        rest(variables().player)
                        variables().restText = `Your eyes flutter open, a little confused at where you are. Looking around, someone or something has brought you back home. The aches and pains from your fight are gone, but so is anything you had eaten prior.`
                    }
                    Engine.play(args[1])
                }
            );
        }).call(this, this.args, passage, this.payload[0].contents.trim())).appendTo(this.output)
    }
})