import 'globalize/dist/globalize';
import 'globalize/dist/globalize/number';
import 'globalize/dist/globalize/plural';
import 'globalize/dist/globalize/unit';
import { globalizeDelegator } from './util/globalize';
export function formatUnit(value, unit, optionsOrLocale, locale) {
    return globalizeDelegator('formatUnit', {
        locale,
        optionsOrLocale,
        unit,
        value
    });
}
export function getUnitFormatter(unit, optionsOrLocale, locale) {
    return globalizeDelegator('unitFormatter', {
        locale,
        optionsOrLocale,
        unit
    });
}
//# sourceMappingURL=unit.mjs.map