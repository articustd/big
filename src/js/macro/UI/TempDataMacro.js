import { genderArray } from "@controller/character/GenderController"
import { sizeArray } from "@controller/character/MeasurementController"
import { pronounArray } from "@controller/character/PronounController"
import { measurements, species } from "@js/data"
import _ from "lodash"

Macro.add('tempData', {
    skipArgs: false,
    handler: function () {
        temporary().species = species // Move to temp in start and charGen
        temporary().playerSizes = sizeArray([2, 3, 4]) // Move to temp in start
        temporary().sizes = sizeArray()
        temporary().bodyTypes = _.map(measurements.bodyTypes, (val) => { return _.keys(val)[0] }) // Move to temp in charGen
        temporary().genders = genderArray(); // Move to temp in start
        temporary().pronouns = pronounArray() // Move to temp in start and charGen
    }
})