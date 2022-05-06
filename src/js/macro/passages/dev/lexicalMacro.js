import { logger } from "@util/Logging"
import { parseReq } from "@controller/ReqParser"

Macro.add('lexicalMacro', {
    skipArgs: false,
    handler: function () {
        parseReq("attackerHeight > (defenderHeight * 2)", variables().enemy, variables().player)
    }
})



