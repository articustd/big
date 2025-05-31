/**
 * Lexer to read through the provided input and break down tokens into numbers, identifiers, operators, or end tokens.
 * 
 * @param {String} input Input string to break down into tokens
 * @param {Array<JSON>} tokens An array of token objects
 * @param {*} c The current stored value of the token
 * @param {Number} i Current position in the input
 * @returns {Array<JSON>} An array of token objects
 */
export function lex(input, tokens = [], c = '', i = 0) {
    /**
     * Advances to the next character in the input string.
     * @returns Next character in the string input
     */
    let advance = function () { return c = input[++i] }

    /**
     * Addes the specified token type and value to the tokens array.
     * @param {String} type Token type (number, identifier, operator, or end token)
     * @param {*} value The value of the token type if type is number or identifier
     */
    let addToken = function (type, value) {
        tokens.push({
            type,
            value
        })
    }

    while(i < input.length) {
        c = input[i]
        if (isWhiteSpace(c)) advance()
        else if (isOperator(c)) {
            addToken(c)
            advance()
        }
        else if (isDigit(c)) {
            let num = c
            while (isDigit(advance())) num += c
            if (c === ".") {
                do num += c; while (isDigit(advance()))
            }
            num = parseFloat(num)
            if (!isFinite(num)) throw "Number exceeds 64-bit double bounds."
            addToken("number", num)
        }
        else if (isIdentifier(c)) {
            let idn = c
            while (isIdentifier(advance())) idn += c
            addToken("identifier", idn)
        }
        else throw "Unrecognized token."
    }

    addToken("(end)")
    return tokens
}

function isOperator(c) { return /[+\-*\/\^%=(),><]/.test(c) }
function isDigit(c) { return /[0-9]/.test(c) }
function isWhiteSpace(c) { return /\s/.test(c) }
function isIdentifier(c) { return typeof c === 'string' && !isOperator(c) && !isDigit(c) && !isWhiteSpace(c) }