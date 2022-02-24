let genders = [
    { "Male": { type: "Male", penis: true, balls: true, vagina: false, breasts: false, pronouns: 0, loot: [3, 4] } },
    { "Female": { type: "Female", penis: false, balls: false, vagina: true, breasts: true, pronouns: 1, loot: [5] } },
    { "Futa": { type: "Futa", penis: true, balls: true, vagina: true, breasts: true, pronouns: 3, loot: [3, 4, 5] } },
    { "Futa No Balls": { type: "Futa", penis: true, balls: false, vagina: true, breasts: true, pronouns: 3, loot: [3, 5] } },
    { "Futa No Breasts": { type: "Futa", penis: true, balls: true, vagina: true, breasts: false, pronouns: 3, loot: [3, 4] } },
    { "Futa No Breasts & No Balls": { type: "Futa", penis: true, balls: false, vagina: true, breasts: false, pronouns: 3, loot: [3] } },
    { "Cuntboi": { type: "Cuntboi", penis: false, balls: false, vagina: true, breasts: false, pronouns: 2, loot: [7] } }
]

let pronouns = [
    { subjective: "he", objective: "him", possessive: "his", reflexive: "himself" },
    { subjective: "she", objective: "her", possessive: "hers", reflexive: "herself" },
    { subjective: "they", objective: "them", possessive: "theirs", reflexive: "themself" },
    { subjective: "shi", objective: "hir", possessive: "hirs", reflexive: "hirself" }
]

export { genders, pronouns }