import { LocaleLoaders, Bundle } from '@dojo/i18n/i18n';

const locales: LocaleLoaders<typeof messages> = {};

const messages = {
	sunShort: 'Sun',
	monShort: 'Mon',
	tueShort: 'Tue',
	wedShort: 'Wed',
	thuShort: 'Thu',
	friShort: 'Fri',
	satShort: 'Sat',
	sunday: 'Sunday',
	monday: 'Monday',
	tuesday: 'Tuesday',
	wednesday: 'Wednesday',
	thursday: 'Thursday',
	friday: 'Friday',
	saturday: 'Saturday',
	janShort: 'Jan',
	febShort: 'Feb',
	marShort: 'Mar',
	aprShort: 'Apr',
	mayShort: 'May',
	junShort: 'Jun',
	julShort: 'Jul',
	augShort: 'Aug',
	sepShort: 'Sep',
	octShort: 'Oct',
	novShort: 'Nov',
	decShort: 'Dec',
	january: 'January',
	february: 'February',
	march: 'March',
	april: 'April',
	may: 'May',
	june: 'June',
	july: 'July',
	august: 'August',
	september: 'September',
	october: 'October',
	november: 'November',
	december: 'December',
	clear: 'clear',
	close: 'close',
	open: 'open'
};

const bundle: Bundle<typeof messages> = { locales, messages };

export default bundle;
