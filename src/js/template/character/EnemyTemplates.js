import { findSize, convertToLargerUnits, findMuscle, findPenisSize, findBallSize, findFat, findBreastSize } from "@controller/character/MeasurementController"
import { logger } from "@util/Logging"
import _ from "lodash"

Template.add('eName', function() {
    return variables().enemy.name
})

Template.add(['eSpecies','ESpecies'], function() {
    return this.name === 'eSpecies' ? _.lowerFirst(variables().enemy.species) : variables().enemy.species
})

Template.add(['eGender','EGender'], function() {
    return this.name === 'eGender' ? _.lowerFirst(variables().enemy.gender.type) : variables().enemy.gender.type
})

Template.add(['eSize','ESize'], function() {
    let size = findSize(variables().enemy.measurements.height)
    return this.name === 'eSize' ? _.lowerFirst(size) : size
})

Template.add('eHeight', function() {
    return convertToLargerUnits(variables().enemy.measurements, variables().settings.units.imperial).heightText
})

Template.add('eWeight', function() {
    return convertToLargerUnits(variables().enemy.measurements, variables().settings.units.imperial).weightText
})

Template.add(['ePenis', 'EPenis'], function() {
    let pSize = findPenisSize(variables().enemy)
    return this.name === 'ePenis' ? _.lowerFirst(pSize) : pSize
})

Template.add(['eBalls', 'EBalls'], function() {
    let pSize = findBallSize(variables().enemy)
    return this.name === 'eBalls' ? _.lowerFirst(pSize) : pSize
})

Template.add('eBreast', function() {
    return findBreastSize(variables().enemy)
})

Template.add(['eMuscleAbs', 'eMuscleArms', 'eMuscleArmsSecond', 'eMusclePecs', 'eMuscleSingular', 'eMuscle', 'EMuscle'], function() {
    let {abs, arms, armsSecond, name, pecs, singular} = findMuscle(variables().enemy)
    switch (this.name) {
        case 'eMuscleAbs':
            return abs
        case 'eMuscleArms':
            return arms
        case 'eMuscleArmsSecond':
            return armsSecond
        case 'eMusclePecs':
            return pecs
        case 'eMuscleSingular':
            return singular
        case 'eMuscle':
            return _.lowerFirst(name)
        default:
            name
    }
})

Template.add(['eFatSingular', 'eFatStomach', 'eFat', 'EFat'], function() {
    let fat = findFat(variables().enemy.measurements.bodyFat)
    let {singular, stomach} = Object.values(fat)[0]
    let fatType = Object.keys(fat)[0]
    switch (this.name) {
        case 'eFatSingular':
            return singular
        case 'eFatStomach':
            return stomach
        case 'eFat':
            return _.lowerFirst(fatType)
        default:
            fatType
    }
})