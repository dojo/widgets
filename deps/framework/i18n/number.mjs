import 'globalize/dist/globalize';
import 'globalize/dist/globalize/number';
import 'globalize/dist/globalize/plural';
import 'globalize/dist/globalize/currency';
import { globalizeDelegator } from './util/globalize';
export function formatCurrency(value, currency, optionsOrLocale, locale) {
    return globalizeDelegator('formatCurrency', {
        locale,
        optionsOrLocale,
        unit: currency,
        value
    });
}
export function formatNumber(value, optionsOrLocale, locale) {
    return globalizeDelegator('formatNumber', {
        locale,
        optionsOrLocale,
        value
    });
}
export function getCurrencyFormatter(currency, optionsOrLocale, locale) {
    return globalizeDelegator('currencyFormatter', {
        locale,
        optionsOrLocale,
        unit: currency
    });
}
export function getNumberFormatter(optionsOrLocale, locale) {
    return globalizeDelegator('numberFormatter', {
        locale,
        optionsOrLocale
    });
}
export function getNumberParser(optionsOrLocale, locale) {
    return globalizeDelegator('numberParser', {
        locale,
        optionsOrLocale
    });
}
export function getPluralGenerator(optionsOrLocale, locale) {
    return globalizeDelegator('pluralGenerator', {
        locale,
        optionsOrLocale
    });
}
export function parseNumber(value, optionsOrLocale, locale) {
    return globalizeDelegator('parseNumber', {
        locale,
        optionsOrLocale,
        value
    });
}
export function pluralize(value, optionsOrLocale, locale) {
    return globalizeDelegator('plural', {
        locale,
        optionsOrLocale,
        value
    });
}
//# sourceMappingURL=number.mjs.map