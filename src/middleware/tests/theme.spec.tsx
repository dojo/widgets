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

const PrefixTestWidget = factory(function TestWidget({ properties, middleware: { theme } }) {
	const { baseCss, variantCss } = properties();
	return (
		<div key="root">
			{JSON.stringify(
				theme.compose(
					baseCss,
					variantCss,
					'prefix'
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
		},

		'Resolves themes correctly when using composes resulting in space-separated classnames'() {
			const baseCss = { ' _key': 'base', a: 'base-a', b: 'base-b' };
			const variantCss = {
				' _key': 'variant',
				a: 'variant-a composed-variant-a',
				b: 'variant-b'
			};
			const theme = {
				base: {
					a: 'base-theme-a'
				},
				variant: {
					// composed-variant-a in both themed / unthemed classnames
					a: 'variant-theme-a composed-variant-a'
				}
			};
			const h = harness(() => (
				<TestWidget baseCss={baseCss} variantCss={variantCss} theme={theme} />
			));

			h.expect(
				baseTemplate.setChildren('@root', () => [
					JSON.stringify({ a: 'variant-theme-a composed-variant-a', b: 'base-b' })
				])
			);
		},

		'Resolves theme classes correctly when used with `classes` property'() {
			const baseCss = { ' _key': 'base', a: 'base-a', b: 'base-b' };
			const variantCss = { ' _key': 'variant', a: 'variant-a', b: 'variant-b' };
			const theme = {
				base: {
					a: 'base-theme-a'
				},
				variant: {
					b: 'variant-theme-b'
				}
			};
			const h = harness(() => (
				<TestWidget
					baseCss={baseCss}
					variantCss={variantCss}
					theme={theme}
					classes={{ variant: { a: ['variant-classes-a'] } }}
				/>
			));

			h.expect(
				baseTemplate.setChildren('@root', () => [
					JSON.stringify({ a: 'base-theme-a', b: 'variant-theme-b' })
				])
			);
		},

		'Can be used with a prefix to pick out theme classes for a child widget'() {
			const baseCss = { ' _key': 'base', root: 'base-root', input: 'base-input' };
			const variantCss = { ' _key': 'variant', prefixRoot: 'variant-root' };
			const theme = {
				base: {
					root: 'base-theme-root'
				},
				variant: {
					prefixRoot: 'variant-theme-root'
				}
			};
			const h = harness(() => (
				<PrefixTestWidget baseCss={baseCss} variantCss={variantCss} theme={theme} />
			));

			h.expect(
				baseTemplate.setChildren('@root', () => [
					JSON.stringify({ root: 'variant-theme-root', input: 'base-input' })
				])
			);
		},

		'Resolves prefixed theme classes correctly when used with `classes` property'() {
			const baseCss = { ' _key': 'base', root: 'base-root', input: 'base-input' };
			const variantCss = { ' _key': 'variant', prefixRoot: 'variant-root' };
			const theme = {
				variant: {
					prefixInput: 'variant-theme-input'
				}
			};
			const h = harness(() => (
				<PrefixTestWidget
					baseCss={baseCss}
					variantCss={variantCss}
					theme={theme}
					classes={{ variant: { prefixRoot: ['variant-classes-prefix-root'] } }}
				/>
			));

			h.expect(
				baseTemplate.setChildren('@root', () => [
					JSON.stringify({ root: 'base-root', input: 'variant-theme-input' })
				])
			);
		}
	}
});
