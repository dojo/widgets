import { create, diffProperty, invalidator, w } from '@dojo/framework/core/vdom';
import { Handle } from '@dojo/framework/core/Destroyable';
import injector from '@dojo/framework/core/middleware/injector';
import cache from '@dojo/framework/core/middleware/cache';
import { SupportedClassName } from '@dojo/framework/core/interfaces';
import Link, { LinkProperties } from '@dojo/framework/routing/Link';
import Router from '@dojo/framework/routing/Router';
import { Params } from '@dojo/framework/routing/interfaces';

export interface ActiveLinkProperties extends LinkProperties {
	activeClasses: SupportedClassName[];
	matchParams?: Params;
}

function paramsEqual(linkParams: any = {}, contextParams: any = {}) {
	return Object.keys(linkParams).every((key) => linkParams[key] === contextParams[key]);
}

const factory = create({ injector, diffProperty, cache, invalidator }).properties<
	ActiveLinkProperties
>();

export const ActiveLink = factory(function ActiveLink({
	middleware: { diffProperty, injector, cache, invalidator },
	properties,
	children
}) {
	const { to, routerKey = 'router', params, matchParams = params } = properties();
	let { activeClasses, classes = [], ...props } = properties();

	diffProperty('to', (current: ActiveLinkProperties, next: ActiveLinkProperties) => {
		if (current.to !== next.to) {
			const router = injector.get<Router>(routerKey);
			const currentHandle = cache.get<Handle>('handle');
			if (currentHandle) {
				currentHandle.destroy();
			}
			if (router) {
				const handle = router.on('outlet', ({ outlet }) => {
					if (outlet.id === to) {
						invalidator();
					}
				});
				cache.set('handle', handle);
			}
			invalidator();
		}
	});

	const router = injector.get<Router>(routerKey);
	if (router) {
		if (!cache.get('handle')) {
			const handle = router.on('outlet', ({ outlet }) => {
				if (outlet.id === to) {
					invalidator();
				}
			});
			cache.set('handle', handle);
		}
		const context = router.getOutlet(to);
		const isActive = context && paramsEqual(matchParams, context.params);

		classes = Array.isArray(classes) ? classes : [classes];
		if (isActive) {
			classes = [...classes, ...activeClasses];
		}
		props = { ...props, classes };
	}
	return w(Link, props, children());
});

export default ActiveLink;
