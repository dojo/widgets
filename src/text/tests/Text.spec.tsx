const { describe, it } = intern.getInterface('bdd');
import { tsx } from '@dojo/framework/core/vdom';
import { renderer, assertion, wrap } from '@dojo/framework/testing/renderer';
import Text from '../index';
import * as css from '../../theme/default/text.m.css';
import * as fixedCss from '../styles/Text.m.css';

const WrappedParagraph = wrap('p');
const baseAssertion = assertion(() => (
	<WrappedParagraph
		classes={[null, css.root, css.medium, css.normal, false, false, css.primary, false]}
	>
		Hello World
	</WrappedParagraph>
));

describe('Text', () => {
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
				css.medium,
				css.normal,
				false,
				css.inverse,
				css.primary,
				false
			])
		);
	});

	it('truncated', () => {
		const r = renderer(() => <Text truncated>Hello World</Text>);
		r.expect(
			baseAssertion.setProperty(WrappedParagraph, 'classes', [
				null,
				css.root,
				css.medium,
				css.normal,
				fixedCss.truncate,
				false,
				css.primary,
				false
			])
		);
	});

	it('extra small', () => {
		const r = renderer(() => <Text size="x-small">Hello World</Text>);
		r.expect(
			baseAssertion.setProperty(WrappedParagraph, 'classes', [
				null,
				css.root,
				css.xSmall,
				css.normal,
				false,
				false,
				css.primary,
				false
			])
		);
	});

	it('small', () => {
		const r = renderer(() => <Text size="small">Hello World</Text>);
		r.expect(
			baseAssertion.setProperty(WrappedParagraph, 'classes', [
				null,
				css.root,
				css.small,
				css.normal,
				false,
				false,
				css.primary,
				false
			])
		);
	});

	it('medium', () => {
		const r = renderer(() => <Text size="medium">Hello World</Text>);
		r.expect(
			baseAssertion.setProperty(WrappedParagraph, 'classes', [
				null,
				css.root,
				css.medium,
				css.normal,
				false,
				false,
				css.primary,
				false
			])
		);
	});

	it('large', () => {
		const r = renderer(() => <Text size="large">Hello World</Text>);
		r.expect(
			baseAssertion.setProperty(WrappedParagraph, 'classes', [
				null,
				css.root,
				css.large,
				css.normal,
				false,
				false,
				css.primary,
				false
			])
		);
	});

	it('extra large', () => {
		const r = renderer(() => <Text size="x-large">Hello World</Text>);
		r.expect(
			baseAssertion.setProperty(WrappedParagraph, 'classes', [
				null,
				css.root,
				css.xLarge,
				css.normal,
				false,
				false,
				css.primary,
				false
			])
		);
	});

	it('extra extra large', () => {
		const r = renderer(() => <Text size="xx-large">Hello World</Text>);
		r.expect(
			baseAssertion.setProperty(WrappedParagraph, 'classes', [
				null,
				css.root,
				css.xxLarge,
				css.normal,
				false,
				false,
				css.primary,
				false
			])
		);
	});

	it('light', () => {
		const r = renderer(() => <Text weight="light">Hello World</Text>);
		r.expect(
			baseAssertion.setProperty(WrappedParagraph, 'classes', [
				null,
				css.root,
				css.medium,
				css.light,
				false,
				false,
				css.primary,
				false
			])
		);
	});

	it('heavy', () => {
		const r = renderer(() => <Text weight="heavy">Hello World</Text>);
		r.expect(
			baseAssertion.setProperty(WrappedParagraph, 'classes', [
				null,
				css.root,
				css.medium,
				css.heavy,
				false,
				false,
				css.primary,
				false
			])
		);
	});

	it('as different node', () => {
		const r = renderer(() => <Text as="h1">Hello World</Text>);
		const baseAssertion = assertion(() => (
			<h1
				classes={[null, css.root, css.medium, css.normal, false, false, css.primary, false]}
			>
				Hello World
			</h1>
		));
		r.expect(baseAssertion);
	});
});
