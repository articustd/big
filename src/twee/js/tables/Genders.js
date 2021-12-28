let genders = [
    {"Male": { type: "Male", penis: true, balls: true, vagina: false, breasts: false }},
    {"Female": { type: "Female", penis: false, balls: false, vagina: true, breasts: true }},
    {"Futa": { type: "Futa", penis: true, balls: true, vagina: true, breasts: true }},
    {"Futa No Balls": { type: "Futa", penis: true, balls: false, vagina: true, breasts: true }},
    {"Futa No Breasts": { type: "Futa", penis: true, balls: true, vagina: true, breasts: false }},
    {"Futa No Breasts & No Balls": { type: "Futa", penis: true, balls: false, vagina: true, breasts: false }},
    {"Cuntboi": { type: "Cuntboi", penis: false, balls: false, vagina: true, breasts: false }}
]

function genderArray() {
    let genderArr = []
    genders.forEach(function (gender) {
        genderArr.push(Object.keys(gender)[0])
    })
    return genderArr
}