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
					<li classes={textSeparatorItemStyles} key="breadcrumb-0">
						<span classes={[fixedCss.labelFixed, css.label]}>Home</span>
					</li>
				</virtual>
				<virtual>
					<li aria-hidden="true" classes={separatorStyles} key="breadcrumb-1-separator">
						/
					</li>
					<li classes={textSeparatorItemStyles} key="breadcrumb-1">
						<span classes={[fixedCss.labelFixed, css.label]}>Overview</span>
					</li>
				</virtual>
				<virtual>
					<li aria-hidden="true" classes={separatorStyles} key="breadcrumb-2-separator">
						/
					</li>
					<li classes={currentTextSeparatorItemStyles} key="breadcrumb-2">
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
				items={[{ label: 'Home' }, { label: 'Overview' }, { label: 'Tests' }]}
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
				items={[{ label: 'Home' }, { label: 'Overview' }, { label: 'Tests' }]}
			/>
		));

		h.expect(
			baseTemplate.setChildren('@breadcrumb-2', () => [
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
				items={[{ label: 'Home' }, { label: 'Overview' }, { label: 'Tests' }]}
			/>
		));

		h.expect(
			baseTemplate
				.setChildren('@breadcrumb-1-separator', () => ['>'])
				.setChildren('@breadcrumb-2-separator', () => ['>'])
		);
	});

	it('renders with an icon separator', () => {
		const h = harness(() => (
			<Breadcrumb
				label="breadcrumb"
				current={2}
				separator={<Icon type="rightIcon" />}
				items={[{ label: 'Home' }, { label: 'Overview' }, { label: 'Tests' }]}
			/>
		));

		const separator = <Icon type="rightIcon" />;

		h.expect(
			baseTemplate
				.setChildren('@breadcrumb-1-separator', () => [separator])
				.setChildren('@breadcrumb-2-separator', () => [separator])
		);
	});

	it('renders with a custom child renderer', () => {
		const h = harness(() => (
			<Breadcrumb
				label="breadcrumb"
				current={2}
				items={[
					{ label: 'Home', href: '/' },
					{ label: 'Overview', href: '/overview', title: 'Breadcrumb Overview' },
					{ href: '/tests', label: 'Tests' }
				]}
			>
				{(item, isCurrent) => (
					<a aria-current={isCurrent || undefined} href={item.href} title={item.title}>
						{item.label}
					</a>
				)}
			</Breadcrumb>
		));

		h.expect(
			baseTemplate
				.setChildren('@breadcrumb-0', () => [
					<a aria-current={undefined} href="/" title={undefined}>
						Home
					</a>
				])
				.setChildren('@breadcrumb-1', () => [
					<a aria-current={undefined} href="/overview" title="Breadcrumb Overview">
						Overview
					</a>
				])
				.setChildren('@breadcrumb-2', () => [
					<a aria-current={true} href="/tests" title={undefined}>
						Tests
					</a>
				])
		);
	});
});
