const { describe, it } = intern.getInterface('bdd');
import { tsx } from '@dojo/framework/core/vdom';
import renderer, { assertion, wrap } from '@dojo/framework/testing/renderer';
import Icon from '../../index';
import * as css from '../../../theme/default/icon.m.css';

describe('Icon', () => {
	const WrappedINode = wrap('i');

	const baseAssertion = assertion(() => (
		<WrappedINode
			classes={[undefined, css.root, css.icon, css.starIcon, undefined]}
			role="img"
			aria-hidden="true"
			aria-label={undefined}
		/>
	));

	it('renders', () => {
		const r = renderer(() => <Icon type="starIcon" />);

		r.expect(baseAssertion);
	});

	it('accepts a size', () => {
		const r = renderer(() => <Icon type="starIcon" size="large" />);

		const sizeAssertion = baseAssertion.setProperty(WrappedINode, 'classes', [
			undefined,
			css.root,
			css.icon,
			css.starIcon,
			css.large
		]);

		r.expect(sizeAssertion);
	});

	it('accepts alt text', () => {
		const r = renderer(() => <Icon type="starIcon" altText="hello world" />);

		const altTextAssertion = baseAssertion
			.setProperty(WrappedINode, 'aria-hidden', 'false')
			.setProperty(WrappedINode, 'aria-label', 'hello world');

		r.expect(altTextAssertion);
	});

	it('accepts aria properties', () => {
		const r = renderer(() => <Icon type="starIcon" aria={{ foo: 'bar' }} />);

		const ariaAssertion = baseAssertion.setProperty(WrappedINode, 'aria-foo', 'bar');

		r.expect(ariaAssertion);
	});
});
