import {
	createMemoryResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';
import { create, isWNode } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';

const resource = createResourceMiddleware();

export interface ResourceProperties {
	/** The resource template for children of this widget */
	template?: any;
	/** The resource initOptions for children of this widget */
	initOptions?: any;
}

const factory = create({ resource, icache }).properties<ResourceProperties>();

export const Resource = factory(function Resource({
	id,
	properties,
	children,
	middleware: { resource, icache }
}) {
	let { template, initOptions } = properties();
	if (template !== icache.get('template') || initOptions !== icache.get('initOptions')) {
		template = icache.set('template', template || createMemoryResourceTemplate());
		initOptions = icache.set('initOptions', initOptions || { id, data: [] });
		const resourceProp = resource({
			template,
			initOptions,
			options: resource.createOptions(id)
		});
		icache.set('resource', resourceProp);
	}

	return children().map((child) => {
		if (child && isWNode(child) && child.properties.resource !== icache.get('resource')) {
			child.properties = { ...child.properties, resource: icache.get('resource') };
		}
		return child;
	});
});

export default Resource;
