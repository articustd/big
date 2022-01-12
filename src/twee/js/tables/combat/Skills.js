/**
 * Skills
 * 
 * Mod can be a decimal for percentage based skill buff.
 * Mod can be a whole number for whole number addition
 * 
 * Dmg can have a bound from "min","max","min/max"
 */
let skills = [
    {name: 'Improved Paw-Eye', desc: 'Adds 20% to hit accuracy', mod: 1.2, type: 'hit', multi: true, cost: 100},
    {name: 'Power Attacks', desc: 'Adds 2 damage to all attacks', mod: 2, type: 'dmg', min: true, max: true, multi: false, cost: 100},
    {name: 'Willing Prey', desc: 'Enemies have a % chance of instantly submitting', mod: 20, type: 'ability', subType: 'willing', cost: 200},
]