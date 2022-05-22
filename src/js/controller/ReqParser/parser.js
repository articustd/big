import { logger } from "@util/Logging"

export function parse(tokens, parseTree = []) {
    let symbols = {}
    
    function symbol(id, nud, ldp, led) {
        var sym = symbols[id] || {}
        symbols[id] = {
            ldp: sym.ldp || ldp,
            nud: sym.nud || nud,
            led: sym.led || led
        }
    }

    function interpretToken(token) {
        let sym = Object.create(symbols[token.type])
        sym.type = token.type
        sym.value = token.value
        return sym
    }

    var i = 0
    function token() { return interpretToken(tokens[i]) }
    function advance() { i++; return token() }

    function expression(rdp) {
        let left, t = token()
        advance()
        if (!t.nud) throw "Unexpected token: " + t.type
        left = t.nud(t)
        while (rdp < token().ldp) {
            t = token()
            advance()
            if (!t.led) throw "Unexpected token: " + t.type
            left = t.led(left)
        }
        return left
    }

    function infix(id, lbp, rbp, led) {
        rbp = rbp || lbp;
        symbol(id, null, lbp, led || function (left) {
            return {
                type: id,
                left: left,
                right: expression(rbp)
            };
        });
    }

    function prefix(id, rbp) {
        symbol(id, function () {
            return {
                type: id,
                right: expression(rbp)
            };
        });
    };

    prefix("-", 7);
    infix("^", 6, 5);
    infix("*", 4);
    infix("/", 4);
    infix("%", 4);
    infix("+", 3);
    infix("-", 3);
    infix(">", 2);
    infix("<", 2);

    symbol(",");
    symbol(")");
    symbol("(end)");

    symbol("(", function () {
        let value = expression(2);
        if (token().type !== ")") throw "Expected closing parenthesis ')'";
        advance();
        return value;
    });
    symbol("number", function (number) {
        return number;
    });

    symbol("identifier", function (name) {
        if (token().type === "(") {
            let args = [];
            if (tokens[i + 1].type === ")") advance();
            else {
                do {
                    advance();
                    args.push(expression(2));
                } while (token().type === ",");
                if (token().type !== ")") throw "Expected closing parenthesis ')'";
            }
            advance();
            return {
                type: "call",
                args: args,
                name: name.value
            };
        }
        return name;
    })
    infix("=", 1, 2, function (left) {
        if (left.type === "call") {
            for (let j = 0; j < left.args.length; j++) {
                if (left.args[j].type !== "identifier") throw "Invalid argument name";
            }
            return {
                type: "function",
                name: left.name,
                args: left.args,
                value: expression(2)
            };
        } else if (left.type === "identifier") {
            return {
                type: "assign",
                name: left.value,
                value: expression(2)
            };
        }
        else throw "Invalid lvalue";
    })

    while (token().type !== "(end)") {
        parseTree.push(expression(0))
    }

    return parseTree
}