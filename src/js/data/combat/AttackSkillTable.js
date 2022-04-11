export let attackSkill = [
    // {
    //     "name": "",
    //     "skill": false,
    //     "passive": false,
    //     "cooldown": 0, // Set 0 to have instant refresh
    //     "skillPoints": 10,
    //     "desc": {
    //         "baseDesc": "",
    //         "critDesc": "",
    //         "statMods": [{"stat": ""}],
    //         "reqs": [{"req": ""}],
    //         "attackTooltip": ""
    //     },
    //     "direct": { // Maybe when something is passive or just has a status this could just be null
    //         "hit": 0.75,
    //         "stat": "strg",
    //         "dmg": {
    //             "min": 0.6,
    //             "max": 0.99,
    //             "crit": {
    //                 "canCrit": true,
    //                 "critMulti": 2
    //             }
    //         }
    //     },
    //     "status": { // Maybe when an attack has no status effect this could just be null
    //         "hit": 0,
    //         "type": 0, // Linked to a type table, 0 will be no status
    //         "stat": "strg",
    //         "mod": {
    //             "amt": 1, // How much this mod alters the given type
    //             "type": "hit", // What this mod alters, could be a table later on
    //             "multi": true, // Should be used as a multiplier
    //             "min": true, // Should be added to min damage amount
    //             "max": true // Should be added to max damage amount
    //         },
    //         "dmg": {
    //             "min": 0.6,
    //             "max": 0.99,
    //             "crit": {
    //                 "canCrit": true,
    //                 "critMulti": 2
    //             }
    //         },
    //         "duration": 2 // Number of turns this status will take effect
    //     },
    //     "req": { // Maybe when an attack has no reqs this could just be null
    //         // TBD
    //     }
    // }
    {
        "name": "Scratch",
        "skill": false,
        "passive": false,
        "cooldown": 0,
        "skillPoints": 10,
        "desc": {
            "baseDesc": "You use your claws for a swiping attack",
            "critDesc": "2x",
            "statMods": [{"stat":"Strength"}],
            "reqs": [{"req":"None"}],
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
        "name": "Pepper Spray",
        "skill": true,
        "passive": false,
        "cooldown": 5,
        "skillPoints": 50,
        "desc": {
            "baseDesc": "Taking some pepper spray, you aim for the eyes to blind your opponent for 3 turns.",
            "critDesc": "No",
            "statMods": [{"stat":"None"}],
            "reqs": [{"req":"None"}],
            "atkTooltip": "Blinds enemy for 3 turns",
        },
        "direct": null,
        "status": { // Maybe when an attack has no status effect this could just be null
            "hit": 90,
            "type": 1, // 1:Blind
            "stat": null,
            "mod": null,
            "dmg": null,
            "duration": 3 // Number of turns this status will take effect
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
        "status": { // Maybe when an attack has no status effect this could just be null
            "hit": 0,
            "type": 0, // Linked to a type table, 0 will be no status
            "stat": "",
            "mod": {
                "amt": 10,
                "type": "hit",
                "multi": true,
                "min": false,
                "max": false
            },
            "dmg": null,
            "duration": -1 // Number of turns this status will take effect
        },
        "req": null
    }
]