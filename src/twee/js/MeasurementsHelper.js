/* Measurment Converts */
function convertToImperial(entity, weight) {
	if(weight)
		return Math.floor(entity/28.35) //1OZ in 28.35 G
	return Math.floor(entity/2.54) //1IN in 2.54 CM
}

window.convertToLargerUnits = function (measurements,imperial) {
	let weightText = '', heightText = ''
	
	let weight = measurements.weight
	weight = weightMeasurements(weight, imperial)
	
	let height = measurements.height
	height = heightMeasurements(height, imperial)
	if(!imperial) {
		weightText += `${weight[0]>0?weight[0]+'t ':''}${weight[1]>0?weight[1]+"kg ":''}${weight[2]}g`
		heightText += `${height[0]>0?height[0]+'km ':''}${height[1]>0?height[1]+"m ":''}${height[2]}cm`
	} else {
		weightText += `${weight[0]>0?weight[0]+'t ':''}${weight[1]>0?weight[1]+"lbs ":''}${weight[2]}oz`
		heightText += `${height[0]>0?height[0]+'mi ':''}${height[1]>0?height[1]+"' ":''}${height[2]}"`
	}
	return {heightText,weightText}
}

function weightMeasurements(weight, imperial) {
	let weights = [];
	let m1, m2;

	if(imperial)
		m1=35840,m2=16,weight=convertToImperial(weight,true)
	else
		m1=1000000,m2=1000

	weights.push(Math.floor(weight/m1))
	weight -= weights[0]*m1

	weights.push(Math.floor(weight/m2))
	weight -= weights[1]*m2

	weights.push(weight)

	return weights
}

function heightMeasurements(height, imperial) {
	let heights = [];
	let m1, m2;

	if(imperial)
		m1=63360,m2=12,height=convertToImperial(height,false)
	else
		m1=100000,m2=100

	heights.push(Math.floor(height/m1))
	height -= heights[0]*m1

	heights.push(Math.floor(height/m2))
	height -= heights[1]*m2

	heights.push(height)

	return heights
}

function findSize(height) {
	for(let size of sizes) {
		let sizeKey = Object.keys(size)[0]
		if(height >= size[sizeKey].range[0] && height <= size[sizeKey].range[1])
			return sizeKey
	}
}

function findMuscle(muscle) {
	for(let ma of muscleAmount) {
		let maKey = Object.keys(ma)[0]
		if(muscle >= ma[maKey][0] && muscle <= ma[maKey][1])
			return maKey
	}
}