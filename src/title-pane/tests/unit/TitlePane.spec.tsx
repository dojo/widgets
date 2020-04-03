const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

import * as fixedCss from '../../styles/title-pane.m.css';
import * as themeCss from '../../../theme/default/title-pane.m.css';
import Icon from '../../../icon';
import TitlePane, { TitlePaneProperties } from '../../index';
import assertationTemplate from '@dojo/framework/testing/assertionTemplate';
import harness from '@dojo/framework/testing/harness';
import { tsx } from '@dojo/framework/core/vdom';
import { stub } from 'sinon';

const noop = () => {};

describe('TitlePane', () => {
	function getTemplate({
		closeable = true,
		headingLevel,
		initialOpen,
		open
	}: TitlePaneProperties = {}) {
		const isOpen = open || initialOpen;

		return assertationTemplate(() => {
			return (
				<div
					classes={[
						undefined,
						themeCss.root,
						isOpen ? themeCss.open : null,
						fixedCss.rootFixed
					]}
				>
					<div
						aria-level={headingLevel ? `${headingLevel}` : null}
						classes={[
							themeCss.title,
							closeable ? themeCss.closeable : null,
							fixedCss.titleFixed,
							closeable ? fixedCss.closeableFixed : null
						]}
						role="heading"
					>
						<button
							aria-controls="test-content"
							aria-expanded={open === false ? 'false' : `${isOpen}`}
							disabled={!closeable}
							classes={[fixedCss.titleButtonFixed, themeCss.titleButton]}
							focus={false}
							key="title-button"
							onclick={noop}
							type="button"
						>
							<span classes={themeCss.arrow}>
								<Icon type={isOpen ? 'downIcon' : 'rightIcon'} theme={undefined} />
							</span>
							title
						</button>
					</div>
					<div
						aria-hidden={isOpen ? null : 'true'}
						aria-labelledby="test-title"
						classes={[
							themeCss.content,
							themeCss.contentTransition,
							fixedCss.contentFixed
						]}
						id="test-content"
						key="content"
						styles={{
							marginTop: isOpen ? '0px' : `-0px`
						}}
					>
						content
					</div>
				</div>
			);
		});
	}

	it('renders closed', () => {
		const h = harness(() => (
			<TitlePane>
				{{
					title: 'title',
					content: 'content'
				}}
			</TitlePane>
		));
		h.expect(getTemplate());
	});

	it('renders open', () => {
		const h = harness(() => (
			<TitlePane initialOpen>
				{{
					title: 'title',
					content: 'content'
				}}
			</TitlePane>
		));
		h.expect(
			getTemplate({
				initialOpen: true
			})
		);
	});

	it('renders heading level', () => {
		const h = harness(() => (
			<TitlePane headingLevel={3}>
				{{
					title: 'title',
					content: 'content'
				}}
			</TitlePane>
		));
		h.expect(
			getTemplate({
				headingLevel: 3
			})
		);
	});

	it('renders not closeable', () => {
		const h = harness(() => (
			<TitlePane closeable={false}>
				{{
					title: 'title',
					content: 'content'
				}}
			</TitlePane>
		));
		h.expect(
			getTemplate({
				closeable: false
			})
		);
	});

	it('opens a closed pane', () => {
		const h = harness(() => (
			<TitlePane>
				{{
					title: 'title',
					content: 'content'
				}}
			</TitlePane>
		));

		h.trigger('@title-button', 'onclick', { stopPropagation: noop });

		h.expect(getTemplate({ initialOpen: true }));
	});

	it('closes an open pane', () => {
		const h = harness(() => (
			<TitlePane initialOpen>
				{{
					title: 'title',
					content: 'content'
				}}
			</TitlePane>
		));

		h.trigger('@title-button', 'onclick', { stopPropagation: noop });

		h.expect(getTemplate().setProperty('@title-button', 'aria-expanded', 'false'));
	});

	it('calls onOpen', () => {
		const onOpen = stub();

		const h = harness(() => (
			<TitlePane onOpen={onOpen}>
				{{
					title: 'title',
					content: 'content'
				}}
			</TitlePane>
		));

		h.trigger('@title-button', 'onclick', { stopPropagation: noop });
		assert.isTrue(onOpen.called);
	});

	it('calls onClose', () => {
		const onClose = stub();

		const h = harness(() => (
			<TitlePane initialOpen onClose={onClose}>
				{{
					title: 'title',
					content: 'content'
				}}
			</TitlePane>
		));

		h.trigger('@title-button', 'onclick', { stopPropagation: noop });
		assert.isTrue(onClose.called);
	});

	it('allows partial control', () => {
		const getHarness = (open: boolean) =>
			harness(() => (
				<TitlePane open={open}>
					{{
						title: 'title',
						content: 'content'
					}}
				</TitlePane>
			));

		getHarness(true).expect(getTemplate({ open: true }));
		getHarness(false).expect(getTemplate({ open: false }));
	});
});
