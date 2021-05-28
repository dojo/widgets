const { describe, it } = intern.getInterface('bdd');
import { tsx } from '@dojo/framework/core/vdom';
import { renderer, assertion, wrap } from '@dojo/framework/testing/renderer';
import Text from '../index';
import * as css from '../../theme/default/text.m.css';

const WrappedParagraph = wrap('p');
const baseAssertion = assertion(() => (
	<WrappedParagraph classes={[null, css.root, css.m, false, false, css.primary]}>
		Hello World
	</WrappedParagraph>
));

describe('Texty', () => {
	it('Default Text', () => {
		const r = renderer(() => <Text>Hello World</Text>);
		r.expect(baseAssertion);
	});

	it('inverse', () => {
		const r = renderer(() => <Text inverse>Hello World</Text>);
		r.expect(
			baseAssertion.setProperty(WrappedParagraph, 'classes', [
				null,
				css.root,
				css.m,
				false,
				css.inverse,
				css.primary
			])
		);
	});

	it('truncated', () => {
		const r = renderer(() => <Text truncated>Hello World</Text>);
		r.expect(
			baseAssertion.setProperty(WrappedParagraph, 'classes', [
				null,
				css.root,
				css.m,
				css.truncate,
				false,
				css.primary
			])
		);
	});

	it('extra small', () => {
		const r = renderer(() => <Text size="xs">Hello World</Text>);
		r.expect(
			baseAssertion.setProperty(WrappedParagraph, 'classes', [
				null,
				css.root,
				css.xs,
				false,
				false,
				css.primary
			])
		);
	});

	it('small', () => {
		const r = renderer(() => <Text size="s">Hello World</Text>);
		r.expect(
			baseAssertion.setProperty(WrappedParagraph, 'classes', [
				null,
				css.root,
				css.s,
				false,
				false,
				css.primary
			])
		);
	});

	it('medium', () => {
		const r = renderer(() => <Text size="m">Hello World</Text>);
		r.expect(
			baseAssertion.setProperty(WrappedParagraph, 'classes', [
				null,
				css.root,
				css.m,
				false,
				false,
				css.primary
			])
		);
	});

	it('large', () => {
		const r = renderer(() => <Text size="l">Hello World</Text>);
		r.expect(
			baseAssertion.setProperty(WrappedParagraph, 'classes', [
				null,
				css.root,
				css.l,
				false,
				false,
				css.primary
			])
		);
	});

	it('extra large', () => {
		const r = renderer(() => <Text size="xl">Hello World</Text>);
		r.expect(
			baseAssertion.setProperty(WrappedParagraph, 'classes', [
				null,
				css.root,
				css.xl,
				false,
				false,
				css.primary
			])
		);
	});

	it('extra extra large', () => {
		const r = renderer(() => <Text size="xxl">Hello World</Text>);
		r.expect(
			baseAssertion.setProperty(WrappedParagraph, 'classes', [
				null,
				css.root,
				css.xxl,
				false,
				false,
				css.primary
			])
		);
	});

	it('as different node', () => {
		const r = renderer(() => <Text as="h1">Hello World</Text>);
		const baseAssertion = assertion(() => (
			<h1 classes={[null, css.root, css.m, false, false, css.primary]}>Hello World</h1>
		));
		r.expect(baseAssertion);
	});
});
