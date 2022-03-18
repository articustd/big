import { logger } from "@util/Logging";
import { species, measurements, genders, loot, skills } from '@js/data'

export function genChar(statPoints, speciesId, sizeRange, bodyTypeRange, genderId, name, pronounKey) {
    let character = { name: "", stats: {}, exp: {}, measurements: {}, gender: genders[genderId], capacity: {} };
    logger(`In char`)
    let size = measurements.sizes[randomSize(sizeRange)]
    logger(`After size`)
    let sizeKey = Object.keys(size)[0]

    let bodyType = measurements.bodyTypes[randomBodyType(bodyTypeRange)]
    let bodyTypeKey = Object.keys(bodyType)[0]

    let statMods = bodyType[bodyTypeKey].statMods
    let expMods = bodyType[bodyTypeKey].expMods

    // Collect All Potential Loot
    let rawLoot = [...bodyType[bodyTypeKey].loot, ...size[sizeKey].loot, ...character.gender[Object.keys(character.gender)[0]].loot]
    // Loop through and count items
    let availableLoot = []
    for (let item of rawLoot) {
        let found = false
        availableLoot.forEach(function (foundLoot, idx) {
            if (loot[item].id === foundLoot.id) {
                found = true
                availableLoot[idx].qty += 1
            }
        })
        if (!found)
            availableLoot.push({ id: loot[item].id, qty: 1, chnc: loot[item].chnc })
    }
    // Roll for credits
    var randomPercent = Math.clamp(random(1, 100), 75, 100) / 100
    var credits = Math.floor(50 * randomPercent);

    // Calculate Measurements
    logger(`Before height`)
    character.measurements.height = random(size[sizeKey].range[0], (size[sizeKey].range[1]) ? size[sizeKey].range[1] : 1000000)
    character.measurements.bodyFat = bodyType[bodyTypeKey].bodyFat //HACK Rudimentary, need to change to ranges
    logger(`After height`)
    // Default Hyper to no
    let hyper = false

    // Species
    character.species = species[speciesId]

    // Calculate Stats
    statPoints = size[sizeKey].statBase
    calcStats(character, statMods, statPoints)

    // Calculate Exp and Name (This was not fun)
    if (!name) {
        character.name = `${sizeKey} ${bodyTypeKey} ${species[speciesId]}`

        for (let exp in expMods)
            character.exp[exp] = getExpCalc(character, exp, expMods[exp], statPoints)

        character.loot = availableLoot
        character.credits = credits

        // Base Attacks
        character.attacks = [1, 0]
        character.learnedAttacks = character.attacks
    } else {
        character.name = name
        character.exp = blankExp()
        character.credits = 0
        character.skills = []
        character.skillPoints = 0
        character.inv = []

        // Base Attacks
        character.attacks = [0, 1, 2]
        character.learnedAttacks = character.attacks
    }

    // Calculate Genitals... Oh boy
    character.gender = calcGenitals(hyper, character.measurements.height, character.gender, pronounKey)

    // Calculate Max Health and Current Health
    calcMaxHealth(character)

    // Calculate Capacity
    calcCapacity(character)

    return character;
}

function randomSize(range) {
    if (Array.isArray(range))
        return random(Math.clamp(range[0], 0, measurements.sizes.length - 1), Math.clamp(range[1], 0, measurements.sizes.length - 1))
    return Math.clamp(range, 0, measurements.sizes.length - 1)
}

function randomBodyType(range) {
    if (Array.isArray(range))
        return random(Math.clamp(range[0], 0, measurements.bodyTypes.length - 1), Math.clamp(range[1], 0, measurements.bodyTypes.length - 1))
    return Math.clamp(range, 0, measurements.bodyTypes.length - 1)
}

function calcStats(character, statMods, statPoints) {
    for (let statMod in statMods) {
        character.stats[statMod] = Math.ceil(statPoints * statMods[statMod])
    }
}

function calcGenitals(hyper, height, gender, pronounKey) {
    let hyperMod = hyper ? 2 : 1
    let genderKey = Object.keys(gender)[0]
    let response = {
        penis: Math.floor(((height / random(height - 20, height + 20)) + 1) * hyperMod) / 100,
        balls: Math.floor(((height / random(height - 5, height + 20)) + 1) * hyperMod) / 100,
        breasts: Math.floor(((height / random(100, height + 20)) + 1) * hyperMod) / 100,
        vagina: true
    }
    for (let gen in gender[genderKey]) {
        if (!gender[genderKey][gen])
            response[gen] = false
    }
    response.type = gender[genderKey].type
    response.pronouns = (pronounKey) ? pronounKey : gender[genderKey].pronouns
    return response
}

function blankExp() {
    return { muscle: 0, fat: 0, pawEye: 0, agility: 0, size: 0, skill: 0 }
}

function getExpCalc(character, exp, expMod, statPoints) {
    let hyperMode = (variables().settings.tweak.hyperMode) ? 4 : 1
    switch (exp) {
        case 'muscle':
            return (Math.round(Math.log10(character.stats.strg)) * expMod) * hyperMode
        case 'fat':
            return (Math.round(Math.log10(character.stats.con)) * expMod) * hyperMode
        case 'size':
            return (Math.floor(Math.log(character.measurements.height) ** 2)) * hyperMode
        case 'skill':
            return (Math.floor(Math.log2(statPoints))) * hyperMode
        case 'pawEye':
            return (Math.round(Math.log10(character.stats.acc)) * expMod) * hyperMode
        case 'agility':
            return (Math.round(Math.log10(character.stats.dex)) * expMod) * hyperMode
    }
}

function calcMaxHealth(character) {
    character.stats.hlth = getMaxHealth(character)
    character.stats.maxHlth = getMaxHealth(character)
}

//HACK Changed to BodyFat % temporarily to see how it effects health
export function getMaxHealth(character) {
    let hB = Math.ceil(character.measurements.height * character.measurements.bodyFat)
    let con = character.stats.con
    return Math.ceil((con * Math.log(hB)) + 5)
}

//HACK need to finalize stomach capacity calcs
function calcCapacity(character) {
    character.capacity.stomachMax = Math.ceil(character.measurements.height / character.measurements.bodyFat)
    character.capacity.stomach = 0
    if (character.gender.balls) {
        let ballSize = character.measurements.height * character.gender.balls
        character.capacity.testiMax = Math.floor((4 / 3) * Math.PI * (ballSize ** 3)) * 2
        character.capacity.testi = 0
    }
    if (character.gender.vagina) {
        character.capacity.wombMax = Math.ceil(character.measurements.height / character.measurements.bodyFat)
        character.capacity.womb = 0
    }
}

export function statPoints(player) {
    return (player.stats.strg + player.stats.con + player.stats.dex + player.stats.acc) / 4
}

export function returnStatName(stat) {
    switch (stat) {
        case 'con':
            return 'Constitution'
        case 'hlth':
            return 'Health'
        case 'strg':
            return 'Strength'
        case 'def':
            return 'Defense'
        case 'acc':
            return 'Accuracy'
        case 'dex':
            return 'Dexterity'
        case 'muscle':
            return 'Muscle'
        case 'fat':
            return 'Fat'
        case 'size':
            return 'Size'
        case 'agility':
            return 'Agility'
        case 'pawEye':
            return 'Paw-Eye Coordination'
        case 'skill':
            return 'Skill'
        case 'penis':
            return 'Penis'
        case 'balls':
            return 'Balls'
        case 'breasts':
            return 'Breasts'
        case 'height':
            return 'Height'
    }
}

export function capacityChange(player) {
    for (let cap in player.capacity) {
        if (!cap.contains("Max") && player.capacity[cap] > 0) {
            player.capacity[`${cap}Max`] += Math.min(Math.ceil(player.capacity[cap]), player.capacity[`${cap}Max`]) / 4
            player.capacity[cap] = 0
        }
    }
}

export function statMapping(stat) {
    switch (stat) {
        case 'muscle':
            return ['stats', 'strg']
        case 'fat':
            return ['measurements', 'bodyFat']
        case 'size':
            return ['measurements', 'height']
        case 'skill':
            return ['skillPoints']
        case 'pawEye':
            return ['stats', 'acc']
        case 'agility':
            return ['stats', 'dex']
    }
}

export function levelUp(character) {
    let leveled = false
    Object.entries(character.exp).forEach(([stat, value]) => {
        if (value !== 0) {
            let statMap = statMapping(stat)
            if (statMap.length == 1)
                character[statMap[0]] += value

            if (statMap.length == 2)
                character[statMap[0]][statMap[1]] += value

            character.exp[stat] = 0

            leveled = true
        }
    });
    return leveled
}

export function rest(character) {
    character.stats.maxHlth = getMaxHealth(character)
    character.stats.hlth = character.stats.maxHlth;
    capacityChange(character)
}

export function getSkillById(id) {
    return skills[id]
}