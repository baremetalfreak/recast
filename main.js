var fs = require("fs");
var normalizeOptions = require("./lib/options").normalize;
var types = require("./lib/types");
var Parser = require("./lib/parser").Parser;
var Printer = require("./lib/printer").Printer;

function parse(code, options) {
    return new Parser(code, options).getAst();
}

function print(node, options) {
    return new Printer(options)
        .print(node, true)
        .toString(options);
}

function run(transformer, options) {
    return runFile(process.argv[2], transformer, options);
}

function runFile(path, transformer, options) {
    fs.readFile(path, "utf-8", function(err, code) {
        if (err) {
            console.error(err);
            return;
        }

        runString(code, transformer, options);
    });
}

function runString(code, transformer, options) {
    options = normalizeOptions(options);
    transformer(parse(code, options), function(node) {
        options.writeback(print(node, options));
    });
}

Object.defineProperties(exports, {
    /**
     * Scriptable interface to recast.
     */
    run: {
        enumerable: true,
        value: run
    },

    runFile: {
        enumerable: true,
        value: runFile
    },

    runString: {
        enumerable: true,
        value: runString
    },

    /**
     * Useful utilities for implementing transformer functions.
     */
    Syntax: {
        enumerable: true,
        value: types.Syntax,
    },

    Visitor: {
        enumerable: true,
        value: require("./lib/visitor").Visitor
    },

    builder: { // Legacy singular form.
        enumerable: false,
        value: types.builders
    },

    builders: { // Plural preferred.
        enumerable: true,
        value: types.builders
    },

    namedTypes: {
        enumerable: true,
        value: types.namedTypes
    },

    /**
     * Direct access to the parsing and printing interfaces.
     */
    parse: {
        enumerable: true,
        value: parse
    },

    print: {
        enumerable: true,
        value: print
    }
});
