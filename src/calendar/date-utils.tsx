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
