(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var days = [NaN, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var isLeapYear = (function () {
        var date = new Date();
        function isLeapYear(year) {
            date.setFullYear(year, 1, 29);
            return date.getDate() === 29;
        }
        return isLeapYear;
    })();
    var operationOrder = ['years', 'months', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'];
    var operationHash = Object.create(null, {
        days: { value: 'Date' },
        hours: { value: 'UTCHours' },
        milliseconds: { value: 'UTCMilliseconds' },
        minutes: { value: 'UTCMinutes' },
        months: { value: 'Month' },
        seconds: { value: 'UTCSeconds' },
        years: { value: 'FullYear' }
    });
    var DateObject = /** @class */ (function () {
        function DateObject(value) {
            var _date;
            if (!arguments.length) {
                _date = new Date();
            }
            else if (value instanceof Date) {
                _date = new Date(+value);
            }
            else if (typeof value === 'number' || typeof value === 'string') {
                _date = new Date(value);
            }
            else {
                _date = new Date(value.year, value.month - 1, value.dayOfMonth || 1, value.hours || 0, value.minutes || 0, value.seconds || 0, value.milliseconds || 0);
            }
            this._date = _date;
            var self = this;
            this.utc = {
                get isLeapYear() {
                    return isLeapYear(this.year);
                },
                get daysInMonth() {
                    var month = this.month;
                    if (month === 2 && this.isLeapYear) {
                        return 29;
                    }
                    return days[month];
                },
                get year() {
                    return self._date.getUTCFullYear();
                },
                set year(year) {
                    self._date.setUTCFullYear(year);
                },
                get month() {
                    return self._date.getUTCMonth() + 1;
                },
                set month(month) {
                    self._date.setUTCMonth(month - 1);
                },
                get dayOfMonth() {
                    return self._date.getUTCDate();
                },
                set dayOfMonth(day) {
                    self._date.setUTCDate(day);
                },
                get hours() {
                    return self._date.getUTCHours();
                },
                set hours(hours) {
                    self._date.setUTCHours(hours);
                },
                get minutes() {
                    return self._date.getUTCMinutes();
                },
                set minutes(minutes) {
                    self._date.setUTCMinutes(minutes);
                },
                get seconds() {
                    return self._date.getUTCSeconds();
                },
                set seconds(seconds) {
                    self._date.setUTCSeconds(seconds);
                },
                get milliseconds() {
                    return self._date.getUTCMilliseconds();
                },
                set milliseconds(milliseconds) {
                    self._date.setUTCMilliseconds(milliseconds);
                },
                get dayOfWeek() {
                    return self._date.getUTCDay();
                },
                toString: function () {
                    return self._date.toUTCString();
                }
            };
        }
        DateObject.parse = function (str) {
            return new DateObject(Date.parse(str));
        };
        DateObject.now = function () {
            return new DateObject(Date.now());
        };
        Object.defineProperty(DateObject.prototype, "isLeapYear", {
            get: function () {
                return isLeapYear(this.year);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateObject.prototype, "daysInMonth", {
            get: function () {
                var month = this.month;
                if (month === 2 && this.isLeapYear) {
                    return 29;
                }
                return days[month];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateObject.prototype, "year", {
            get: function () {
                return this._date.getFullYear();
            },
            set: function (year) {
                var dayOfMonth = this.dayOfMonth;
                this._date.setFullYear(year);
                if (this.dayOfMonth < dayOfMonth) {
                    this.dayOfMonth = 0;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateObject.prototype, "month", {
            get: function () {
                return this._date.getMonth() + 1;
            },
            set: function (month) {
                var dayOfMonth = this.dayOfMonth;
                this._date.setMonth(month - 1);
                if (this.dayOfMonth < dayOfMonth) {
                    this.dayOfMonth = 0;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateObject.prototype, "dayOfMonth", {
            get: function () {
                return this._date.getDate();
            },
            set: function (day) {
                this._date.setDate(day);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateObject.prototype, "hours", {
            get: function () {
                return this._date.getHours();
            },
            set: function (hours) {
                this._date.setHours(hours);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateObject.prototype, "minutes", {
            get: function () {
                return this._date.getMinutes();
            },
            set: function (minutes) {
                this._date.setMinutes(minutes);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateObject.prototype, "seconds", {
            get: function () {
                return this._date.getSeconds();
            },
            set: function (seconds) {
                this._date.setSeconds(seconds);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateObject.prototype, "milliseconds", {
            get: function () {
                return this._date.getMilliseconds();
            },
            set: function (milliseconds) {
                this._date.setMilliseconds(milliseconds);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateObject.prototype, "time", {
            get: function () {
                return this._date.getTime();
            },
            set: function (time) {
                this._date.setTime(time);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateObject.prototype, "dayOfWeek", {
            get: function () {
                return this._date.getDay();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateObject.prototype, "timezoneOffset", {
            get: function () {
                return this._date.getTimezoneOffset();
            },
            enumerable: true,
            configurable: true
        });
        DateObject.prototype.add = function (value) {
            var _this = this;
            var result = new DateObject(this.time);
            if (typeof value === 'number') {
                result.time += value;
            }
            else {
                // Properties have to be added in a particular order to properly handle
                // date overshoots in month and year calculations
                operationOrder.forEach(function (property) {
                    if (!(property in value)) {
                        return;
                    }
                    var dateMethod = operationHash[property];
                    result._date["set" + dateMethod](_this._date["get" + dateMethod]() + value[property]);
                    if ((property === 'years' || property === 'months') && result.dayOfMonth < _this.dayOfMonth) {
                        // Set the day of the month to 0 to move the date to the first day of the previous
                        // month to fix overshoots when adding a month and the date is the 31st or adding
                        // a year and the date is the 29th
                        result.dayOfMonth = 0;
                    }
                });
            }
            return result;
        };
        DateObject.prototype.compare = function (value) {
            var result = this.time - value.time;
            if (result > 0) {
                return 1;
            }
            if (result < 0) {
                return -1;
            }
            return 0;
        };
        DateObject.prototype.compareDate = function (value) {
            var left = new DateObject(this);
            var right = new DateObject(value);
            left._date.setHours(0, 0, 0, 0);
            right._date.setHours(0, 0, 0, 0);
            return left.compare(right);
        };
        DateObject.prototype.compareTime = function (value) {
            var left = new DateObject(this);
            var right = new DateObject(value);
            left._date.setFullYear(0, 0, 0);
            right._date.setFullYear(0, 0, 0);
            return left.compare(right);
        };
        DateObject.prototype.toString = function () {
            return this._date.toString();
        };
        DateObject.prototype.toDateString = function () {
            return this._date.toDateString();
        };
        DateObject.prototype.toTimeString = function () {
            return this._date.toTimeString();
        };
        DateObject.prototype.toLocaleString = function () {
            return this._date.toLocaleString();
        };
        DateObject.prototype.toLocaleDateString = function () {
            return this._date.toLocaleDateString();
        };
        DateObject.prototype.toLocaleTimeString = function () {
            return this._date.toLocaleTimeString();
        };
        DateObject.prototype.toISOString = function () {
            return this._date.toISOString();
        };
        DateObject.prototype.toJSON = function (key) {
            return this._date.toJSON(key);
        };
        DateObject.prototype.valueOf = function () {
            return this._date.valueOf();
        };
        return DateObject;
    }());
    exports.DateObject = DateObject;
    exports.default = DateObject;
});
//# sourceMappingURL=DateObject.js.map