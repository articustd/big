import { pronouns } from '@js/data'

export function pronounArray() {
    let pronounArr = []
    for (let pro of pronouns)
        pronounArr.push(`${pro.subjective} / ${pro.objective} / ${pro.possessive} / ${pro.reflexive}`)

    return pronounArr
}

export function getPronounId(pronouns) {
    let response = 0
    pronounArray().forEach(function (pro, idx) {
        if (pronouns === pro)
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