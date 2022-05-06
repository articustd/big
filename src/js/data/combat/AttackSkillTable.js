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
        "requirements": {}
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
        "requirements": {}
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
            "reqs": [
                {
                    "req": "Must be 2x taller than oppenent"
                }
            ]
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
        "requirements": {
            "conditions": [
                {
                    "reqCondition": "attackerHeight > (defenderHeight * 2)",
                    "failText": "Not large enough"
                }
            ]
        }
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
        "direct": {},
        "status": {
            "hit": 90,
            "type": 1,
            "stat": "strg",
            "mod": {
                "amt": -1000,
                "type": "hit",
                "multi": false,
                "min": false,
                "max": false
            },
            "dmg": {},
            "duration": 3
        },
        "requirements": {}
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
        "requirements": {}
    },
    {
        "name": "Gouge",
        "skill": true,
        "passive": false,
        "cooldown": 0,
        "skillPoints": 30,
        "desc": {
            "baseDesc": "Strike and cause a deep gash which will continue to bleed for 5 turns",
            "critDesc": "2x",
            "atkTooltip": "Has a chance to cause bleed for 5 turns along with direct damage",
            "statMods": [
                {
                    "stat": "Dexterity"
                }
            ],
            "reqs": [
                {
                    "req": "None"
                }
            ]
        },
        "direct": {
            "hit": 90,
            "stat": "dex",
            "dmg": {
                "min": 0.4,
                "max": 0.6,
                "crit": {
                    "canCrit": true,
                    "critMulti": 2
                }
            }
        },
        "status": {
            "hit": 60,
            "duration": 5,
            "type": 2,
            "stat": "dmg",
            "mod": {},
            "dmg": {
                "min": 5,
                "max": 5,
                "crit": {
                    "canCrit": false,
                    "critMulti": 1
                }
            }
        },
        "requirements": {}
    }
]