import { formatDate, formatRelativeTime, getDateFormatter, getDateParser, getRelativeTimeFormatter, parseDate } from './date';
import i18n, { formatMessage, getCachedMessages, getMessageFormatter, invalidate, setLocaleMessages, switchLocale, systemLocale } from './i18n';
import { formatCurrency, formatNumber, getCurrencyFormatter, getNumberFormatter, getNumberParser, getPluralGenerator, parseNumber, pluralize } from './number';
import { formatUnit, getUnitFormatter } from './unit';
import { generateLocales, normalizeLocale } from './util/main';
import loadCldrData from './cldr/load';
export default i18n;
export { formatCurrency, formatDate, formatMessage, formatNumber, formatRelativeTime, formatUnit, generateLocales, getCachedMessages, getCurrencyFormatter, getDateFormatter, getDateParser, getMessageFormatter, getNumberFormatter, getNumberParser, getPluralGenerator, getRelativeTimeFormatter, getUnitFormatter, invalidate, loadCldrData, normalizeLocale, parseDate, parseNumber, pluralize, setLocaleMessages, switchLocale, systemLocale };
//# sourceMappingURL=main.mjs.map