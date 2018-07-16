export interface KwArgs {
    dayOfMonth?: number;
    hours?: number;
    milliseconds?: number;
    minutes?: number;
    month: number;
    seconds?: number;
    year: number;
}
export interface OperationKwArgs {
    days?: number;
    hours?: number;
    milliseconds?: number;
    minutes?: number;
    months?: number;
    seconds?: number;
    years?: number;
}
/**
 * The properties of a complete date
 */
export interface DateProperties {
    dayOfMonth: number;
    readonly dayOfWeek: number;
    readonly daysInMonth: number;
    hours: number;
    readonly isLeapYear: boolean;
    milliseconds: number;
    minutes: number;
    month: number;
    seconds: number;
    year: number;
}
export declare class DateObject implements DateProperties {
    static parse(str: string): DateObject;
    static now(): DateObject;
    private readonly _date;
    readonly utc: DateProperties;
    constructor(value: number);
    constructor(value: string);
    constructor(value: Date);
    constructor(value: KwArgs);
    constructor();
    readonly isLeapYear: boolean;
    readonly daysInMonth: number;
    year: number;
    month: number;
    dayOfMonth: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
    time: number;
    readonly dayOfWeek: number;
    readonly timezoneOffset: number;
    add(value: number): DateObject;
    add(value: OperationKwArgs): DateObject;
    compare(value: DateObject): number;
    compareDate(value: KwArgs): number;
    compareTime(value: KwArgs): number;
    toString(): string;
    toDateString(): string;
    toTimeString(): string;
    toLocaleString(): string;
    toLocaleDateString(): string;
    toLocaleTimeString(): string;
    toISOString(): string;
    toJSON(key?: any): string;
    valueOf(): number;
}
export default DateObject;
