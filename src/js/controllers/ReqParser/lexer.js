export function lex(input, tokens = [], c = '', i = 0) {
    let advance = function () { return c = input[++i] }
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
            if (!isFinite(num)) throw "Number is exceeds 64-bit double bounds."
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