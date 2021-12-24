/* Measurment Converts */
window.convertToImperial = function (entity) {
	var height = Math.floor(entity.height*0.39370) //0.39370CM in 1IN
	var weight = Math.floor(entity.weight*2.2046) //2.2046KG in 1LB
	return {height,weight}
}

window.convertToLargerUnits = function (measurements,imperial) {
	var weightText = "Weight: "
	var heightText = "Height: "
	if(!imperial) {
		var ton = Math.floor(measurements.weight/1000)
		weightText += `${ton} tons and ${measurements.weight-(ton*1000)} kgs`
		
		var height = measurements.height
		var meter = Math.floor(height/100)
		height -= meter*100
		var km = Math.floor(height/100000)
		height -= km*100000
		heightText += `${km} kms, ${meter} meters, ${height} cms`
	} else {
		var converted = convertToImperial(measurements)
		var height = converted.height
		var foot = Math.floor(height/12)
		height -= foot*12
		var mile = Math.floor(height/63360)
		height -= mile*63360
		heightText += `${mile} miles, ${foot} feet, ${height} inches`
		
		var weight = converted.weight
		var ton = Math.floor(weight/2240)
		height -= ton*2240
		weightText += `${ton} tons, ${weight} pounds`
	}
	return {heightText,weightText}
}