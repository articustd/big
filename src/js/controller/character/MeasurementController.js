import { logger } from "../util/Logging"
import { measurements } from '@js/data'
import _ from "lodash"

/* Measurment Converts */
function convertToImperial(entity, weight) {
	if (weight)
		return Math.floor(entity / 28.35) //1OZ in 28.35 G
	return Math.floor(entity / 2.54) //1IN in 2.54 CM
}

export function convertToLargerUnits(measurement, imperial) {
	let heightText = ''
	let weightText = ''

	let height = measurement.height
	height = heightMeasurements(height, imperial)
	if (!imperial)
		heightText += `${height[0] > 0 ? height[0] + 'km ' : ''}${height[1] > 0 ? height[1] + "m " : ''}${height[2]}cm`
	else
		heightText += `${height[0] > 0 ? height[0] + 'mi ' : ''}${height[1] > 0 ? height[1] + "' " : ''}${height[2]}"`

	let weight = weightMeasurements(calcWeight(measurement), imperial)
	if (!imperial)
		weightText += `${weight[0] > 0 ? weight[0] + 't ' : ''}${weight[1] > 0 ? weight[1] + "kg " : ''}${weight[2]}g`
	else
		weightText += `${weight[0] > 0 ? weight[0] + 't ' : ''}${weight[1] > 0 ? weight[1] + "lb " : ''}${weight[2]}oz`

	return { heightText, weightText }
}
window.convertToLargerUnits = convertToLargerUnits

function weightMeasurements(weight, imperial) {
	let weights = [];
	let m1, m2;

	if (imperial)
		m1 = 32000, m2 = 16, weight = convertToImperial(weight, true)
	else
		m1 = 1000000, m2 = 1000

	weights.push(Math.floor(weight / m1))
	weight -= weights[0] * m1

	weights.push(Math.floor(weight / m2))
	weight -= weights[1] * m2

	weights.push(Math.floor(weight))

	return weights
}

function heightMeasurements(height, imperial) {
	let heights = [];
	let m1, m2;

	if (imperial)
		m1 = 63360, m2 = 12, height = convertToImperial(height, false)
	else
		m1 = 100000, m2 = 100

	heights.push(Math.floor(height / m1))
	height -= heights[0] * m1

	heights.push(Math.floor(height / m2))
	height -= heights[1] * m2

	heights.push(Math.floor(height))

	return heights
}

export function findSize(height) { // FIXME IT DON'T WORK NO MOE
	return _.find(measurements.sizes, ({ range }) => {
		return (range.length > 1) ? _.inRange(height, range[0], range[1]) : true
	}).name
}

export function findMuscle({ stats: { strg }, measurements: { height } }) {
	let name = findSize(height)
	let size = _.find(measurements.sizes, { name })
	return _.find(measurements.muscleAmount, ({ range }) => {
		let mod = (strg / size.statBase) * 100
		return (range.length > 1) ? _.inRange(mod, range[0], range[1]) : true
	})
}

export function findFat(bodyFat) {
	for (let fa of measurements.fatAmount) {
		let faKey = Object.keys(fa)[0]
		if (bodyFat >= fa[faKey].range[0] && (fa[faKey].range.length == 1 || bodyFat < fa[faKey].range[1]))
			return fa
	}
}

export function findBreastSize(character) {
	let ratio = character.gender.breasts // / character.measurements.height
	for (let breast of measurements.breastSize) {
		let breastKey = Object.keys(breast)[0]
		if (ratio >= breast[breastKey].range[0] && (breast[breastKey].range.length == 1 || ratio < breast[breastKey].range[1]))
			return breastKey
	}
	return ``
}

export function findPenisSize(character) {
	let ratio = character.gender.penis // / character.measurements.height
	for (let pen of measurements.penisSize) {
		let penKey = Object.keys(pen)[0]
		if (ratio >= pen[penKey].range[0] && (pen[penKey].range.length == 1 || ratio < pen[penKey].range[1]))
			return penKey
	}
	return ``
}

export function findBallSize(character) {
	let ratio = character.gender.balls // / character.measurements.height
	for (let ball of measurements.ballSize) {
		let ballKey = Object.keys(ball)[0]
		if (ratio >= ball[ballKey].range[0] && (ball[ballKey].range.length == 1 || ratio < ball[ballKey].range[1]))
			return ballKey
	}
	return ``
}

export function calcWeight(measurement) {
	let hSrqd = (measurement.height / 100) ** 2
	let bmi = calcBMI(measurement.bodyFat)
	return (bmi * hSrqd) * 1000
}

function calcBMI(bodyFat) {
	bodyFat = Number(bodyFat)
	return ((bodyFat * 100) + 5.4 + (10.8 * 1) - (0.23 * 25)) / 1.2 // ((bodyFat %)+5.4+(10.8*GENDER)-(0.23*AGE))/1.2 GENDER= MALE:1 FEMALE:0 AGE= 25
}

export function getSizeIdx({ height }) {
	return _.findIndex(measurements.sizes, ({ range }) => {
		return (range.length > 1) ? _.inRange(height, range[0], range[1]) : true
	})
}

export function sizeInRange(min, max, { measurements: { height } }, response = 1) {
	let sizeIdx = _.findIndex(measurements.sizes, { name: findSize(height) })
	if (min > sizeIdx)
		response = 0
	if (max < sizeIdx)
		response = 2
	return response
}

export function sizeDiff(player, enemy) {
	let sizeDiff = (player.measurements.height - enemy.measurements.height) / player.measurements.height
	sizeDiff = isNaN(sizeDiff) ? 0 : sizeDiff

	if (sizeDiff >= 0.6)
		return 2
	if (sizeDiff >= 0.18)
		return 1
	if (sizeDiff >= 0)
		return 0
	if (sizeDiff <= -0.6)
		return -2
	if (sizeDiff < 0)
		return -1

	return sizeId
}

export function sizeArray(range, sizeArr = []) {
	_.each(measurements.sizes, (size, idx) => {
		!range || _.includes(range, idx) ? sizeArr.push(size.name) : true
	})
	return sizeArr
}
window.sizeArray = sizeArray