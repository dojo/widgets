export function monthInMin(year: number, month: number, minDate?: Date) {
	if (minDate) {
		return new Date(year, month, 1) >= new Date(minDate.getFullYear(), minDate.getMonth(), 1);
	}
	return true;
}

export function monthInMax(year: number, month: number, maxDate?: Date) {
	if (maxDate) {
		const thisMonth = new Date(year, month, 1);
		const max = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
		return thisMonth <= max;
	}
	return true;
}

function stripTime(date: Date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isOutOfDateRange(dateObj: Date, min?: Date, max?: Date) {
	return Boolean((min && dateObj < stripTime(min)) || (max && stripTime(dateObj) > max));
}

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
	if (usCanary === '4/3/2018') {
		// US-only 'mm/dd/yyyy' format
		tokens.push([
			new RegExp(`^${components.month}\/${components.day}\/${components.year}$`),
			{ month: 1, day: 2, year: 3 }
		]);
	} else {
		// standard 'dd/mm/yyyy' format
		tokens.push([
			new RegExp(`^${components.day}\/${components.month}\/${components.year}$`),
			{ month: 2, day: 1, year: 3 }
		]);
	}

	return tokens;
};

export function parseDate(value: string): Date | undefined {
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
