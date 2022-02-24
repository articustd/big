import { genders } from '@js/data'

function genderArray() {
    let genderArr = []
    genders.forEach(function (gender) {
        genderArr.push(Object.keys(gender)[0])
    })
    return genderArr
}