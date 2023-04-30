import { findSize, convertToLargerUnits, findMuscle, findPenisSize, findBallSize, findFat, findBreastSize } from "@controller/character/MeasurementController"
import { logger } from "@util/Logging"
import _ from "lodash"

Template.add(['pSpecies','PSpecies'], function() {
    return this.name === 'pSpecies' ? _.lowerFirst(variables().player.species) : variables().player.species
})

Template.add(['pGender','PGender'], function() {
    return this.name === 'pGender' ? _.lowerFirst(variables().player.gender.type) : variables().player.gender.type
})

Template.add(['pSize','PSize'], function() {
    let size = findSize(variables().player.measurements.height)
    return this.name === 'pSize' ? _.lowerFirst(size) : size
})

Template.add('pHeight', function() {
    return convertToLargerUnits(variables().player.measurements, variables().settings.units.imperial).heightText
})

Template.add('pWeight', function() {
    return convertToLargerUnits(variables().player.measurements, variables().settings.units.imperial).weightText
})

Template.add(['pPenis', 'PPenis'], function() {
    let pSize = findPenisSize(variables().player)
    return this.name === 'pPenis' ? _.lowerFirst(pSize) : pSize
})

Template.add(['pBalls', 'PBalls'], function() {
    let pSize = findBallSize(variables().player)
    return this.name === 'pBalls' ? _.lowerFirst(pSize) : pSize
})

Template.add('pBreast', function() {
    return findBreastSize(variables().player)
})

Template.add(['pMuscleAbs', 'pMuscleArms', 'pMuscleArmsSecond', 'pMusclePecs', 'pMuscleSingular', 'pMuscle', 'PMuscle'], function() {
    let {abs, arms, armsSecond, name, pecs, singular} = findMuscle(variables().player)
    switch (this.name) {
        case 'pMuscleAbs':
            return abs
        case 'pMuscleArms':
            return arms
        case 'pMuscleArmsSecond':
            return armsSecond
        case 'pMusclePecs':
            return pecs
        case 'pMuscleSingular':
            return singular
        case 'pMuscle':
            return _.lowerFirst(name)
        default:
            name
    }
})

Template.add(['pFatSingular', 'pFatStomach', 'pFat', 'PFat'], function() {
    let fat = findFat(variables().player.measurements.bodyFat)
    let {singular, stomach} = Object.values(fat)[0]
    let fatType = Object.keys(fat)[0]
    switch (this.name) {
        case 'pFatSingular':
            return singular
        case 'pFatStomach':
            return stomach
        case 'pFat':
            return _.lowerFirst(fatType)
        default:
            fatType
    }
})