let attacks = [{
    "name": "Scratch",
    "type": "dex",
    "baseHitChnc": 50,
    "critMulti": 2,
    "maxMod": 0.9,
    "minMod": 0.6,
    "cost": 10,
    reqs: {
        isDisabled: (user,enemy) => { return false }
    },
    "desc": "You use your claws for a swiping attack."
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
    "desc": "Getting a taste before the meal.",
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
    "desc": "You are large enough to step on your oppenent. <br> You must be at least 2x taller to use this attack."
}
]

export { attacks }