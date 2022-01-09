let sizes = [
    { "Micro": { range: [3, 7], sizeMulti: 4, loot: [7] } },
    { "Tiny": { range: [8, 30], sizeMulti: 66, loot: [7] } },
    { "Mini": { range: [31, 60], sizeMulti: 150, loot: [7] } },
    { "Small": { range: [61, 152], sizeMulti: 387, loot: [7] } },
    { "Average": { range: [153, 180], sizeMulti: 470, loot: [7] } },
    { "Tall": { range: [181, 244], sizeMulti: 600, loot: [2] } },
    { "Huge": { range: [245, 457], sizeMulti: 700, loot: [2] } },
    { "Massive": { range: [458, 915], sizeMulti: 800, loot: [2] } },
    { "Macro": { range: [915, 3048], sizeMulti: 900, loot: [2] } }
];

let bodyTypes = [
    { "Thin": { weightMod: 0.75, statMods: { strg: 0.5, dex: 1.5, acc: 1.5, con: 0.5 }, expMods: { pawEye: 2, size: 1, skill: 1 }, loot: [7] } },
    { "Normal": { weightMod: 1, statMods: { strg: 1, dex: 1, acc: 1, con: 1 }, expMods: { size: 1, skill: 1 }, loot: [7] } },
    { "Fit": { weightMod: 1.1, statMods: { strg: 1.2, dex: 1.2, acc: 1.2, con: 1.2 }, expMods: { agility: 2, size: 1, skill: 1 }, loot: [6] } },
    { "Muscle": { weightMod: 1.3, statMods: { strg: 2, dex: 0.8, acc: 0.5, con: 1.5 }, expMods: { muscle: 2, size: 1, skill: 1 }, loot: [0] } },
    { "Fat": { weightMod: 2, statMods: { strg: 1.5, dex: 0.6, acc: 0.5, con: 2 }, expMods: { fat: 2, size: 1, skill: 1 }, loot: [6] } }
]

let muscleAmount = [
    {"Weak": {range:[0,20], pecs:'no', arms: 'not much to look at', armsSecond: 'slightly better than twigs'}},
]

let fatAmount = [
    {"Fair": {range:[0.207,0.234], stomach: 'a little bit of pudge, but not a noticable amount from underneath your shirt'}}
]

let breastSize = [
    {"A": {range:[0.1,0.9]}}
]

let penisSize = [
    {"Bratwurst": {range:[0.10,0.13]}}
]

let ballSize = [
    {"Walnut": {range:[0.01,0.02]}},
    {"Orange": {range:[0.03,0.06]}},
    {"Cantaloupe": {range:[0.07,0.18]}},
    {"Watermelon": {range:[0.19,0.23]}},
    {"Beach ball": {range:[0.24,0.30]}},
]