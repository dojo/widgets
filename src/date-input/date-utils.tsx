import { padStart } from '@dojo/framework/shim/string';

const components = {
	day: '(\\d{1,2})',
	month: '(\\d{1,2})',
	year: '(\\d{4})'
};

const dateExpressions = () => {
	const tokens: [RegExp, { month: number; day: number; year: number }][] = [
		[
			// standard 'YYYY-mm-dd' format
			new RegExp(`^${components.year}-${components.month}-${components.day}$`),
			{ month: 2, day: 3, year: 1 }
		]
	];

	const usCanary = Intl.DateTimeFormat().format(new Date(2018, 3, 3)); // April 3
	switch (usCanary) {
		case '4/3/2018':
		case '04/03/2018':
			// US-only 'mm/dd/yyyy' format
			tokens.push([
				new RegExp(`^${components.month}\/${components.day}\/${components.year}$`),
				{ month: 1, day: 2, year: 3 }
			]);
			break;
		case '3/4/2018':
		case '03/04/2018':
			// standard 'dd/mm/yyyy' format
			tokens.push([
				new RegExp(`^${components.day}\/${components.month}\/${components.year}$`),
				{ month: 2, day: 1, year: 3 }
			]);
			break;
		case '3.4.2018':
		case '03.04.2018':
			// standard 'dd.mm.yyyy' format
			tokens.push([
				new RegExp(`^${components.day}\\.${components.month}\\.${components.year}$`),
				{ month: 2, day: 1, year: 3 }
			]);
			break;
		case '3-4-2018':
		case '03-04-2018':
			// standard 'dd.mm.yyyy' format
			tokens.push([
				new RegExp(`^${components.day}\-${components.month}\-${components.year}$`),
				{ month: 2, day: 1, year: 3 }
			]);
			break;
		case '2018/4/3':
		case '2018/04/03':
			// standard 'yyyy/mm/dd' format
			tokens.push([
				new RegExp(`^${components.year}\/${components.month}\/${components.day}$`),
				{ month: 2, day: 3, year: 1 }
			]);
			break;
	}

	return tokens;
};

export function parseDate(value?: string): Date | undefined {
	if (!value) {
		return undefined;
	}

	for (let [exp, order] of dateExpressions()) {
		const match = value.match(exp);

		if (match !== null) {
			return new Date(
				parseInt(match[order.year], 10),
				parseInt(match[order.month], 10) - 1,
				parseInt(match[order.day], 10)
			);
		}
	}

	return undefined;
}

export function formatDateISO(date: Date | undefined) {
	if (!date) {
		return '';
	}

	const year = date.getFullYear();
	const month = padStart((date.getMonth() + 1).toString(), 2, '0');
	const day = padStart(date.getDate().toString(), 2, '0');

	return `${year}-${month}-${day}`;
}

export function formatDate(date: Date) {
	const formattedDate = Intl.DateTimeFormat().format(date);
	// Check if is a supported date format
	const parsedDate = parseDate(formattedDate);
	if (parsedDate && parsedDate.valueOf() === date.valueOf()) {
		return formattedDate;
	}
	return formatDateISO(date);
}
