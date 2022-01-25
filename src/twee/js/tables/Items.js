let testItems = [
    {name: "Test Item", mod: 1, type: "stats", stat: "strg"},
    {name: "Test Item 2", mod: 1, type: "exp", stat: "size"}
]

let items = [
    {name: "Little Health Potion", mod: 5, type: "stats", stat: "hlth"}, // 0
    {name: "Protein Powder", mod: 3, type: "exp", stat: "muscle"},
    {name: "Size Elixir", mod: 10, type: "exp", stat: "size"},
    {name: "Tub of Grease", mod: 0.01, type: "exp", stat: "fat"},
    {name: "Vitamins", mod: 1, type: "stats", stat: "con"},
    {name: "Blue Pill", mod: 0.02, type: "gender", stat: "penis"}, // 5
    {name: "Magnisium Pills", mod: 0.01, type: "gender", stat: "balls"},
    {name: "Injection", mod: 0.01, type: "gender", stat: "breasts"},
    {name: "Health Potion", mod: 15, type: "stats", stat: "hlth"},
    {name: "Muscle Reducer", mod: -3, type: "exp", stat: "muscle"},
    {name: "Shrink Elixir", mod: -10, type: "exp", stat: "size"}, // 10
    {name: "Soybeans", mod: -0.01, type: "exp", stat: "fat"},
    {name: "Penis Reducer", mod: -0.02, type: "gender", stat: "penis"},
    {name: "Heat Pad", mod: -0.01, type: "gender", stat: "balls"},
    {name: "Breast Reducer", mod: -0.01, type: "gender", stat: "breasts"},
    {name: "Large Health Potion", mod: 30, type: "stats", stat: "hlth"}, // 15
]

let loot = [
    {id:1,chnc:30}, //Muscle loot
    {id:3,chnc:30}, //Fat loot
    {id:2,chnc:30}, //Size loot
    {id:5,chnc:30}, //Penis loot
    {id:6,chnc:30}, //Balls loot
    {id:7,chnc:30}, //Breasts loot
    {id:4,chnc:30}, //Con loot
    {id:0,chnc:30}, //Just Health
]