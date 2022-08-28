import { returnTime } from '@controller/TimeController'

Macro.add('clockMacro', {
    skipArgs: false,
    handler: function () {
        let $clock = $('<span/>').text(returnTime(variables().settings.units.twelveHour))

        $clock
            .attr('id', `macro-${this.name}`)
            .appendTo(this.output)
    }
})