/* Measurment Converts */
window.convertToImperial = function (entity) {
	var height = Math.floor(entity.height/2.54) //1IN in 2.54 CM
	var weight = Math.floor(entity.weight/28.35) //1OZ in 28.35 G
	return {height,weight}
}

window.convertToLargerUnits = function (measurements,imperial) {
	var weightText = "Weight: "
	var heightText = "Height: "
	if(!imperial) {
		var ton = Math.floor(measurements.weight/1000000)
		measurements.weight -= ton*1000000
		var kg = Math.floor(measurements.weight/1000)
		measurements.weight -= kg*1000
		weightText += `${ton} tons, ${kg} kg, ${measurements.weight} g`
		
		var height = measurements.height
		var meter = Math.floor(height/100)
		height -= meter*100
		var km = Math.floor(height/100000)
		height -= km*100000
		heightText += `${km} km, ${meter} m, ${height} cm`
	} else {
		var converted = convertToImperial(measurements)
		var height = converted.height
		var foot = Math.floor(height/12)
		height -= foot*12
		var mile = Math.floor(height/63360)
		height -= mile*63360
		heightText += `${mile} miles, ${foot} feet, ${height} inches`
		
		var weight = converted.weight
		console.log(weight)
		var ton = Math.floor(weight/35840)
		weight -= ton*35840
		var pounds = Math.floor(weight/16)
		weight -= pounds*16
		weightText += `${ton} tons, ${pounds} pounds, ${weight} ounces`
	}
	return {heightText,weightText}
}