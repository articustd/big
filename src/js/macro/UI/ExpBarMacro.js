/*
    Creates a generic experience bar. Uses the following arguments:
    
    First: character (usually $player)
    Second: indicates if the bar should float left or right
    Third: The type of capacity, currently used for the ID
    Fourth: integer/Float for the starting number and starting point of the bar
    Fifth: Integer/float for the end value
*/
Macro.add('expBarMacro', {
    skipArgs: false,
    handler: function () {
        let character = this.args[0]
        let align = this.args[1]
        let capType = this.args[2]
        let startPoint = this.args[3]
        let endPoint = this.args[4]

        let $Bar = $('<div/>')
            .addClass(`statusBar`)
            .css(`margin-${align?'left':'right'}`,'auto')

        let $currentBar = $('<div/>')
            .addClass('expBar statusBar')

        let $currentText = $('<div/>')
            .addClass('currentStatusText')

        $currentBar.css(
            'width', 
            `${Math.clamp(Math.floor((startPoint/endPoint)*100),0,100)}%`
        )
        $currentText.text(`${startPoint}/${endPoint}`)

        if(this.args[1])
            $Bar.css('float', this.args[1])

        $Bar
            .attr('id', `macro-${this.name}-${character.name}-` + capType)
            .append($currentText)
            .append($currentBar)
            .appendTo(this.output)
    }
})
