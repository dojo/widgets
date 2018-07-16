import 'globalize/dist/globalize';
import 'globalize/dist/globalize/number';
import 'globalize/dist/globalize/date';
import 'globalize/dist/globalize/relative-time';
import { globalizeDelegator } from './util/globalize';
export function formatDate(value, optionsOrLocale, locale) {
    return globalizeDelegator('formatDate', {
        locale,
        optionsOrLocale,
        value
    });
}
export function formatRelativeTime(value, unit, optionsOrLocale, locale) {
    return globalizeDelegator('formatRelativeTime', {
        locale,
        optionsOrLocale,
        unit,
        value
    });
}
export function getDateFormatter(optionsOrLocale, locale) {
    return globalizeDelegator('dateFormatter', {
        locale,
        optionsOrLocale
    });
}
export function getDateParser(optionsOrLocale, locale) {
    return globalizeDelegator('dateParser', {
        locale,
        optionsOrLocale
    });
}
export function getRelativeTimeFormatter(unit, optionsOrLocale, locale) {
    return globalizeDelegator('relativeTimeFormatter', {
        locale,
        optionsOrLocale,
        unit
    });
}
export function parseDate(value, optionsOrLocale, locale) {
    return globalizeDelegator('parseDate', {
        locale,
        optionsOrLocale,
        value
    });
}
//# sourceMappingURL=date.mjs.map