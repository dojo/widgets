const { describe, it } = intern.getInterface('bdd');
import * as themeCss from '../../../theme/default/accordion.m.css';
import * as titlePaneCss from '../../../theme/default/title-pane.m.css';
import Accordion, { Pane } from '../../index';
import TitlePane from '../../../title-pane';
import assertationTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import harness from '@dojo/framework/testing/harness/harness';
import { tsx } from '@dojo/framework/core/vdom';

const noop = () => {};

describe('Pane', () => {
	it('renders', () => {
		const h = harness(() => (
			<Pane>
				{{
					title: 'foo title',
					content: 'foo content'
				}}
			</Pane>
		));
		h.expect(() => (
			<TitlePane
				theme={{
					'@dojo/widgets/title-pane': {
						title: titlePaneCss.title,
						closeable: titlePaneCss.closeable,
						arrow: titlePaneCss.arrow,
						root: themeCss.paneRoot,
						open: themeCss.paneOpen,
						content: titlePaneCss.content,
						titleButton: titlePaneCss.titleButton,
						contentTransition: titlePaneCss.contentTransition
					}
				}}
			>
				{{
					title: 'foo title',
					content: 'foo content'
				}}
			</TitlePane>
		));
	});
});

describe('Accordion', () => {
	const baseTemplate = assertationTemplate(() => {
		return (
			<div classes={[undefined, themeCss.root]}>
				<Pane key="foo">
					{{
						title: 'foo title',
						content: 'foo content'
					}}
				</Pane>
				<Pane key="bar">
					{{
						title: 'bar title',
						content: 'bar content'
					}}
				</Pane>
			</div>
		);
	});

	it('renders closed panes', () => {
		const h = harness(() => (
			<Accordion>
				{(onOpen, onClose) => {
					return [
						<Pane key="foo" onOpen={onOpen('foo')} onClose={onClose('foo')}>
							{{
								title: 'foo title',
								content: 'foo content'
							}}
						</Pane>,
						<Pane key="bar" onOpen={onOpen('bar')} onClose={onClose('bar')}>
							{{
								title: 'bar title',
								content: 'bar content'
							}}
						</Pane>
					];
				}}
			</Accordion>
		));

		h.trigger('@foo', 'onOpen');
		h.trigger('@bar', 'onOpen');
		h.trigger('@foo', 'onClose');
		h.trigger('@bar', 'onClose');

		const testTemplate = baseTemplate
			.setProperty('@foo', 'onOpen', noop)
			.setProperty('@foo', 'onClose', noop)
			.setProperty('@bar', 'onOpen', noop)
			.setProperty('@bar', 'onClose', noop);

		h.expect(testTemplate);
	});

	it('renders open panes', () => {
		const h = harness(() => (
			<Accordion>
				{(onOpen, _, open) => {
					return [
						<Pane key="foo" onOpen={onOpen('foo')} open={open('foo')}>
							{{
								title: 'foo title',
								content: 'foo content'
							}}
						</Pane>,
						<Pane key="bar" onOpen={onOpen('bar')} open={open('bar')}>
							{{
								title: 'bar title',
								content: 'bar content'
							}}
						</Pane>
					];
				}}
			</Accordion>
		));

		h.trigger('@foo', 'onOpen');
		h.trigger('@bar', 'onOpen');

		const testTemplate = baseTemplate
			.setProperty('@foo', 'open', true)
			.setProperty('@foo', 'onOpen', noop)
			.setProperty('@bar', 'open', true)
			.setProperty('@bar', 'onOpen', noop);

		h.expect(testTemplate);
	});

	it('renders exclusive panes', () => {
		const h = harness(() => (
			<Accordion exclusive>
				{(onOpen, _, open) => {
					return [
						<Pane key="foo" onOpen={onOpen('foo')} open={open('foo')}>
							{{
								title: 'foo title',
								content: 'foo content'
							}}
						</Pane>,
						<Pane key="bar" onOpen={onOpen('bar')} open={open('bar')}>
							{{
								title: 'bar title',
								content: 'bar content'
							}}
						</Pane>
					];
				}}
			</Accordion>
		));

		h.trigger('@foo', 'onOpen');
		h.trigger('@bar', 'onOpen');

		const testTemplate = baseTemplate
			.setProperty('@foo', 'open', false)
			.setProperty('@foo', 'onOpen', noop)
			.setProperty('@bar', 'open', true)
			.setProperty('@bar', 'onOpen', noop);

		h.expect(testTemplate);
	});
});
