import { lex } from './lexer'
import { parse } from './parser'
import { evaluate } from './evaluator'
import { logger } from '@js/controllers/util/Logging'

export function parseReq(req, attacker, defender) {
    // logger(evaluate(parse(lex(req)), attacker, defender))
    return evaluate(parse(lex(req)), attacker, defender)
}