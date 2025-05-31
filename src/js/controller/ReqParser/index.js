import { lex } from './lexer'
import { parse } from './parser'
import { evaluate } from './evaluator'
import { logger } from '@util/Logging'

/**
 * Parses the requirements of an attacker's attack to see if it can be used against the defender.
 * 
 * @param {*} req The requirement from the attack object
 * @param {*} attacker The attacker entity
 * @param {*} defender The defender entity
 * @returns A string representation of a boolean value  or thorws exception
 */
export function parseReq(req, attacker, defender) {
    logger(evaluate(parse(lex(req)), attacker, defender))
    return evaluate(parse(lex(req)), attacker, defender)
}