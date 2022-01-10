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
    // {"Weak": {range:[0,20], pecs:'no', arms: 'not much to look at', armsSecond: 'slightly better than twigs'}},
    {"Weak": {range:[0,2000000], pecs:'no', arms: 'not much to look at', armsSecond: 'slightly better than twigs'}},
]

let fatAmount = [
    // {"Fair": {range:[0.207,0.234], stomach: 'a little bit of pudge, but not a noticable amount from underneath your shirt'}},
    {"Fair": {range:[0.01,30], stomach: 'a little bit of pudge, but not a noticable amount from underneath your shirt'}},
]

let breastSize = [ // 1" increments, calc to cm then cm/182 to get range. 182cm is the average height
    {"AA": {range:[0.001,0.01]}}, // < 1"
    {"A": {range:[0.01,0.02]}}, // 1"
    {"B": {range:[0.02,0.03]}},
    {"C": {range:[0.03,0.04]}},
    {"D": {range:[0.04,0.055]}},
    {"E": {range:[0.055,0.07]}},
    {"F": {range:[0.07,0.085]}},
    {"G": {range:[0.085,0.1]}},
    {"H": {range:[0.1,0.12]}},
    {"I": {range:[0.12,0.13]}},
    {"J": {range:[0.13,0.14]}},
    {"K": {range:[0.14,0.154]}},
    {"L": {range:[0.154,0.168]}},
    {"M": {range:[0.168,0.182]}},
    {"N": {range:[0.182,0.196]}},
    {"O": {range:[0.196,0.21]}}, // 15"
    {"P": {range:[0.21,0.223]}},
    {"Q": {range:[0.223,0.238]}},
    {"R": {range:[0.238,0.252]}},
    {"S": {range:[0.252,0.265]}},
    {"T": {range:[0.265,0.28]}},
    {"U": {range:[0.28,0.293]}},
    {"V": {range:[0.293,0.31]}},
    {"W": {range:[0.31,0.321]}},
    {"X": {range:[0.321,0.335]}},
    {"Y": {range:[0.335,0.35]}},
    {"Z": {range:[0.35,10]}}, // 26" Set this to 1 so there is no issues for large characters. Programatically set this up later. Should be 0.363 for normal ratio
]

let penisSize = [
    {"Peanut": {range:[0.01,0.05]}},
    {"Cucumber": {range:[0.05,0.09]}},
    {"Bratwurst": {range:[0.09,0.11]}},
    {"Cucumber": {range:[0.11,0.16]}},
    {"Baton": {range:[0.16,0.30]}},
    {"Baseball bat": {range:[0.30,0.50]}},
    {"Concrete barrier": {range:[0.50,0.70]}},
    {"Telephone pole": {range:[0.70,10]}},
]

let ballSize = [
    {"Walnut": {range:[0.01,0.02]}},
    {"Orange": {range:[0.02,0.06]}},
    {"Cantaloupe": {range:[0.06,0.18]}},
    {"Watermelon": {range:[0.18,0.23]}},
    {"Beach ball": {range:[0.23,0.30]}},
    {"Yoga ball": {range:[0.30,0.40]}},
    {"Wrecking ball": {range:[0.40,10]}},
]