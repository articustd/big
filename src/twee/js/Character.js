function genChar(statPoints, speciesId, sizeRange, bodyTypeRange, gender, name) {
    let character = { name: "", stats: {}, exp: {}, measurements: {}, gender: genders[gender] };

    let size = sizes[randomSize(sizeRange)]
    let sizeKey = Object.keys(size)[0]

    let bodyType = bodyTypes[randomBodyType(bodyTypeRange)]
    let bodyTypeKey = Object.keys(bodyType)[0]

    let statMods = bodyType[bodyTypeKey].statMods
    let expMods = bodyType[bodyTypeKey].expMods

    // Calculate Measurements
    character.measurements.height = random(size[sizeKey].range[0], size[sizeKey].range[1])
    character.measurements.weight = calcWeight(character.measurements.height, bodyType[bodyTypeKey].weightMod, size[sizeKey].sizeMulti)

    let hyper = false

    character.species = species[speciesId]

    // Calculate Exp, Stats, and Name (This was not fun)
    if (!name) {
        character.name = `${sizeKey} ${bodyTypeKey} ${species[speciesId]}`
        let statPointMod = Math.floor(statPoints / 4)
        statPoints = random(statPoints - statPointMod, statPoints + statPointMod)
        calcStats(character, statMods, statPoints)

        for (let exp in expMods)
            character.exp[exp] = getExpCalc(character,exp,expMods[exp],statPoints)
    } else {
        character.name = name
        character.exp = blankExp()
        character.credits = 0
        character.skills = []
        character.skillPoints = 0
        character.inv = []
        calcStats(character, statMods, statPoints)
    }

    // Calculate Genitals... Oh boy
    character.gender = calcGenitals(hyper,character.measurements.height,character.gender)

    // Calculate Max Health and Current Health
    calcMaxHealth(character)

    return character;
}

function calcWeight(height, weightMod, sizeMulti) {
    return (height * sizeMulti) * weightMod
}

function randomSize(range) {
    if (Array.isArray(range))
        return random(Math.clamp(range[0], 0, sizes.length - 1), Math.clamp(range[1], 0, sizes.length - 1))
    return Math.clamp(range, 0, sizes.length - 1)
}

function randomBodyType(range) {
    if (Array.isArray(range))
        return random(Math.clamp(range[0], 0, bodyTypes.length - 1), Math.clamp(range[1], 0, bodyTypes.length - 1))
    return Math.clamp(range, 0, bodyTypes.length - 1)
}

function calcStats(character, statMods, statPoints) {
    for (let statMod in statMods) {
        character.stats[statMod] = Math.floor(statPoints * statMods[statMod])
    }
}

function calcGenitals(hyper,height,gender) {
    let hyperMod = hyper ? 2 : 1
    let genderKey = Object.keys(gender)[0]
    let response = {
        type:gender[genderKey].type, 
        genitals: {
            penis: Math.floor((height/random(8,11))*hyperMod), 
            balls: Math.floor((height/random(8,11))*hyperMod), 
            breasts: Math.floor((height/random(6,8))*hyperMod),
            vagina: true 
        }
    }
    for(let gen in gender[genderKey]) {
        if(!gender[genderKey][gen])
            response.genitals[gen] = false
    }
    return response
}

function blankExp() {
    return { muscle: 0, fat: 0, pawEye: 0, agility: 0, size: 0, skill: 0 }
}

function getExpCalc(character,exp,expMod,statPoints) {
    switch (exp) {
        case 'muscle':
            return Math.round(Math.log10(character.stats.strg))*expMod
        case 'fat':
            return Math.round(Math.log10(character.stats.con))*expMod
        case 'size':
            return Math.floor(Math.log(character.measurements.height)**2)
        case 'skill':
            return Math.floor(Math.log2(statPoints))
        case 'pawEye':
            return Math.round(Math.log10(character.stats.acc))*expMod
        case 'agility':
            return Math.round(Math.log10(character.stats.dex))*expMod
    }
}

function calcMaxHealth(character) {
    character.stats.hlth = character.stats.con * 2
    character.stats.maxHlth = character.stats.con * 2
}

let sizes = [
    { "Micro": { range: [3, 7], sizeMulti: 4 } },
    { "Tiny": { range: [8, 30], sizeMulti: 66 } },
    { "Mini": { range: [31, 60], sizeMulti: 150 } },
    { "Small": { range: [61, 152], sizeMulti: 387 } },
    { "Average": { range: [153, 180], sizeMulti: 470 } },
    { "Tall": { range: [181, 244], sizeMulti: 600 } },
    { "Huge": { range: [245, 457], sizeMulti: 700 } },
    { "Massive": { range: [458, 915], sizeMulti: 700 } },
    { "Macro": { range: [915, 3048], sizeMulti: 900 } }
];

window.sizeArray = function (range) {
    let sizeArr = []
    sizes.forEach(function (size, idx) {
        if(!range || range.includes(idx))
            sizeArr.push(Object.keys(size)[0])
    })
    return sizeArr
}

let bodyTypes = [
    { "Thin": { weightMod: 0.75, statMods: { strg: 0.5, dex: 1.5, acc: 1.5, con: 0.5 }, expMods: { pawEye: 2, size: 1, skill: 1 } } },
    { "Normal": { weightMod: 1, statMods: { strg: 1, dex: 1, acc: 1, con: 1 }, expMods: { size: 1, skill: 1 } } },
    { "Fit": { weightMod: 1.1, statMods: { strg: 1.2, dex: 1.2, acc: 1.2, con: 1.2 }, expMods: { agility: 2, size: 1, skill: 1 } } },
    { "Muscle": { weightMod: 1.3, statMods: { strg: 2, dex: 0.8, acc: 0.5, con: 1.5 }, expMods: { muscle: 2, size: 1, skill: 1 } } },
    { "Fat": { weightMod: 2, statMods: { strg: 1.5, dex: 0.6, acc: 0.5, con: 2 }, expMods: { fat: 2, size: 1, skill: 1 } } }
]

