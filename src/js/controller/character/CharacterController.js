import { logger } from "@util/Logging";
import { species, measurements, genders, loot, skills, attackSkill } from '@js/data'
import _ from "lodash";

export function genChar(statPoints, speciesId, sizeRange, bodyTypeRange, genderId, name, pronounKey) {
    let character = { name: "", stats: {}, exp: {}, measurements: {}, gender: genders[genderId], capacity: {}, statusEffect: [] };
    let { sizeName, size, sizeIdx } = randomSize(sizeRange)
    logger({ sizeName, size, sizeIdx })
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
    var randomPercent = Math.clamp(random(1, 100), 75, 100) / 100
    var credits = Math.floor(100 * randomPercent);

    // Calculate Measurements
    character.measurements.height = random(size.range[0], (size.range[1]) ? size.range[1] : 1000000)
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
        character.name = `${sizeName} ${bodyTypeName} ${species[speciesId]}`

        for (let exp in expMods)
            character.exp[exp] = getExpCalc(character, exp, expMods[exp], statPoints)

        character.loot = availableLoot
        character.credits = credits
        character.capacityAmount = (sizeIdx > 0) ? sizeIdx : 1

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
    character.gender = calcGenitals(hyper, character.measurements.height, character.gender, pronounKey)

    // Calculate Max Health and Current Health
    calcMaxHealth(character)

    // Calculate Capacity
    calcCapacity(character, sizeIdx)

    logger(character)
    return character;
}

function setAttacks(attackIds) {
    return _.map(attackIds, (id) => {
        let { cooldown } = attackSkill[id]
        return { id, cooldown, currCooldown: 0 }
    })
}

function randomSize(range) {
    let sizeIdx
    if (Array.isArray(range))
        sizeIdx = random(Math.clamp(range[0], 0, measurements.sizes.length - 1), Math.clamp(range[1], 0, measurements.sizes.length - 1))
    else
        sizeIdx = Math.clamp(range, 0, measurements.sizes.length - 1)

    let sizeObj = measurements.sizes[sizeIdx]
    let sizeName = Object.keys(sizeObj)[0]
    let { [sizeName]: size } = sizeObj

    return { sizeName, size, sizeIdx }
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
            return (Math.floor(Math.log10(character.measurements.height) * expMod)) * hyperMode
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
export function getMaxHealth({ stats: { con }, measurements: { height, bodyFat } }) {
    let hB = Math.ceil(height * bodyFat)
    return Math.ceil((con * Math.log(hB)) + 5)
}

//HACK need to finalize stomach capacity calcs
function calcCapacity(character, maxCap) {
    if (maxCap < 2)
        maxCap = 1

    character.capacity.stomachMax = maxCap
    character.capacity.stomach = []
    if (character.gender.balls) {
        character.capacity.testiMax = maxCap
        character.capacity.testi = []
    }
    if (character.gender.vagina) {
        character.capacity.wombMax = maxCap
        character.capacity.womb = []
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



export function statMapping(stat) {
    switch (stat) {
        case 'muscle':
            return 'stats.strg'
        case 'fat':
            return 'measurements.bodyFat'
        case 'size':
            return 'measurements.height'
        case 'pawEye':
            return 'stats.acc'
        case 'agility':
            return 'stats.dex'
    }
}

function getExpKeysNoSkill({ exp }) {
    return _.filter(_.keys(exp), (key) => { return key !== 'skill' })
}

export function levelUp(character) {
    _.each(getExpKeysNoSkill(character), (expKey) => {
        let statPath = statMapping(expKey) // Get path to stat from exp type
        let origStat = _.get(character, statPath) // Hold onto original stat value
        while (character.exp[expKey] >= _.get(character, statPath)) { // Loop over exp until all have been added to stats with the increasing amount
            character.exp[expKey] -= _.get(character, statPath)
            _.set(character, statPath, _.get(character, statPath) + 1)
        }

        if (origStat !== _.get(character, statPath)) { // If we leveled up any
            let newStat = _.get(character, statPath)
            statPath = _.split(statPath, '.')[1] // Pull out the stat key
            switch(returnStatName(statPath)) { // Write specific leveling up text
                case 'Strength':
                    variables().restText += `Your muscles feel stronger and feel as though you could hit harder now!<br/>`
                    break
                case 'Dexterity':
                    variables().restText += `Standing up you feel a bit lighter on your paws!<br/>`
                    break
                case 'Constitution':
                    variables().restText += `With a thump of your chest you feel much sturdy now!`
                    break
            }
        }
    })

    character.skillPoints += character.exp.skill
    character.exp.skill = 0
}

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