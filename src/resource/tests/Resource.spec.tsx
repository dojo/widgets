const { describe, it } = intern.getInterface('bdd');
import { tsx } from '@dojo/framework/core/vdom';
import { renderer, assertion, wrap, compare } from '@dojo/framework/testing/renderer';
import { createMemoryResourceTemplate } from '@dojo/framework/core/middleware/resources';
import { noop } from '../../common/tests/support/test-helpers';
import Resource from '../index';
import List from '../../list';

describe('resource', () => {
	const WrappedList = wrap(List as any);

	it('passes an undefined resource prop to children if no props are provided', () => {
		const ResourceLessList = List as any;
		const r = renderer(() => (
			<Resource>
				<ResourceLessList onValue={noop} />
			</Resource>
		));

		r.expect(assertion(() => <ResourceLessList onValue={noop} />));
	});

	it('passes a resource with the specified values if they are provided', () => {
		const ResourceLessList = List as any;
		const template = createMemoryResourceTemplate();
		const initOptions = { id: 'foo', data: [] };
		const r = renderer(() => (
			<Resource template={template} initOptions={initOptions}>
				<ResourceLessList onValue={noop} />
			</Resource>
		));

		r.expect(
			assertion(() => (
				<WrappedList
					onValue={noop}
					resource={compare((actual: any) => {
						return (
							typeof actual.template.id === 'string' &&
							actual.template.template === template
						);
						actual.template.initOptions === initOptions &&
							typeof actual.options === 'function';
					})}
				/>
			))
		);
	});
});
