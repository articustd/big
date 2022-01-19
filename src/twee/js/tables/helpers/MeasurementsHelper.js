/* Measurment Converts */
function convertToImperial(entity, weight) {
	if (weight)
		return Math.floor(entity / 28.35) //1OZ in 28.35 G
	return Math.floor(entity / 2.54) //1IN in 2.54 CM
}

window.convertToLargerUnits = function (measurements, imperial) {
	let heightText = ''

	let height = measurements.height
	height = heightMeasurements(height, imperial)
	if (!imperial)
		heightText += `${height[0] > 0 ? height[0] + 'km ' : ''}${height[1] > 0 ? height[1] + "m " : ''}${height[2]}cm`
	else 
		heightText += `${height[0] > 0 ? height[0] + 'mi ' : ''}${height[1] > 0 ? height[1] + "' " : ''}${height[2]}"`
	
	return { heightText }
}

//DEPRICATED Weight measurments from the original system before Body Fat
function weightMeasurements(weight, imperial) {
	let weights = [];
	let m1, m2;

	if (imperial)
		m1 = 35840, m2 = 16, weight = convertToImperial(weight, true)
	else
		m1 = 1000000, m2 = 1000

	weights.push(Math.floor(weight / m1))
	weight -= weights[0] * m1

	weights.push(Math.floor(weight / m2))
	weight -= weights[1] * m2

	weights.push(weight)

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

	heights.push(height)

	return heights
}

function findSize(height) {
	for (let size of sizes) {
		let sizeKey = Object.keys(size)[0]
		if (height >= size[sizeKey].range[0] && height <= size[sizeKey].range[1])
			return sizeKey
	}
}

function findMuscle(muscle) {
	for (let ma of muscleAmount) {
		let maKey = Object.keys(ma)[0]
		if (muscle >= ma[maKey].range[0] && muscle < ma[maKey].range[1])
			return ma
	}
}

function findFat(bodyFat) {
	for (let fa of fatAmount) {
		let faKey = Object.keys(fa)[0]
		if (bodyFat >= fa[faKey].range[0] && bodyFat < fa[faKey].range[1])
			return fa
	}
}

function findBreastSize(character) {
	let ratio = character.gender.breasts // / character.measurements.height
	for (let breast of breastSize) {
		let breastKey = Object.keys(breast)[0]
		if (ratio >= breast[breastKey].range[0] && ratio < breast[breastKey].range[1])
			return breastKey
	}
	return ``
}

function findPenisSize(character) {
	let ratio = character.gender.penis // / character.measurements.height
	for (let pen of penisSize) {
		let penKey = Object.keys(pen)[0]
		if (ratio >= pen[penKey].range[0] && ratio <= pen[penKey].range[1])
			return penKey
	}
	return ``
}

function findBallSize(character) {
	let ratio = character.gender.balls // / character.measurements.height
	for (let ball of ballSize) {
		let ballKey = Object.keys(ball)[0]
		if (ratio >= ball[ballKey].range[0] && ratio < ball[ballKey].range[1])
			return ballKey
	}
	return ``
}

function calcWeight(measurements) {
	let hSrqd = (measurements.height/100)**2
	let bmi = calcBMI(measurements.bodyFat)
	logger(`Height Squared: ${hSrqd}`)
	logger(`BMI: ${bmi}`)
	logger(`Kg: ${bmi*hSrqd}`)
	return (bmi*hSrqd)*1000
}

function calcBMI(bodyFat) {
	bodyFat = Number(bodyFat)
	return ((bodyFat*100)+5.4+(10.8*1)-(0.23*25))/1.2 // ((bodyFat %)+5.4+(10.8*GENDER)-(0.23*AGE))/1.2 GENDER= MALE:1 FEMALE:0 AGE= 25
}