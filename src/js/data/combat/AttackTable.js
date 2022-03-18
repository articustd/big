let attacks = [{
    "name": "Scratch",
    "type": "strg",
    "baseHitChnc": 75,
    "critMulti": 2,
    "maxMod": 0.6,
    "minMod": 0.3,
    "cost": 10,
    reqs: {
        isDisabled: (user,enemy) => { return false }
    },
    "desc": "''Description:''<br/>You use your claws for a swiping attack.<br/><br/>''Stat Modifers:''<br/>- Strength"
},
{
    "name": "Bite",
    "type": "strg",
    "baseHitChnc": 50,
    "critMulti": 2,
    "maxMod": 0.9,
    "minMod": 0.6,
    "cost": 10,
    reqs: {
        isDisabled: (user,enemy) => { return false }
    },
    "desc": "''Description:''<br/>Getting a taste before the meal.<br/><br/>''Stat Modifers:''<br/>- Strength",
},
{
    "name": "Stomp",
    "type": "strg",
    "baseHitChnc": 50,
    "critMulti": 2,
    "maxMod": 0.99,
    "minMod": 0.6,
    "cost": 50,
    "reqs": {
        isDisabled: (user, enemy) => { return user.measurements.height / enemy.measurements.height < 2 },
        disabledToolTip: `Enemy is too large`,
    },
    "desc": "''Description:''<br/>You are large enough to step on your oppenent.<br/><br/>''Stat Modifers:''<br/>- Strength<br/><br/>''Requirements:''<br>You must be at least 2x taller to use this attack. If not, it will be disabled in combat."
}
]

export { attacks }