export const enum Keys {
	Down = 40,
	End = 35,
	Enter = 13,
	Escape = 27,
	Home = 36,
	Left = 37,
	PageDown = 34,
	PageUp = 33,
	Right = 39,
	Space = 32,
	Tab = 9,
	Up = 38
}

export function formatAriaProperties(aria: { [key: string]: string }): { [key: string]: string } {
	const formattedAria: { [key: string]: string } = {};
	Object.keys(aria).forEach((key: string) => {
		formattedAria[`aria-${key.toLowerCase()}`] = aria[key];
	});
	return formattedAria;
}
