Macro.add('progressiveText', {
    skipArgs: false,
    tags: ['nextText'],
    handler: function () {
        function createNext({ args }, display = 'none') {
            let isBtn = false,
                text = 'Continue',
                delay = 0

            for (let arg of args) {
                switch(typeof arg) {
                    case 'string':
                        text = arg
                        break
                    case 'boolean':
                        isBtn = arg
                        break
                    default:
                        delay = arg * 1000
                }
            }

            if (isBtn)
                return $('<div/>').css({ display }).wiki('<br/>')
                    .append($('<button/>')
                        .wiki(text)
                        .click(function () { $(this).parent().nextAll().slice(0, 2).css({ 'display': 'block' }).hide().fadeIn(delay); $(this).parent().remove() }))
            else
                return $('<a/>')
                    .wiki('<br/>' + text)
                    .css({ display, 'transition-duration': '0s' })
                    .click(function () { $(this).nextAll().slice(0, 2).css({ 'display': 'block' }).hide().fadeIn(delay); $(this).remove() })
        }

        for (let payloadId in this.payload) {
            let payload = this.payload[payloadId]

            switch (payload.name) {
                case 'progressiveText':
                    $(this.output)
                        .append($('<div/>').wiki(payload.contents))
                        .append(createNext(this.payload[++payloadId], 'block'))
                    break
                default:
                    $(this.output)
                        .append($('<div/>').css({ 'display': 'none' }).hide().wiki(payload.contents))
                    if (this.payload.length !== ++payloadId)
                        $(this.output)
                            .append(createNext(this.payload[payloadId]))
            }
        }
    }
})