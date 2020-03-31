const { describe, it } = intern.getInterface('bdd');
import * as themeCss from '../../../theme/default/accordion-pane.m.css';
import AccordionPane from '../../index';
import TitlePane from '../../../title-pane';
import assertationTemplate from '@dojo/framework/testing/assertionTemplate';
import harness from '@dojo/framework/testing/harness';
import { tsx } from '@dojo/framework/core/vdom';

const noop = () => {};

describe('AccordionPane', () => {
	const baseTemplate = assertationTemplate(() => {
		return (
			<div classes={[undefined, themeCss.root]}>
				<TitlePane key="foo">
					{{
						title: () => 'foo title',
						content: () => 'foo content'
					}}
				</TitlePane>
				<TitlePane key="bar">
					{{
						title: () => 'bar title',
						content: () => 'bar content'
					}}
				</TitlePane>
			</div>
		);
	});

	it('renders closed panes', () => {
		const h = harness(() => (
			<AccordionPane>
				{(onOpen, onClose) => {
					return [
						<TitlePane key="foo" onOpen={onOpen('foo')} onClose={onClose('foo')}>
							{{
								title: () => 'foo title',
								content: () => 'foo content'
							}}
						</TitlePane>,
						<TitlePane key="bar" onOpen={onOpen('bar')} onClose={onClose('bar')}>
							{{
								title: () => 'bar title',
								content: () => 'bar content'
							}}
						</TitlePane>
					];
				}}
			</AccordionPane>
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
			<AccordionPane>
				{(onOpen, _, initialOpen) => {
					return [
						<TitlePane
							key="foo"
							onOpen={onOpen('foo')}
							initialOpen={initialOpen('foo')}
						>
							{{
								title: () => 'foo title',
								content: () => 'foo content'
							}}
						</TitlePane>,
						<TitlePane
							key="bar"
							onOpen={onOpen('bar')}
							initialOpen={initialOpen('bar')}
						>
							{{
								title: () => 'bar title',
								content: () => 'bar content'
							}}
						</TitlePane>
					];
				}}
			</AccordionPane>
		));

		h.trigger('@foo', 'onOpen');
		h.trigger('@bar', 'onOpen');

		const testTemplate = baseTemplate
			.setProperty('@foo', 'initialOpen', true)
			.setProperty('@foo', 'onOpen', noop)
			.setProperty('@bar', 'initialOpen', true)
			.setProperty('@bar', 'onOpen', noop);

		h.expect(testTemplate);
	});

	it('renders exclusive panes', () => {
		const h = harness(() => (
			<AccordionPane exclusive>
				{(onOpen, _, initialOpen) => {
					return [
						<TitlePane
							key="foo"
							onOpen={onOpen('foo')}
							initialOpen={initialOpen('foo')}
						>
							{{
								title: () => 'foo title',
								content: () => 'foo content'
							}}
						</TitlePane>,
						<TitlePane
							key="bar"
							onOpen={onOpen('bar')}
							initialOpen={initialOpen('bar')}
						>
							{{
								title: () => 'bar title',
								content: () => 'bar content'
							}}
						</TitlePane>
					];
				}}
			</AccordionPane>
		));

		h.trigger('@foo', 'onOpen');
		h.trigger('@bar', 'onOpen');

		const testTemplate = baseTemplate
			.setProperty('@foo', 'initialOpen', undefined)
			.setProperty('@foo', 'onOpen', noop)
			.setProperty('@bar', 'initialOpen', true)
			.setProperty('@bar', 'onOpen', noop);

		h.expect(testTemplate);
	});
});
