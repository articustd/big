Macro.add('bugMacro', {
    skipArgs: false,
    handler: function () {
        let player = State.variables.player
        let $wrapper = $('<span/>')
        let $playerData = $('<span/>').attr("id","playerData").text(`${JSON.stringify(player,)}`)
        let $break = $('<br/>')
        let $copyButton = $('<Button/>').text(`Copy to Clipboard`)
        
        $copyButton.ariaClick(function (ev) {
            navigator.clipboard.writeText(`${JSON.stringify(player,)}`);
            alert(`Contents Copied`)
        })

        $wrapper
            .append($copyButton)
            .append($break)
            .append($playerData)
            // .append($upperBody)
            // .append($lowerBody)
            // .append($allAround)
            .appendTo(this.output)
    }
})