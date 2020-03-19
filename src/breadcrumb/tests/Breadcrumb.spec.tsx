const { describe, it } = intern.getInterface('bdd');
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import harness from '@dojo/framework/testing/harness';
import { tsx } from '@dojo/framework/core/vdom';

import Icon from '../../icon';
import * as css from '../../theme/default/breadcrumb.m.css';
import * as fixedCss from '../styles/breadcrumb.m.css';
import Breadcrumb from '../index';

describe('Breadcrumb', () => {
	const separatorStyles = [fixedCss.listItemFixed, css.listItem, css.separator];
	const textSeparatorItemStyles = [fixedCss.listItemFixed, css.listItem, undefined];
	const currentTextSeparatorItemStyles = [fixedCss.listItemFixed, css.listItem, css.current];

	const baseTemplate = assertionTemplate(() => (
		<nav classes={css.root} aria-label="breadcrumb">
			<ol classes={[fixedCss.listFixed, css.list]}>
				<virtual>
					<li classes={textSeparatorItemStyles} key="home">
						<a classes={[fixedCss.labelFixed, css.label]} href="/" title={undefined}>
							Home
						</a>
					</li>
				</virtual>
				<virtual>
					<li aria-hidden="true" classes={separatorStyles} key="overview-separator">
						/
					</li>
					<li classes={textSeparatorItemStyles} key="overview">
						<a
							classes={[fixedCss.labelFixed, css.label]}
							href="/overview"
							title="Breadcrumb Overview"
						>
							Overview
						</a>
					</li>
				</virtual>
				<virtual>
					<li aria-hidden="true" classes={separatorStyles} key="tests-separator">
						/
					</li>
					<li classes={currentTextSeparatorItemStyles} key="tests">
						<span classes={[fixedCss.labelFixed, css.label]} aria-current="page">
							Tests
						</span>
					</li>
				</virtual>
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
			baseTemplate.setChildren('@tests', () => [
				<span classes={[fixedCss.labelFixed, css.label]} aria-current="step">
					Tests
				</span>
			])
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
				.setChildren('@overview-separator', () => ['>'])
				.setChildren('@tests-separator', () => ['>'])
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

		const separator = <Icon type="rightIcon" />;

		h.expect(
			baseTemplate
				.setChildren('@overview-separator', () => [separator])
				.setChildren('@tests-separator', () => [separator])
		);
	});
});
