import { sizeInRange } from  "@controller/character/MeasurementController"
import * as cityData from "@js/data/cityTable"
import { logger } from "@util/Logging"

Macro.add('cityMacro', {
    skipArgs: false,
    handler: function () {
        let player = variables().player
        let cityRangeMin = this.args[0]
        let cityRangeMax = this.args[1]
        let citySize = this.args[2]
        let textId = sizeInRange(cityRangeMin, cityRangeMax, player.measurements.height)
        
        let $bodyText = $('<span/>')

        $bodyText.wiki(cityData[citySize][textId].desc)

        $bodyText
            .appendTo(this.output)
    }
})