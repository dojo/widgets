const { describe, it } = intern.getInterface('bdd');
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import harness from '@dojo/framework/testing/harness';
import { tsx } from '@dojo/framework/core/vdom';

import Breadcrumb from '../../breadcrumb';
import * as css from '../../theme/default/breadcrumb-group.m.css';
import * as fixedCss from '../styles/breadcrumb-group.m.css';
import BreadcrumbGroup from '../index';

describe('BreadcrumbGroup', () => {
	const separatorClasses = [fixedCss.listItemFixed, css.listItem];
	const listItemClasses = [fixedCss.listItemFixed, css.listItem, undefined];
	const currentListItemClasses = [fixedCss.listItemFixed, css.listItem, css.current];

	const baseTemplate = assertionTemplate(() => (
		<nav assertion-key="root" classes={css.root} aria-label="breadcrumb">
			<ol classes={[fixedCss.listFixed, css.list]}>
				<virtual>
					<li classes={listItemClasses} key="breadcrumb-0">
						<Breadcrumb
							label="Home"
							current={undefined}
							href={undefined}
							title={undefined}
						/>
					</li>
				</virtual>
				<virtual>
					<li aria-hidden="true" classes={separatorClasses} key="breadcrumb-1-separator">
						<span classes={css.separator}>/</span>
					</li>
					<li classes={listItemClasses} key="breadcrumb-1">
						<Breadcrumb
							label="Overview"
							current={undefined}
							href={undefined}
							title={undefined}
						/>
					</li>
				</virtual>
				<virtual>
					<li aria-hidden="true" classes={separatorClasses} key="breadcrumb-2-separator">
						<span classes={css.separator}>/</span>
					</li>
					<li classes={currentListItemClasses} key="breadcrumb-2">
						<Breadcrumb
							label="Tests"
							current="page"
							href={undefined}
							title={undefined}
						/>
					</li>
				</virtual>
			</ol>
		</nav>
	));

	it('renders with items', () => {
		const h = harness(() => (
			<BreadcrumbGroup
				label="breadcrumb"
				items={[{ label: 'Home' }, { label: 'Overview' }, { label: 'Tests' }]}
			/>
		));

		h.expect(baseTemplate);
	});

	it('renders with a custom child renderer', () => {
		const h = harness(() => (
			<BreadcrumbGroup
				label="breadcrumb"
				items={[
					{ label: 'Home', href: '/' },
					{ label: 'Overview', href: '/overview', title: 'Breadcrumb Overview' },
					{ href: '/tests', label: 'Tests' }
				]}
			>
				{(items) => (
					<ol>
						{items.map((item, i) => (
							<li key={`crumb-${i}`}>
								<a
									aria-current={i === 1 ? 'page' : undefined}
									href={item.href}
									title={item.title}
								>
									{item.label}
								</a>
							</li>
						))}
					</ol>
				)}
			</BreadcrumbGroup>
		));

		h.expect(
			baseTemplate.setChildren('~root', () => [
				<ol>
					<li key="crumb-0">
						<a aria-current={undefined} href="/" title={undefined}>
							Home
						</a>
					</li>
					<li key="crumb-1">
						<a aria-current="page" href="/overview" title="Breadcrumb Overview">
							Overview
						</a>
					</li>
					<li key="crumb-2">
						<a aria-current={undefined} href="/tests" title={undefined}>
							Tests
						</a>
					</li>
				</ol>
			])
		);
	});
});
