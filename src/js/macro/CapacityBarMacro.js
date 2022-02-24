Macro.add('capacityBarMacro', {
    skipArgs: false,
    handler: function () {
        let character = this.args[0]
        let capType = this.args[1]

        let statusPercent = Math.floor((character.capacity[capType]/character.capacity[`${capType}Max`])*100)
        
        let $capBar = $('<div/>')
                            .addClass(`statusBar`)
        let $currentCap = $('<div/>')
                    .addClass(`${statusPercent<100?'currentNotVisCapBar':'currentVisCapBar'}`)
                    .css('width', `${statusPercent}%`)
        let $currentCapText = $('<div/>')
                    .addClass('currentStatusText')
                    .text(`${checkVisible(character, capType)}`)
        
        $capBar
            .attr('id', `macro-${this.name}`)
            .append($currentCap)
            .append($currentCapText)
            .appendTo(this.output)
    }
})

function checkVisible(character, capType) {
    if(character.capacity[capType]>character.capacity[`${capType}Max`])
        return `Visible`
    return `Not Visible`
}