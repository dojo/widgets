(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./support/has", "./global", "./support/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var has_1 = require("./support/has");
    var global_1 = require("./global");
    var util_1 = require("./support/util");
    exports.Symbol = global_1.default.Symbol;
    if (!has_1.default('es6-symbol')) {
        /**
         * Throws if the value is not a symbol, used internally within the Shim
         * @param  {any}    value The value to check
         * @return {symbol}       Returns the symbol or throws
         */
        var validateSymbol_1 = function validateSymbol(value) {
            if (!isSymbol(value)) {
                throw new TypeError(value + ' is not a symbol');
            }
            return value;
        };
        var defineProperties_1 = Object.defineProperties;
        var defineProperty_1 = Object.defineProperty;
        var create_1 = Object.create;
        var objPrototype_1 = Object.prototype;
        var globalSymbols_1 = {};
        var getSymbolName_1 = (function () {
            var created = create_1(null);
            return function (desc) {
                var postfix = 0;
                var name;
                while (created[String(desc) + (postfix || '')]) {
                    ++postfix;
                }
                desc += String(postfix || '');
                created[desc] = true;
                name = '@@' + desc;
                // FIXME: Temporary guard until the duplicate execution when testing can be
                // pinned down.
                if (!Object.getOwnPropertyDescriptor(objPrototype_1, name)) {
                    defineProperty_1(objPrototype_1, name, {
                        set: function (value) {
                            defineProperty_1(this, name, util_1.getValueDescriptor(value));
                        }
                    });
                }
                return name;
            };
        })();
        var InternalSymbol_1 = function Symbol(description) {
            if (this instanceof InternalSymbol_1) {
                throw new TypeError('TypeError: Symbol is not a constructor');
            }
            return Symbol(description);
        };
        exports.Symbol = global_1.default.Symbol = function Symbol(description) {
            if (this instanceof Symbol) {
                throw new TypeError('TypeError: Symbol is not a constructor');
            }
            var sym = Object.create(InternalSymbol_1.prototype);
            description = description === undefined ? '' : String(description);
            return defineProperties_1(sym, {
                __description__: util_1.getValueDescriptor(description),
                __name__: util_1.getValueDescriptor(getSymbolName_1(description))
            });
        };
        /* Decorate the Symbol function with the appropriate properties */
        defineProperty_1(exports.Symbol, 'for', util_1.getValueDescriptor(function (key) {
            if (globalSymbols_1[key]) {
                return globalSymbols_1[key];
            }
            return (globalSymbols_1[key] = exports.Symbol(String(key)));
        }));
        defineProperties_1(exports.Symbol, {
            keyFor: util_1.getValueDescriptor(function (sym) {
                var key;
                validateSymbol_1(sym);
                for (key in globalSymbols_1) {
                    if (globalSymbols_1[key] === sym) {
                        return key;
                    }
                }
            }),
            hasInstance: util_1.getValueDescriptor(exports.Symbol.for('hasInstance'), false, false),
            isConcatSpreadable: util_1.getValueDescriptor(exports.Symbol.for('isConcatSpreadable'), false, false),
            iterator: util_1.getValueDescriptor(exports.Symbol.for('iterator'), false, false),
            match: util_1.getValueDescriptor(exports.Symbol.for('match'), false, false),
            observable: util_1.getValueDescriptor(exports.Symbol.for('observable'), false, false),
            replace: util_1.getValueDescriptor(exports.Symbol.for('replace'), false, false),
            search: util_1.getValueDescriptor(exports.Symbol.for('search'), false, false),
            species: util_1.getValueDescriptor(exports.Symbol.for('species'), false, false),
            split: util_1.getValueDescriptor(exports.Symbol.for('split'), false, false),
            toPrimitive: util_1.getValueDescriptor(exports.Symbol.for('toPrimitive'), false, false),
            toStringTag: util_1.getValueDescriptor(exports.Symbol.for('toStringTag'), false, false),
            unscopables: util_1.getValueDescriptor(exports.Symbol.for('unscopables'), false, false)
        });
        /* Decorate the InternalSymbol object */
        defineProperties_1(InternalSymbol_1.prototype, {
            constructor: util_1.getValueDescriptor(exports.Symbol),
            toString: util_1.getValueDescriptor(function () {
                return this.__name__;
            }, false, false)
        });
        /* Decorate the Symbol.prototype */
        defineProperties_1(exports.Symbol.prototype, {
            toString: util_1.getValueDescriptor(function () {
                return 'Symbol (' + validateSymbol_1(this).__description__ + ')';
            }),
            valueOf: util_1.getValueDescriptor(function () {
                return validateSymbol_1(this);
            })
        });
        defineProperty_1(exports.Symbol.prototype, exports.Symbol.toPrimitive, util_1.getValueDescriptor(function () {
            return validateSymbol_1(this);
        }));
        defineProperty_1(exports.Symbol.prototype, exports.Symbol.toStringTag, util_1.getValueDescriptor('Symbol', false, false, true));
        defineProperty_1(InternalSymbol_1.prototype, exports.Symbol.toPrimitive, util_1.getValueDescriptor(exports.Symbol.prototype[exports.Symbol.toPrimitive], false, false, true));
        defineProperty_1(InternalSymbol_1.prototype, exports.Symbol.toStringTag, util_1.getValueDescriptor(exports.Symbol.prototype[exports.Symbol.toStringTag], false, false, true));
    }
    /**
     * A custom guard function that determines if an object is a symbol or not
     * @param  {any}       value The value to check to see if it is a symbol or not
     * @return {is symbol}       Returns true if a symbol or not (and narrows the type guard)
     */
    function isSymbol(value) {
        return (value && (typeof value === 'symbol' || value['@@toStringTag'] === 'Symbol')) || false;
    }
    exports.isSymbol = isSymbol;
    /**
     * Fill any missing well known symbols if the native Symbol is missing them
     */
    [
        'hasInstance',
        'isConcatSpreadable',
        'iterator',
        'species',
        'replace',
        'search',
        'split',
        'match',
        'toPrimitive',
        'toStringTag',
        'unscopables',
        'observable'
    ].forEach(function (wellKnown) {
        if (!exports.Symbol[wellKnown]) {
            Object.defineProperty(exports.Symbol, wellKnown, util_1.getValueDescriptor(exports.Symbol.for(wellKnown), false, false));
        }
    });
    exports.default = exports.Symbol;
});
//# sourceMappingURL=Symbol.js.map