import { logger } from "@util/Logging";
import { species, measurements, genders, loot, skills, attackSkill } from '@js/data'
import _ from "lodash";

export function genChar(statPoints, speciesId, sizeRange, bodyTypeRange, genderId, name, pronounKey) {
    let character = { name: "", stats: {}, exp: {}, measurements: {}, gender: genders[genderId], capacity: {}, statusEffect: [] };
    let { size, capacityAmount } = randomSize(sizeRange)
    let { bodyTypeName, bodyType } = randomBodyType(bodyTypeRange)

    let statMods = bodyType.statMods
    let expMods = bodyType.expMods

    // Collect All Potential Loot
    let rawLoot = [...bodyType.loot, ...size.loot, ...character.gender[Object.keys(character.gender)[0]].loot]
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
    var randomPercent = Math.clamp(_.random(1, 100), 75, 100) / 100
    var credits = Math.floor(100 * randomPercent);

    // Calculate Measurements
    character.measurements.height = _.random(size.range[0], (size.range[1]) ? size.range[1] - 1 : 1000000)
    character.measurements.bodyFat = _.round(_.random(bodyType.bodyFat[0], bodyType.bodyFat[1]), 2)

    // Default Hyper to no
    let hyper = false

    // Species
    character.species = species[speciesId]

    // Calculate Stats
    statPoints = size.statBase
    calcStats(character, statMods, statPoints)

    // Calculate Exp and Name (This was not fun)
    if (!name) {
        character.name = `${size.name} ${bodyTypeName} ${species[speciesId]}`

        for (let exp in expMods)
            character.exp[exp] = getExpCalc(character, exp, expMods[exp], statPoints)

        character.loot = availableLoot
        character.credits = credits
        character.capacityAmount = capacityAmount

        // Base Attacks
        character.attacks = setAttacks([0, 1])
        character.learnedAttacks = character.attacks
    } else {
        character.name = name
        character.exp = blankExp()
        character.credits = 0
        character.skillPoints = 0
        character.inv = []

        // Base Attacks
        character.attacks = setAttacks([0, 1, 2])
        character.learnedAttacks = character.attacks
        character.passives = []
    }

    // Calculate Genitals... Oh boy
    character.gender = calcGenitals(character.gender, pronounKey)

    // Calculate Max Health and Current Health
    calcMaxHealth(character)

    // Calculate Capacity
    character.capacity = {}
    calcCapacity(character, capacityAmount)

    // logger(character)
    return character;
}

function setAttacks(attackIds) {
    return _.map(attackIds, (id) => {
        let { cooldown } = attackSkill[id]
        return { id, cooldown, currCooldown: 0 }
    })
}

function randomSize(range, sizeIdx) {
    if (Array.isArray(range))
        sizeIdx = random(Math.clamp(range[0], 0, measurements.sizes.length - 1), Math.clamp(range[1], 0, measurements.sizes.length - 1))
    else
        sizeIdx = Math.clamp(range, 0, measurements.sizes.length - 1)

    let sizeObj = measurements.sizes[sizeIdx]
    sizeIdx++ // Increment by 1 for capacityAmount

    return { size: sizeObj, capacityAmount: sizeIdx }
}

function randomBodyType(range) {
    let bodyTypeIdx
    if (Array.isArray(range))
        bodyTypeIdx = random(Math.clamp(range[0], 0, measurements.bodyTypes.length - 1), Math.clamp(range[1], 0, measurements.bodyTypes.length - 1))
    else
        bodyTypeIdx = Math.clamp(range, 0, measurements.bodyTypes.length - 1)

    let bodyTypeObj = measurements.bodyTypes[bodyTypeIdx]
    let bodyTypeName = Object.keys(bodyTypeObj)[0]
    let { [bodyTypeName]: bodyType } = bodyTypeObj

    return { bodyTypeName, bodyType }
}

function calcStats(character, statMods, statPoints) {
    _.each(statMods, (statRange, statName) => {
        let statMod = _.ceil(_.random(statRange[0], statRange[1]), 2)
        character.stats[statName] = Math.ceil(statPoints * statMod)
    })
}

function calcGenitals(gender, pronounKey) {
    let genderKey = Object.keys(gender)[0]
    let response = {
        penis: (gender[genderKey].penis) ? _.round(_.random(0.01, 0.7, true), 2) : false,
        balls: (gender[genderKey].balls) ? _.round(_.random(0.01, 0.4, true), 2) : false,
        breasts: (gender[genderKey].breasts) ? _.round(_.random(0.001, 0.35, true), 3) : false,
        vagina: gender[genderKey].vagina
    }
    response.type = gender[genderKey].type
    response.pronouns = (pronounKey) ? pronounKey : gender[genderKey].pronouns
    return response
}

function blankExp() {
    return { muscle: 0, fat: 0, pawEye: 0, physique: 0, agility: 0, size: 0, skill: 0 }
}

function getExpCalc(character, exp, expMod, statPoints) {
    let { settings: { tweak: { hyperMode } } } = variables()
    let hyperMod = (hyperMode) ? 4 : 1
    switch (exp) {
        case 'muscle':
            return (Math.round(Math.log10(character.stats.strg)) * expMod) * hyperMod
        case 'fat':
            return (Math.round(Math.log10(character.stats.con)) * expMod) * hyperMod
        case 'size':
            return _.ceil(character.measurements.height * (hyperMode ? 16 : 8))
        case 'skill':
            return (Math.floor(Math.log2(statPoints))) * hyperMod
        case 'pawEye':
            return (Math.round(Math.log10(character.stats.acc)) * expMod) * hyperMod
        case 'agility':
            return (Math.round(Math.log10(character.stats.dex)) * expMod) * hyperMod
        case 'physique':
            return (Math.round(Math.log10(character.stats.con)) * expMod) * hyperMod
    }
}

function calcMaxHealth(character) {
    character.stats.hlth = getMaxHealth(character)
    character.stats.maxHlth = getMaxHealth(character)
}

//HACK Changed to BodyFat % temporarily to see how it effects health
export function getMaxHealth({ stats: { con }, measurements: { height, bodyFat } }) {
    let hB = Math.ceil(height * bodyFat)
    return Math.ceil((con * Math.log(hB)) + 5)
}

//HACK need to finalize stomach capacity calcs
function calcCapacity({ capacity, gender }, maxCap) {
    capacity.stomachMax = maxCap
    capacity.stomach = []
    if (gender.balls) {
        capacity.testiMax = maxCap
        capacity.testi = []
    }
    if (gender.vagina) {
        capacity.wombMax = maxCap
        capacity.womb = []
    }
}

export function statPoints(player) {
    return (player.stats.strg + player.stats.con + player.stats.dex) / 4
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
        case 'physique':
            return 'Physique'
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
        case 'bodyFat':
            return 'Body Fat'
    }
}

export function statMapping(stat) {
    switch (stat) {
        case 'muscle':
            return 'stats.strg'
        case 'pawEye':
            return 'stats.acc'
        case 'agility':
            return 'stats.dex'
        case 'physique':
            return 'stats.con'
        case 'fat':
            return 'measurements.bodyFat'
        case 'size':
            return 'measurements.height'
    }
}

function getExpKeysNoSkill({ exp }) {
    return _.filter(_.keys(exp), (key) => { return key !== 'skill' })
}

export function levelUp(character, message = '') {
    _.each(getExpKeysNoSkill(character), (expKey) => {
        let statPath = statMapping(expKey) // Get path to stat from exp type
        let origStat = _.get(character, statPath) // Hold onto original stat value
        while (character.exp[expKey] >= _.get(character, statPath)) { // Loop over exp until all have been added to stats with the increasing amount
            character.exp[expKey] -= _.get(character, statPath)
            _.set(character, statPath, _.get(character, statPath) + 1)
        }

        if (origStat !== _.get(character, statPath)) { // If we leveled up any
            statPath = _.split(statPath, '.')[1] // Pull out the stat key
            switch (returnStatName(statPath)) { // Write specific leveling up text
                case 'Strength':
                    message += `Your muscles feel stronger and feel as though you could hit harder now!<br/>`
                    break
                case 'Dexterity':
                    message += `Standing up you feel a bit lighter on your paws!<br/>`
                    break
                case 'Constitution':
                    message += `With a thump of your chest you feel much more sturdy now!<br/>`
                    break
                case 'Height':
                    message += `Getting up you're a little dizzy from your new height!<br/>`
                    break
                case 'Body Fat':
                    message += `Looking down you find your new girth!<br/>`
                    break
            }
        }
    })

    character.skillPoints += character.exp.skill
    character.exp.skill = 0

    return message
}

// CONVERTED 
export function rest(character) {
    character.stats.maxHlth = getMaxHealth(character)
    character.stats.hlth = character.stats.maxHlth;
}

export function getSkillById(id) {
    return skills[id]
}

export function getAttackSkill(id) {
    return attackSkill[id]
}

