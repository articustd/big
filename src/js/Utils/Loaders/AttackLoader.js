import Attacks from '@js/Data/Attacks.json'
import { logger } from '@Utils/Logging'
import { Attack } from '@GameObjects/Attack'

export function LoadAttacksFromData() {
    variables().attacks = []
    
    _.each(Attacks, (AttackData)=>{
        variables().attacks.push(new Attack(AttackData))
    })
}