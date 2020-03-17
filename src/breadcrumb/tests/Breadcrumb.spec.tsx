const { describe, it } = intern.getInterface('bdd');
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import harness from '@dojo/framework/testing/harness';
import { tsx } from '@dojo/framework/core/vdom';

import Icon from '../../icon';
import * as css from '../Breadcrumb.m.css';
import Breadcrumb from '../index';

describe('Breadcrumb', () => {
	const baseTemplate = assertionTemplate(() => (
		<nav classes={css.root} aria-label="breadcrumb">
			<ol classes={[css.listFixed, css.list]}>
				<li
					classes={[css.listItem, css.withTextSeparator, undefined]}
					data-separator="/"
					key="home"
				>
					<a href="/" title={undefined}>
						Home
					</a>
				</li>
				<li
					classes={[css.listItem, css.withTextSeparator, undefined]}
					data-separator="/"
					key="overview"
				>
					<a href="/overview" title="Breadcrumb Overview">
						Overview
					</a>
				</li>
				<li
					classes={[css.listItem, css.withTextSeparator, css.current]}
					data-separator="/"
					key="tests"
				>
					<span aria-current="page">Tests</span>
				</li>
			</ol>
		</nav>
	));

	it('renders with items', () => {
		const h = harness(() => (
			<Breadcrumb
				label="breadcrumb"
				current={2}
				items={[
					{ key: 'home', label: 'Home', href: '/' },
					{
						key: 'overview',
						label: 'Overview',
						href: '/overview',
						title: 'Breadcrumb Overview'
					},
					{
						key: 'tests',
						label: 'Tests'
					}
				]}
			/>
		));

		h.expect(baseTemplate);
	});

	it('renders as a step process', () => {
		const h = harness(() => (
			<Breadcrumb
				label="breadcrumb"
				current={2}
				itemLevel="step"
				items={[
					{ key: 'home', label: 'Home', href: '/' },
					{
						key: 'overview',
						label: 'Overview',
						href: '/overview',
						title: 'Breadcrumb Overview'
					},
					{
						key: 'tests',
						label: 'Tests'
					}
				]}
			/>
		));

		h.expect(
			baseTemplate.setChildren('@tests', () => [<span aria-current="step">Tests</span>])
		);
	});

	it('renders with a custom string separator', () => {
		const h = harness(() => (
			<Breadcrumb
				label="breadcrumb"
				current={2}
				separator={'>'}
				items={[
					{ key: 'home', label: 'Home', href: '/' },
					{
						key: 'overview',
						label: 'Overview',
						href: '/overview',
						title: 'Breadcrumb Overview'
					},
					{
						key: 'tests',
						label: 'Tests'
					}
				]}
			/>
		));

		h.expect(
			baseTemplate
				.setProperty('@home', 'data-separator', '>')
				.setProperty('@overview', 'data-separator', '>')
				.setProperty('@tests', 'data-separator', '>')
		);
	});

	it('renders with an icon separator', () => {
		const h = harness(() => (
			<Breadcrumb
				label="breadcrumb"
				current={2}
				separator={<Icon type="rightIcon" />}
				items={[
					{ key: 'home', label: 'Home', href: '/' },
					{
						key: 'overview',
						label: 'Overview',
						href: '/overview',
						title: 'Breadcrumb Overview'
					},
					{
						key: 'tests',
						label: 'Tests'
					}
				]}
			/>
		));

		const separator = (
			<span aria-hidden="true">
				<Icon type="rightIcon" />
			</span>
		);

		h.expect(
			baseTemplate
				.setProperties('@home', {
					key: 'home',
					'data-separator': undefined,
					classes: [css.listItem, undefined, undefined]
				})
				.setProperties('@overview', {
					key: 'overview',
					'data-separator': undefined,
					classes: [css.listItem, undefined, undefined]
				})
				.setProperties('@tests', {
					key: 'tests',
					'data-separator': undefined,
					classes: [css.listItem, undefined, css.current]
				})
				.setChildren('@overview', () => [separator], 'prepend')
				.setChildren('@tests', () => [separator], 'prepend')
		);
	});
});
