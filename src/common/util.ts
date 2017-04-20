import Observable, { Observer, Subscription } from '@dojo/shim/Observable';

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

export const observeViewport = (function () {
	let viewportSource: Observable<number>;

	return function (observer: Observer<number>): Subscription {
		if (!viewportSource) {
			viewportSource = new Observable((observer) => {
				const listener = function () {
					observer.next(document.body.offsetWidth);
				};
				window.addEventListener('resize', listener);
				return function () {
					window.removeEventListener('resize', listener);
				};
			});
		}

		return viewportSource.subscribe(observer);
	};
})();
