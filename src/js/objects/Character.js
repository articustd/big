import { logger } from "../controllers/util/Logging"
import _ from "lodash"
import { attackSkill, genders, loot, measurements, species } from "@js/data"
import { digest } from "@controller/character/CapacityController"

export class Character {
    constructor(data, load) {
        if (load) {
            this.load(load)
            return
        }

        this._hyper = variables().settings.tweak.hyperMode

        _.each(data, (val, key) => {
            this[`_${key}`] = val
        })

        this.calcSize()
        this.calcBodyType()

        this.setGender()
        this.setPronoun()

        this.measurements = {}
        this.measurements.height = _.random(this.size.range[0], (this.size.range[1]) ? this.size.range[1] - 1 : 1000000)
        this.measurements.bodyFat = _.round(_.random(this.bodyType.bodyFat[0], this.bodyType.bodyFat[1]), 2)

        this._species = (this._speciesName) ? this._speciesName : species[this._speciesId]
        this._capacityAmount = this._sizeId++

        this.calcStats()
        this.calcMaxHealth()
        this.stats.hlth = this.stats.maxHlth

        this.calcGenitals()

        this._capacity = {}
        this.calcCapacity()

        this.setEmptyExp()

        this._inv = []
        this.credits = 0
        this._skillPoints = 0

        this.setAttacks([0, 1, 2])
        this._passives = []
        this._statusEffect = []

        if (!this._isPlayer) {
            this.name = `${this.size.name} ${this.bodyType.name} ${this.species}`
            _.each(this.bodyType.expMods, (exp, expName) => {
                this.calcExp(expName, exp)
            })

            this.credits = _.floor(100 * _.clamp(_.random(1, 100), 75, 100) / 100)
            this.setAttacks([0, 1])

            this._loot = []
            this.setLoot()
        }

        this.postSetup()
    }

    get attacks() { return this._attacks }
    set attacks(attacks) { this._attacks = attacks }

    get bodyType() { return this._bodyType }
    set bodyType(bodyType) { this._bodyType = bodyType }

    get capacity() { return this._capacity }
    set capacity(capacity) { this._capacity = capacity }

    get credits() { return this._credits }
    set credits(credits) { this._credits = credits }

    get exp() { return this._exp }
    set exp(exp) { this._exp = exp }

    get gender() { return this._gender }
    set gender(gender) { this._gender = gender }

    get inv() { return this._inv }
    set inv(inv) { this._inv = inv }

    get loot() { return this._loot }
    set loot(loot) { this._loot = loot }

    get measurements() { return this._measurements }
    set measurements(measurements) { this._measurements = measurements }

    get name() { return this._name }
    set name(name) { this._name = name }

    get passives() { return this._passives }
    set passives(passives) { this._passives = passives }

    get size() { return this._size }
    set size(size) { this._size = size }

    get species() { return this._species }
    set species(species) { this._species = species }

    get skillPoints() { return this._skillPoints }
    set skillPoints(skillPoints) { this._skillPoints = skillPoints }

    get stats() { return this._stats }
    set stats(stats) { this._stats = stats }

    get statusEffect() { return this._statusEffect }
    set statusEffect(statusEffect) { this._statusEffect = statusEffect }

    get learnedAttacks() { return this._learnedAttacks }
    set learnedAttacks(learnedAttacks) { this._learnedAttacks = learnedAttacks }

    calcBodyType() {
        if (this._bodyTypeRange)
            this._bodyTypeId = _.random(_.clamp(this._bodyTypeRange[0], 0, measurements.bodyTypes.length - 1), _.clamp(this._bodyTypeRange[1], 0, measurements.bodyTypes.length - 1))
        else if (this._bodyTypeName)
            this._bodyTypeId = _.findIndex(measurements.bodyTypes, this._bodyTypeName)

        this.bodyType = _.reduce(_.cloneDeep(measurements.bodyTypes[this._bodyTypeId]))
        this.bodyType.name = _.keys(measurements.bodyTypes[this._bodyTypeId])[0]
    }

    calcCapacity() {
        this.capacity.stomachMax = this._capacityAmount
        this.capacity.stomach = []
        if (this.gender.balls) {
            this.capacity.testiMax = this._capacityAmount
            this.capacity.testi = []
        }
        if (this.gender.vagina) {
            this.capacity.wombMax = this._capacityAmount
            this.capacity.womb = []
        }
    }

    calcExp(expName, exp) {
        let hyperMod = (this._hyper) ? 4 : 1
        switch (expName) {
            case 'size':
                this.exp.size = _.ceil(this.measurements.height * (this._hyper ? 16 : 8))
                break
            case 'skill':
                this.exp.skill = _.floor(Math.log2(this.size.statBase)) * hyperMod
                break
            default:
                this.exp[expName] = (_.round(Math.log10(this.stats[this.expStatMapping(expName)])) * exp) * hyperMod
        }
    }

    calcGenitals() {
        this.gender.penis = (this.gender.penis) ? _.round(_.random(0.01, 0.7, true), 2) : false
        this.gender.balls = (this.gender.balls) ? _.round(_.random(0.01, 0.4, true), 2) : false
        this.gender.breasts = (this.gender.breasts) ? _.round(_.random(0.001, 0.35, true), 3) : false
    }

    calcMaxHealth() {
        let hB = Math.ceil(this.measurements.height * this.measurements.bodyFat)
        this.stats.maxHlth = Math.ceil((this.stats.con * Math.log(hB)) + 5)
    }

    calcSize() {
        if (this._sizeRange)
            this._sizeId = _.random(_.clamp(this._sizeRange[0], 0, measurements.sizes.length - 1), _.clamp(this._sizeRange[1], 0, measurements.sizes.length - 1))
        else if (this._sizeName)
            this._sizeId = _.findIndex(measurements.sizes, { name: this._sizeName })

        this.size = _.cloneDeep(measurements.sizes[this._sizeId])
    }

    calcStats() {
        if (this._stats)
            return

        if (!this._baseStat)
            this._baseStat = this.size.statBase

        this.stats = {}
        _.each(this.bodyType.statMods, (statRange, statName) => {
            this._stats[statName] = _.ceil(this._baseStat * _.ceil(_.random(statRange[0], statRange[1]), 2))
        })
    }

    getAvgStatPoints() {
        return _.ceil(_.reduce(this.stats, (result, value, key) => { if (!_.includes(_.toLower(key), 'hlth')) result += value; return result }) / 4)
    }

    setEmptyExp() {
        this.exp = { muscle: 0, fat: 0, pawEye: 0, physique: 0, agility: 0, size: 0, skill: 0 }
    }

    setAttacks(attackIds) {
        this.attacks = _.map(attackIds, (id) => {
            return { id, cooldown: attackSkill[id].cooldown, currCooldown: 0 }
        })
        this.learnedAttacks = this.attacks
    }

    setGender() {
        if (this._genderName)
            this.gender = _.find(genders, this._genderName)
        else
            this.gender = genders[this._genderId]

        this.gender = _.reduce(_.cloneDeep(this.gender))
    }

    setPronoun() {
        if (!this.pronoun)
            this.pronoun = this.gender.pronouns
    }

    setLoot() {
        _.each([...this.bodyType.loot, ...this.size.loot, ...this.gender.loot], (lootId) => {
            let { id, chnc } = loot[lootId]
            let existingLoot = _.find(this.loot, { id })

            if (existingLoot)
                existingLoot.qty += 1
            else
                this.loot.push({ id, qty: 1, chnc })
        })
    }

    postSetup() {
        _.unset(this.bodyType, 'loot')
        _.unset(this.gender, 'loot')
        _.unset(this.size, 'loot')

        if (!this._isPlayer) {
            _.each(this.exp, (amt, type) => {
                if (amt === 0)
                    _.unset(this.exp, type)
            })
        }
    }

    load(data) {
        _.each(data, (val, key) => {
            logger({ key, val })
            this[key] = val
        })
    }

    expStatMapping(expName) {
        switch (expName) {
            case 'muscle':
                return 'strg'
            case 'fat':
                return 'con'
            case 'pawEye':
                return 'acc'
            case 'agility':
                return 'dex'
            case 'physique':
                return 'con'
        }
    }

    expStatPath(expName) {
        switch (expName) {
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

    isAlive() {
        return this.stats.hlth > 0
    }

    digest(digestAmt) {
        digest(this, digestAmt)
    }

    levelUp(message = '') {
        let expNoSkillPoints = _.filter(_.keys(this.exp), (key) => { return key !== 'skill' })
        _.each(expNoSkillPoints, (expKey) => {
            let statPath = this.expStatPath(expKey)
            let origStat = _.get(this, statPath)

            while (this.exp[expKey] >= _.get(this, statPath)) {
                this.exp[expKey] -= _.get(character, statPath)
                _.set(this, statPath, _.get(this, statPath) + 1)
            }

            if (origStat !== _.get(this, statPath)) {
                switch (expKey) {
                    case 'muscle':
                        message += `Your muscles feel stronger and feel as though you could hit harder now!<br/>`
                        break
                    case 'agility':
                        message += `Standing up you feel a bit lighter on your paws!<br/>`
                        break
                    case 'physique':
                        message += `With a thump of your chest you feel much more sturdy now!<br/>`
                        break
                    case 'fat':
                        message += `Looking down you find your new girth!<br/>`
                        break
                    case 'size':
                        message += `Getting up you're a little dizzy from your new height!<br/>`
                        break
                }
            }
        })

        this.skillPoints += this.exp.skill
        this.exp.skill = 0

        return message
    }

    rest() {
        this.calcMaxHealth()
        this.stats.hlth = this.stats.maxHlth
    }
}