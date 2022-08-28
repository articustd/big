import { genders } from '@js/data'

export function genderArray() {
    let genderArr = []
    genders.forEach(function (gender) {
        genderArr.push(Object.keys(gender)[0])
    })
    return genderArr
}