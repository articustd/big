import { returnTime } from '@js/controller/TimeController'

Macro.add('clockMacro', {
    skipArgs: false,
    handler: function () {
        let $clock = $('<span/>').text(returnTime(State.variables.twelveHour))

        $clock
            .attr('id', `macro-${this.name}`)
            .appendTo(this.output)
    }
})