const { describe, it } = intern.getInterface('bdd');
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import harness from '@dojo/framework/testing/harness/harness';
import { tsx } from '@dojo/framework/core/vdom';

import * as css from '../../theme/default/breadcrumb-group.m.css';
import * as fixedCss from '../styles/breadcrumb-group.m.css';
import BreadcrumbGroup, { Breadcrumb, BreadcrumbSeparator } from '../index';

describe('BreadcrumbSeparator', () => {
	it('renders', () => {
		const h = harness(() => <BreadcrumbSeparator>/</BreadcrumbSeparator>);
		h.expect(() => (
			<li aria-hidden="true" classes={css.listItem}>
				<span classes={[fixedCss.separatorFixed, css.separator]}>/</span>
			</li>
		));
	});
});

describe('Breadcrumb', () => {
	it('renders a text label', () => {
		const h = harness(() => <Breadcrumb>Home</Breadcrumb>);

		h.expect(() => (
			<li classes={[css.listItem, undefined]}>
				<span aria-current={undefined} classes={[fixedCss.breadcrumbFixed, css.breadcrumb]}>
					Home
				</span>
			</li>
		));
	});

	it('renders with a link', () => {
		const h = harness(() => (
			<Breadcrumb href="/home" title="Home page">
				Home
			</Breadcrumb>
		));
		h.expect(() => (
			<li classes={[css.listItem, undefined]}>
				<a
					aria-current={undefined}
					classes={[fixedCss.breadcrumbFixed, css.breadcrumb]}
					href="/home"
					title="Home page"
				>
					Home
				</a>
			</li>
		));
	});

	it('renders with an aria-current attributes', () => {
		const h = harness(() => <Breadcrumb current="step">Home</Breadcrumb>);

		h.expect(() => (
			<li classes={[css.listItem, css.current]}>
				<span aria-current="step" classes={[fixedCss.breadcrumbFixed, css.breadcrumb]}>
					Home
				</span>
			</li>
		));
	});
});

describe('BreadcrumbGroup', () => {
	const baseTemplate = assertionTemplate(() => (
		<nav classes={[undefined, css.root]} aria-label="breadcrumb">
			<ol assertion-key="list" classes={[fixedCss.listFixed, css.list]}>
				<virtual>
					<Breadcrumb
						key="breadcrumb-0"
						current={undefined}
						href={undefined}
						title={undefined}
						theme={undefined}
						classes={undefined}
						variant={undefined}
					>
						Home
					</Breadcrumb>
				</virtual>
				<virtual>
					<BreadcrumbSeparator key="breadcrumb-1-separator">/</BreadcrumbSeparator>
					<Breadcrumb
						key="breadcrumb-1"
						current={undefined}
						href={undefined}
						title={undefined}
						theme={undefined}
						classes={undefined}
						variant={undefined}
					>
						Overview
					</Breadcrumb>
				</virtual>
				<virtual>
					<BreadcrumbSeparator key="breadcrumb-2-separator">/</BreadcrumbSeparator>
					<Breadcrumb
						key="breadcrumb-2"
						current="page"
						href={undefined}
						title={undefined}
						theme={undefined}
						classes={undefined}
						variant={undefined}
					>
						Tests
					</Breadcrumb>
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
				{(items) =>
					items.map((item, i) => (
						<li key={`crumb-${i}`}>
							<a
								aria-current={i === 1 ? 'page' : undefined}
								href={item.href}
								title={item.title}
							>
								{item.label}
							</a>
						</li>
					))
				}
			</BreadcrumbGroup>
		));

		h.expect(
			baseTemplate.setChildren('~list', () => [
				<li key="crumb-0">
					<a aria-current={undefined} href="/" title={undefined}>
						Home
					</a>
				</li>,
				<li key="crumb-1">
					<a aria-current="page" href="/overview" title="Breadcrumb Overview">
						Overview
					</a>
				</li>,
				<li key="crumb-2">
					<a aria-current={undefined} href="/tests" title={undefined}>
						Tests
					</a>
				</li>
			])
		);
	});
});
