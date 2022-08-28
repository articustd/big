let sizes = [
    { name: "Micro", range: [1, 7], sizeMulti: 4, statBase: 10, loot: [7] },
    { name: "Tiny", range: [7, 30], sizeMulti: 66, statBase: 20, loot: [7] },
    { name: "Mini", range: [30, 60], sizeMulti: 150, statBase: 30, loot: [7] },
    { name: "Small", range: [60, 152], sizeMulti: 387, statBase: 40, loot: [7] },
    { name: "Average", range: [152, 180], sizeMulti: 470, statBase: 50, loot: [7] },
    { name: "Tall", range: [180, 244], sizeMulti: 600, statBase: 60, loot: [2] },
    { name: "Huge", range: [244, 457], sizeMulti: 700, statBase: 80, loot: [2] },
    { name: "Massive", range: [457, 6095], sizeMulti: 800, statBase: 100, loot: [2] },
    { name: "Macro", range: [6095], sizeMulti: 900, statBase: 120, loot: [2] } 
];

// Stat mods need to be a range to give more depth to descriptions
// REFACTOR Need to move name into objects
let bodyTypes = [
    { "Thin": { bodyFat: [0.05,0.07], statMods: { strg: [0.1,0.4], dex: [1.25,1.75], con: [0.4,0.6] }, expMods: { agility: 2, size: 1, skill: 1 }, loot: [7] } },
    { "Normal": { bodyFat: [0.1,0.2], statMods: { strg: [0.6,1], dex: [0.75,1], con: [0.75,1] }, expMods: { size: 1, skill: 1 }, loot: [7] } },
    { "Fit": { bodyFat: [0.08,0.1], statMods: { strg: [0.8,1.4], dex: [1,1.5], con: [1,1.5] }, expMods: { agility: 2, physique: 2, size: 1, skill: 1 }, loot: [6] } },
    { "Muscle": { bodyFat: [0.05,0.08], statMods: { strg: [1.5,2.5], dex: [0.6,0.9], con: [1,1.25] }, expMods: { muscle: 2, physique: 3, size: 1, skill: 1 }, loot: [0] } },
    { "Fat": { bodyFat: [0.45,0.8], statMods: { strg: [1,1.5], dex: [0.3,0.5], con: [1.5,2.5] }, expMods: { fat: 0.01, physique: 2, size: 1, skill: 1 }, loot: [6] } }
]

let muscleAmount = [
    {name: "Frail", range:[0,10], singular: 'a', pecs:'no', abs: `your imaginary abs`, arms: 'not much to look at', muscleGut: false, armsSecond: 'are slightly better than twigs'},
    {name: "Weak", range:[10,30], singular: 'a', pecs:'no', abs: `your flat stomach`, arms: `they're not much to look at`, muscleGut: false, armsSecond: 'are slightly better than twigs'},
    {name: "Average", range:[30,50], singular: 'an', pecs:'a little amount of', abs: `your singular muscle that is your abs`, muscleGut: false, arms: `they're about what you would expect`, armsSecond: `have a a bit of meat on them`},
    {name: "Healthy", range:[50,80], singular: 'a', pecs:'a decent amount of', abs: `the start of your soon to be six-pack abs`, muscleGut: false, arms: `they've put on some heft`, armsSecond: `are starting to show more definition`},
    {name: "Modest", range:[80,100], singular: 'a', pecs:'a modest amount of', abs: `your firm six-pack abs`, muscleGut: true, arms: `they've become bulkier`, armsSecond: `are defined and showing growth`},
    {name: "Large", range:[100,130], singular: 'a', pecs:'a generous amount of', abs: `your washboard abs`, muscleGut: true, arms: `they're more muscle than anything else`, armsSecond: `have become the size of coconuts`},
    {name: "Herculean", range:[130,200], singular: 'a', pecs:'near demi-god like', abs: `your mythical abs`, muscleGut: true, arms: `they've become near perfect`, armsSecond: `have become as large as a soccer ball`},
    {name: "Colossal", range:[200], singular: 'a', pecs:'mountain', abs: `your absolute cheese grater abs`, arms: `even the gods would be jealous`, muscleGut: true, armsSecond: `look like boulders shaped by time and erosion`},
]

let fatAmount = [
    {"Non-existant": {range:[0.0,0.05], singular: `a`, stomach: 'there is nothing there other than', showAbs: true}},
    {"Thin": {range:[0.05,0.10], singular: `a`, stomach: 'there is a thin layer of fat on top of', showAbs: true}},
    {"Lean": {range:[0.10,0.15], singular: `a`, stomach: 'there is some fat on', showAbs: true}},
    {"Healthy": {range:[0.15,0.20], singular: `a`, stomach: 'you see a small bit of fat on', showAbs: true}},
    {"Fair": {range:[0.20,0.25], singular: `a`, stomach: 'you see a little bump sticking out from underneath your shirt', showAbs: false}},
    {"Pudgey": {range:[0.25,0.30], singular: `a`, stomach: 'there is some flab starting to form', showAbs: false}},
    {"Large": {range:[0.30,0.35], singular: `a`, stomach: 'a gut has formed slightly lifting your shirt', showAbs: false}},
    {"Huge": {range:[0.35], singular: `a`, stomach: 'a mound of flesh encompases the area, eating any abs that may be underneath', showAbs: false}},
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
    {"Z": {range:[0.35]}}, // 26" Set this to 1 so there is no issues for large characters. Programatically set this up later. Should be 0.363 for normal ratio
]

let penisSize = [
    {"Peanut": {range:[0.00,0.05]}},
    {"Cucumber": {range:[0.05,0.09]}},
    {"Bratwurst": {range:[0.09,0.11]}},
    {"Cucumber": {range:[0.11,0.16]}},
    {"Baton": {range:[0.16,0.30]}},
    {"Baseball bat": {range:[0.30,0.50]}},
    {"Concrete barrier": {range:[0.50,0.70]}},
    {"Telephone pole": {range:[0.70]}},
]

let ballSize = [
    {"Walnut": {range:[0.00,0.02]}},
    {"Orange": {range:[0.02,0.06]}},
    {"Cantaloupe": {range:[0.06,0.18]}},
    {"Watermelon": {range:[0.18,0.23]}},
    {"Beach ball": {range:[0.23,0.30]}},
    {"Yoga ball": {range:[0.30,0.40]}},
    {"Wrecking ball": {range:[0.40]}},
]

export {sizes, bodyTypes, muscleAmount, fatAmount, breastSize, penisSize, ballSize}