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
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date
		.getDate()
		.toString()
		.padStart(2, '0');

	return `${year}-${month}-${day}`;
}

export function formatDate(date: Date) {
	return Intl.DateTimeFormat().format(date);
}
