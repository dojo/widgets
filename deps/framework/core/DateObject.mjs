const days = [NaN, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const isLeapYear = (function () {
    const date = new Date();
    function isLeapYear(year) {
        date.setFullYear(year, 1, 29);
        return date.getDate() === 29;
    }
    return isLeapYear;
})();
const operationOrder = ['years', 'months', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'];
const operationHash = Object.create(null, {
    days: { value: 'Date' },
    hours: { value: 'UTCHours' },
    milliseconds: { value: 'UTCMilliseconds' },
    minutes: { value: 'UTCMinutes' },
    months: { value: 'Month' },
    seconds: { value: 'UTCSeconds' },
    years: { value: 'FullYear' }
});
export class DateObject {
    static parse(str) {
        return new DateObject(Date.parse(str));
    }
    static now() {
        return new DateObject(Date.now());
    }
    constructor(value) {
        let _date;
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
        const self = this;
        this.utc = {
            get isLeapYear() {
                return isLeapYear(this.year);
            },
            get daysInMonth() {
                const month = this.month;
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
    get isLeapYear() {
        return isLeapYear(this.year);
    }
    get daysInMonth() {
        const month = this.month;
        if (month === 2 && this.isLeapYear) {
            return 29;
        }
        return days[month];
    }
    get year() {
        return this._date.getFullYear();
    }
    set year(year) {
        const dayOfMonth = this.dayOfMonth;
        this._date.setFullYear(year);
        if (this.dayOfMonth < dayOfMonth) {
            this.dayOfMonth = 0;
        }
    }
    get month() {
        return this._date.getMonth() + 1;
    }
    set month(month) {
        const dayOfMonth = this.dayOfMonth;
        this._date.setMonth(month - 1);
        if (this.dayOfMonth < dayOfMonth) {
            this.dayOfMonth = 0;
        }
    }
    get dayOfMonth() {
        return this._date.getDate();
    }
    set dayOfMonth(day) {
        this._date.setDate(day);
    }
    get hours() {
        return this._date.getHours();
    }
    set hours(hours) {
        this._date.setHours(hours);
    }
    get minutes() {
        return this._date.getMinutes();
    }
    set minutes(minutes) {
        this._date.setMinutes(minutes);
    }
    get seconds() {
        return this._date.getSeconds();
    }
    set seconds(seconds) {
        this._date.setSeconds(seconds);
    }
    get milliseconds() {
        return this._date.getMilliseconds();
    }
    set milliseconds(milliseconds) {
        this._date.setMilliseconds(milliseconds);
    }
    get time() {
        return this._date.getTime();
    }
    set time(time) {
        this._date.setTime(time);
    }
    get dayOfWeek() {
        return this._date.getDay();
    }
    get timezoneOffset() {
        return this._date.getTimezoneOffset();
    }
    add(value) {
        const result = new DateObject(this.time);
        if (typeof value === 'number') {
            result.time += value;
        }
        else {
            // Properties have to be added in a particular order to properly handle
            // date overshoots in month and year calculations
            operationOrder.forEach((property) => {
                if (!(property in value)) {
                    return;
                }
                const dateMethod = operationHash[property];
                result._date[`set${dateMethod}`](this._date[`get${dateMethod}`]() + value[property]);
                if ((property === 'years' || property === 'months') && result.dayOfMonth < this.dayOfMonth) {
                    // Set the day of the month to 0 to move the date to the first day of the previous
                    // month to fix overshoots when adding a month and the date is the 31st or adding
                    // a year and the date is the 29th
                    result.dayOfMonth = 0;
                }
            });
        }
        return result;
    }
    compare(value) {
        const result = this.time - value.time;
        if (result > 0) {
            return 1;
        }
        if (result < 0) {
            return -1;
        }
        return 0;
    }
    compareDate(value) {
        const left = new DateObject(this);
        const right = new DateObject(value);
        left._date.setHours(0, 0, 0, 0);
        right._date.setHours(0, 0, 0, 0);
        return left.compare(right);
    }
    compareTime(value) {
        const left = new DateObject(this);
        const right = new DateObject(value);
        left._date.setFullYear(0, 0, 0);
        right._date.setFullYear(0, 0, 0);
        return left.compare(right);
    }
    toString() {
        return this._date.toString();
    }
    toDateString() {
        return this._date.toDateString();
    }
    toTimeString() {
        return this._date.toTimeString();
    }
    toLocaleString() {
        return this._date.toLocaleString();
    }
    toLocaleDateString() {
        return this._date.toLocaleDateString();
    }
    toLocaleTimeString() {
        return this._date.toLocaleTimeString();
    }
    toISOString() {
        return this._date.toISOString();
    }
    toJSON(key) {
        return this._date.toJSON(key);
    }
    valueOf() {
        return this._date.valueOf();
    }
}
export default DateObject;
//# sourceMappingURL=DateObject.mjs.map