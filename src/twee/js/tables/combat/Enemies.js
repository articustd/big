let testEnemies = [
    {name:"Test Enemy",species:"Test",stats:{maxHlth:10,hlth:10,strg:5,def:5,acc:5,dex:5},exp:{muscle:[0,1],fat:[0,1],size:[0,1],skill:[0,1]},height:[180,190],weight:[80,90],loot:0},
    {name:"Test Enemy 2",species:"Test",stats:{maxHlth:10,hlth:10,strg:5,def:5,acc:5,dex:5},exp:{muscle:[0,1],fat:[0,1],size:[0,1],skill:[0,1]},height:[180,190],weight:[80,90],loot:0}
];


let microCityEnemies = [
    {type:"Muscle",species:"Mouse",stats:{maxHlth:10,strg:5,dex:5,acc:5},exp:{muscle:[1,2],skill:1},height:[23,28],weight:[5,8],loot:0},
    {name:"Fat",species:"Mouse",stats:{maxHlth:10,strg:5,dex:5,acc:5},exp:{fat:[1,2],skill:1},height:[23,28],weight:[10,13],loot:0}
]

let normalCityEnemies = [
    {type:"Muscle",species:"Wolf",stats:{maxHlth:20,strg:5,dex:5,acc:5},exp:{muscle:[1,4],skill:2},height:[180,190],weight:[80,90],loot:0},
    {name:"Fat Wolf",species:"Wolf",stats:{maxHlth:20,strg:5,dex:5,acc:5},exp:{fat:[1,4],skill:2},height:[180,190],weight:[100,105],loot:0}
]

let macroCityEnemies = [
    {type:"Muscle",species:"Dragon",stats:{maxHlth:40,strg:5,dex:5,acc:5},exp:{muscle:[2,6],skill:3},height:[457,914],weight:[227,453],loot:0},
    {name:"Fat Dragon",species:"Dragon",stats:{maxHlth:40,strg:5,dex:5,acc:5},exp:{fat:[2,6],skill:3},height:[457,914],weight:[317,500],loot:0}
]

let enemies = [
    microCityEnemies,
    normalCityEnemies,
    macroCityEnemies,
]