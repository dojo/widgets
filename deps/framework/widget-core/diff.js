(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Registry"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Registry_1 = require("./Registry");
    function isObjectOrArray(value) {
        return Object.prototype.toString.call(value) === '[object Object]' || Array.isArray(value);
    }
    function always(previousProperty, newProperty) {
        return {
            changed: true,
            value: newProperty
        };
    }
    exports.always = always;
    function ignore(previousProperty, newProperty) {
        return {
            changed: false,
            value: newProperty
        };
    }
    exports.ignore = ignore;
    function reference(previousProperty, newProperty) {
        return {
            changed: previousProperty !== newProperty,
            value: newProperty
        };
    }
    exports.reference = reference;
    function shallow(previousProperty, newProperty) {
        var changed = false;
        var validOldProperty = previousProperty && isObjectOrArray(previousProperty);
        var validNewProperty = newProperty && isObjectOrArray(newProperty);
        if (!validOldProperty || !validNewProperty) {
            return {
                changed: true,
                value: newProperty
            };
        }
        var previousKeys = Object.keys(previousProperty);
        var newKeys = Object.keys(newProperty);
        if (previousKeys.length !== newKeys.length) {
            changed = true;
        }
        else {
            changed = newKeys.some(function (key) {
                return newProperty[key] !== previousProperty[key];
            });
        }
        return {
            changed: changed,
            value: newProperty
        };
    }
    exports.shallow = shallow;
    function auto(previousProperty, newProperty) {
        var result;
        if (typeof newProperty === 'function') {
            if (newProperty._type === Registry_1.WIDGET_BASE_TYPE) {
                result = reference(previousProperty, newProperty);
            }
            else {
                result = ignore(previousProperty, newProperty);
            }
        }
        else if (isObjectOrArray(newProperty)) {
            result = shallow(previousProperty, newProperty);
        }
        else {
            result = reference(previousProperty, newProperty);
        }
        return result;
    }
    exports.auto = auto;
});
//# sourceMappingURL=diff.js.map