const { registerSuite } = intern.getInterface('object');

import harness from '@dojo/framework/testing/harness';
import { tsx, create } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import theme from '../theme';
import { ClassNames } from '@dojo/framework/core/mixins/Themed';

interface TestProperties {
	baseCss: ClassNames;
	variantCss: ClassNames;
}

const factory = create({ theme }).properties<TestProperties>();
const TestWidget = factory(function TestWidget({ properties, middleware: { theme } }) {
	const { baseCss, variantCss } = properties();
	return (
		<div key="root">
			{JSON.stringify(
				theme.compose(
					baseCss,
					variantCss
				)
			)}
		</div>
	);
});

const baseTemplate = assertionTemplate(() => <div key="root" />);

registerSuite('theme-middleware', {
	tests: {
		'Base used when no theme applied'() {
			const baseCss = { ' _key': 'base', a: 'base-a', b: 'base-b' };
			const variantCss = { ' _key': 'test', a: 'variant-a' };
			const h = harness(() => <TestWidget baseCss={baseCss} variantCss={variantCss} />);

			h.expect(
				baseTemplate.setChildren('@root', () => [
					JSON.stringify({ a: 'base-a', b: 'base-b' })
				])
			);
		},

		'Base theme comes through'() {
			const baseCss = { ' _key': 'base', a: 'base-a', b: 'base-b' };
			const variantCss = { ' _key': 'test', a: 'variant-a' };
			const theme = {
				base: {
					a: 'base-theme-a'
				}
			};
			const h = harness(() => (
				<TestWidget baseCss={baseCss} variantCss={variantCss} theme={theme} />
			));

			h.expect(
				baseTemplate.setChildren('@root', () => [
					JSON.stringify({ a: 'base-theme-a', b: 'base-b' })
				])
			);
		},

		'Variant theme overrides base theme'() {
			const baseCss = { ' _key': 'base', a: 'base-a', b: 'base-b' };
			const variantCss = { ' _key': 'variant', a: 'variant-a' };
			const theme = {
				base: {
					a: 'base-theme-a'
				},
				variant: {
					a: 'variant-theme-a'
				}
			};
			const h = harness(() => (
				<TestWidget baseCss={baseCss} variantCss={variantCss} theme={theme} />
			));

			h.expect(
				baseTemplate.setChildren('@root', () => [
					JSON.stringify({ a: 'variant-theme-a', b: 'base-b' })
				])
			);
		},

		'Both themes used with different classes'() {
			const baseCss = { ' _key': 'base', a: 'base-a', b: 'base-b' };
			const variantCss = { ' _key': 'variant', a: 'variant-a' };
			const theme = {
				base: {
					a: 'base-theme-a'
				},
				variant: {
					b: 'variant-theme-b'
				}
			};
			const h = harness(() => (
				<TestWidget baseCss={baseCss} variantCss={variantCss} theme={theme} />
			));

			h.expect(
				baseTemplate.setChildren('@root', () => [
					JSON.stringify({ a: 'base-theme-a', b: 'variant-theme-b' })
				])
			);
		}
	}
});
