export let attackSkill = [
    {
        "name": "Scratch",
        "skill": false,
        "passive": false,
        "cooldown": 0,
        "skillPoints": 10,
        "desc": {
            "baseDesc": "You use your claws for a swiping attack",
            "critDesc": "2x",
            "statMods": [
                {
                    "stat": "Strength"
                }
            ],
            "reqs": [
                {
                    "req": "None"
                }
            ],
            "atkTooltip": "Basic claw attack"
        },
        "direct": {
            "hit": 75,
            "stat": "strg",
            "dmg": {
                "min": 0.3,
                "max": 0.6,
                "crit": {
                    "canCrit": true,
                    "critMulti": 2
                }
            }
        },
        "status": null,
        "req": null
    },
    {
        "name": "Bite",
        "skill": false,
        "passive": false,
        "cooldown": 0,
        "skillPoints": 10,
        "desc": {
            "baseDesc": "Getting a taste before the meal.",
            "critDesc": "2x",
            "atkTooltip": "Basic bite attack",
            "statMods": [
                {
                    "stat": "Strength"
                }
            ],
            "reqs": [
                {
                    "req": "None"
                }
            ]
        },
        "direct": {
            "hit": 50,
            "stat": "strg",
            "dmg": {
                "min": 0.6,
                "max": 0.9,
                "crit": {
                    "canCrit": true,
                    "critMulti": 2
                }
            }
        },
        "status": {},
        "req": {},
        "statMods": [
            {
                "stat": "Strength"
            }
        ],
        "reqs": [
            {
                "req": "None"
            }
        ]
    },
    {
        "name": "Stomp",
        "skill": false,
        "passive": false,
        "cooldown": 1,
        "skillPoints": 10,
        "desc": {
            "baseDesc": "You are large enough to step on your opponent.",
            "critDesc": "2x",
            "atkTooltip": "Paw slam for higher damage",
            "statMods": [
                {
                    "stat": "Strength"
                }
            ],
            "reqs": []
        },
        "direct": {
            "hit": 65,
            "stat": "strg",
            "dmg": {
                "min": 0.6,
                "max": 0.99,
                "crit": {
                    "canCrit": true,
                    "critMulti": 2
                }
            }
        },
        "status": {},
        "req": {},
        "statMods": [
            {
                "stat": "Strength"
            }
        ],
        "reqs": []
    },
    {
        "name": "Pepper Spray",
        "skill": true,
        "passive": false,
        "cooldown": 5,
        "skillPoints": 50,
        "desc": {
            "baseDesc": "Taking some pepper spray, you aim for the eyes to blind your opponent for 3 turns.",
            "critDesc": "No",
            "statMods": [
                {
                    "stat": "None"
                }
            ],
            "reqs": [
                {
                    "req": "None"
                }
            ],
            "atkTooltip": "Blinds enemy for 3 turns"
        },
        "direct": null,
        "status": {
            "hit": 90,
            "type": 1,
            "stat": null,
            "mod": null,
            "dmg": null,
            "duration": 3
        },
        "req": null
    },
    {
        "name": "Improved Paw-Eye Coordination",
        "skill": false,
        "passive": true,
        "cooldown": 0,
        "skillPoints": 10,
        "desc": {
            "baseDesc": "Accuracy improved by 10%",
            "critDesc": "",
            "statMods": [],
            "reqs": []
        },
        "direct": null,
        "status": {
            "hit": 0,
            "type": 0,
            "stat": "",
            "mod": {
                "amt": 10,
                "type": "hit",
                "multi": true,
                "min": false,
                "max": false
            },
            "dmg": null,
            "duration": -1
        },
        "req": null
    }
]