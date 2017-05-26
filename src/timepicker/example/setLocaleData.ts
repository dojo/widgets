import loadCldrData, { CldrData } from '@dojo/i18n/cldr/load';
import { switchLocale } from '@dojo/i18n/i18n';

// The following is the minimum CLDR data required to render 12-hour time in English.
const cldrData: CldrData = {
	supplemental: {
		likelySubtags: { en: 'en-Latn-US' }
	},
	main: {
		en: {
			numbers: {
				defaultNumberingSystem: 'latn',
				'symbols-numberSystem-latn': {
					decimal: '.',
					group: ',',
					percentSign: '%',
					plusSign: '+',
					minusSign: '-',
					exponential: 'E',
					perMille: '‰',
					infinity: '∞',
					nan: 'NaN',
					timeSeparator: ':'
				}
			},
			dates: {
				calendars: {
					gregorian: {
						dayPeriods: {
							format: {
								wide: {
									am: 'AM',
									pm: 'PM'
								}
							}
						},
						timeFormats: {
							short: 'h:mm a'
						}
					}
				}
			}
		}
	}
};

export default function setLocaleData() {
	loadCldrData(cldrData);
	switchLocale('en');
}
