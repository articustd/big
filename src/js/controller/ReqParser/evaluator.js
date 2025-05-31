import { logger } from "@util/Logging";

/**
 * Evaluates the given parse tree (attack requirements). 
 * 
 * @param {String} parseTree Attack Requirements string to parse
 * @param {Object} attacker Attacker entity
 * @param {Object} defender Defender entity
 * @returns Either string boolean or throws an exception
 */
export function evaluate(parseTree, attacker, defender) {
    var args = {};

    var vars = {
        pi: Math.PI,
        e: Math.E,
        attackerHeight: attacker.measurements.height,
        defenderHeight: defender.measurements.height,
    };

    /**
     * Parses both left and right side of a string equation. Will work through the provided node tree of the parsed node types.
     * Checks left and right sides of the equation to do a final comparison or math of the string equation.
     * 
     * @param {*} node Parsed node of the tree
     * @returns Either another node or the evaluation of nodes
     */
    function parseNode(node) {
        if (node.type === "number") return node.value
        else if (operators[node.type]) {
            if (node.left) return operators[node.type](parseNode(node.left), parseNode(node.right))
            return operators[node.type](parseNode(node.right))
        }
        else if (node.type === "identifier") {
            let value = args.hasOwnProperty(node.value) ? args[node.value] : vars[node.value]
            if (typeof value === "undefined") throw node.value + " is undefined"
            return value
        }
        else if (node.type === 'assign') {
            vars[node.name] = parseNode(node.value)
        }
        else if (node.type === "call") {
            for (let i = 0; i < node.args.length; i++) node.args[i] = parseNode(node.args[i]);
            return functions[node.name].apply(null, node.args);
        }
        else if (node.type === "function") {
            functions[node.name] = function () {
                for (let i = 0; i < node.args.length; i++) {
                    args[node.args[i].value] = arguments[i];
                }
                let ret = parseNode(node.value);
                args = {};
                return ret;
            };
        }
    }
    let output = ""
    for (let i = 0; i < parseTree.length; i++) {
        let value = parseNode(parseTree[i])
        if (typeof value !== "undefined") output += value
    }
    return output
}

/**
 * Operators parsed out of nodes to do the requisite math
 */
var operators = {
    "+": function (a, b) {
        return a + b;
    },
    "-": function (a, b) {
        if (typeof b === "undefined") return -a;
        return a - b;
    },
    "*": function (a, b) {
        return a * b;
    },
    "/": function (a, b) {
        return a / b;
    },
    "%": function (a, b) {
        return a % b;
    },
    "^": function (a, b) {
        return Math.pow(a, b);
    },
    ">": function (a, b) {
        return a > b
    },
    "<": function (a, b) {
        return a < b
    }
};

/**
 * Functions parsed out of nodes to do the requisite math
 */
var functions = {
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.cos,
    asin: Math.asin,
    acos: Math.acos,
    atan: Math.atan,
    abs: Math.abs,
    round: Math.round,
    ceil: Math.ceil,
    floor: Math.floor,
    log: Math.log,
    exp: Math.exp,
    sqrt: Math.sqrt,
    max: Math.max,
    min: Math.min,
    random: Math.random
};
