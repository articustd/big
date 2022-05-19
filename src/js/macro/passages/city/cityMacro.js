import { sizeInRange } from "@controller/character/MeasurementController"
import * as cityData from "@js/data/cityTable"
import { logger } from "@util/Logging"

Macro.add('cityMacro', {
    skipArgs: false,
    handler: function () {
        logger(this.args)
        let { player } = variables()
        let [ cityRangeMin, cityRangeMax, citySize ] = this.args
        logger({ cityRangeMin, cityRangeMax, citySize })
        let textId = sizeInRange(cityRangeMin, cityRangeMax, player)

        let $bodyText = $('<span/>')

        $bodyText.wiki(cityData[citySize][textId].desc)

        $bodyText
            .appendTo(this.output)
    }
})