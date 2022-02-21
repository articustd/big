Macro.add('cityMacro', {
    skipArgs: false,
    handler: function () {
        let player = State.variables.player
        let cityRangeMin = this.args[0]
        let cityRangeMax = this.args[1]
        let cityInRange = sizeInRange(cityRangeMin, cityRangeMax, player.measurements.height)
        let $wrapper = $('<span/>')
        
        let $bodyText = $('<span/>')

        let overSizedText = `As you pull up to the city, you see that it's rather small...
                            <br>You might not fit in correctly here. A lot of the shops and buildings seem to be sized for creatures smaller than yourself.
                            <br>Seeing the gym, a lot of the equipment is too small to be of any effect for your stature.`
        let corrSizedtext = `As you pull up to the city, everything seems to be made to fit your size!        
                            <br>Doorways and streets fit your size perfectly with no crouching or sliding in sideways.
                            <br>Looking at the signs on the gym you see that all the equipment is customized for creatures of your size. You should be able to get a good sweat in!`

        $bodyText.wiki(cityInRange?corrSizedtext:overSizedText)

        $wrapper
            .append($bodyText)
            .appendTo(this.output)
    }
})