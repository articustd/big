let genders = [
    {"Male": { type: "Male", penis: true, balls: true, vagina: false, breasts: false, pronouns: 0, loot: [3,4] }},
    {"Female": { type: "Female", penis: false, balls: false, vagina: true, breasts: true, pronouns: 1, loot: [5] }},
    {"Futa": { type: "Futa", penis: true, balls: true, vagina: true, breasts: true, pronouns: 3, loot: [3,4,5] }},
    {"Futa No Balls": { type: "Futa", penis: true, balls: false, vagina: true, breasts: true, pronouns: 3, loot: [3,5] }},
    {"Futa No Breasts": { type: "Futa", penis: true, balls: true, vagina: true, breasts: false, pronouns: 3, loot: [3,4] }},
    {"Futa No Breasts & No Balls": { type: "Futa", penis: true, balls: false, vagina: true, breasts: false, pronouns: 3, loot: [3] }},
    {"Cuntboi": { type: "Cuntboi", penis: false, balls: false, vagina: true, breasts: false, pronouns: 2, loot: [7] }}
]

let pronouns = [
    {subjective:"he",objective:"him",possessive:"his",reflexive:"himself"},
    {subjective:"she",objective:"her",possessive:"hers",reflexive:"herself"},
    {subjective:"they",objective:"them",possessive:"theirs",reflexive:"themself"},
    {subjective:"shi",objective:"hir",possessive:"hirs",reflexive:"hirself"}
]

function genderArray() {
    let genderArr = []
    genders.forEach(function (gender) {
        genderArr.push(Object.keys(gender)[0])
    })
    return genderArr
}

function pronounArray() {
    let pronounArr = []
    for(let pro of pronouns) 
        pronounArr.push(`${pro.subjective} / ${pro.objective} / ${pro.possessive} / ${pro.reflexive}`)
    
    return pronounArr
}

function getPronounId(pronouns) {
    let response = 0
    pronounArray().forEach(function (pro, idx) {
        if(pronouns === pro)
            response = idx
    })
    return response
}

function getSubPronoun(character) {
    return pronouns[character.pronouns].subjective
}

function getObjPronoun(character) {
    return pronouns[character.pronouns].objective
}

function getPosPronoun(character) {
    return pronouns[character.pronouns].possessive
}

function getRefPronoun(character) {
    return pronouns[character.pronouns].reflexive
}