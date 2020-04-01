import { SinonStub } from 'sinon';

const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';

import { RenderResult } from '@dojo/framework/core/interfaces';

import i18n from '@dojo/framework/core/middleware/i18n';
import { create, tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import { HarnessAPI } from '@dojo/framework/testing/harness';
import select from '@dojo/framework/testing/support/selector';

import {
	compareTheme,
	createHarness,
	noop,
	isStringComparator
} from '../../../common/tests/support/test-helpers';
import * as baseCss from '../../../common/styles/base.m.css';
import * as css from '../../../theme/default/rate.m.css';
import Radio from '../../../radio';
import RadioGroup from '../../../radio-group';
import Rate, { RateProperties } from '../../index';

const i18nFactory = create();
const i18nMiddlewareMock = i18nFactory(() => ({
	localize() {
		return {
			format(key: string, options?: Record<string, any>) {
				if (options) {
					return `${key}&${Object.entries(options)
						.sort(([a], [b]) => {
							return a.localeCompare(b);
						})
						.map(([key, value]) => `${key}:${value}`)
						.join('&')}`;
				}
				return key;
			}
		};
	}
}));

const harness = createHarness([
	compareTheme,
	{
		selector: '@radioGroup',
		property: 'options',
		comparator: Array.isArray
	},
	{
		selector: '*',
		property: 'widgetId',
		comparator: isStringComparator
	},
	{
		selector: '@radio',
		property: 'label',
		comparator: () => true
	}
]);

const selectRadio = (h: HarnessAPI, value?: string, checkedStub?: SinonStub) => {
	return h.trigger(
		'@radioGroup',
		(node: any) => node.children[0],
		'rate',
		(radioValue: string) => ({
			checked(checked?: boolean) {
				if (typeof checked === 'undefined') {
					return radioValue === value;
				}
				checkedStub && checkedStub(checked);
			}
		})
	);
};
const createGroup = (integer: number, hidden: boolean, active: boolean, children: RenderResult) => (
	<div
		key={integer}
		classes={[
			css.characterWrapper,
			hidden ? baseCss.visuallyHidden : null,
			active ? css.active : null
		]}
	>
		{children}
	</div>
);
const createRadio = (
	properties: Partial<RateProperties> = {},
	key: string,
	quotient: number,
	numerator = 0,
	denominator = 1
) => {
	const { disabled = false, readOnly = false } = properties;
	const styles: Partial<CSSStyleDeclaration> = {};
	const classes: string[] = [];
	const radioClasses: string[] = [];
	if (denominator > 1 && numerator !== 1) {
		styles.width = `${((denominator - (numerator || denominator) + 1) / denominator) * 100}%`;
		classes.push(css.partialCharacter);
		radioClasses.push(css.partialRadio);
	}
	return (
		<div key={key} styles={styles} classes={classes} onpointerenter={noop} onclick={noop}>
			<Radio
				widgetId=""
				key="radio"
				name="rate"
				checked={false}
				disabled={disabled || readOnly}
				onFocus={noop}
				onBlur={noop}
				onValue={noop}
				theme={{}}
				classes={{
					'@dojo/widgets/radio': {
						root: radioClasses,
						inputWrapper: [baseCss.visuallyHidden]
					},
					'@dojo/widgets/label': {
						root: [css.labelRoot]
					}
				}}
				label=""
			/>
		</div>
	);
};

describe('Rate', () => {
	const baseTemplate = (properties: Partial<RateProperties> = {}) =>
		assertionTemplate(() => (
			<div
				key="root"
				classes={[
					undefined,
					css.root,
					properties.readOnly ? css.readOnly : null,
					properties.disabled ? css.disabled : null
				]}
				onpointerenter={noop}
				onpointerleave={noop}
			>
				<RadioGroup
					key="radioGroup"
					initialValue={undefined}
					label={undefined}
					name="rate"
					onValue={noop}
					options={[]}
					theme={{}}
				>
					{() => []}
				</RadioGroup>
			</div>
		));

	it('renders', () => {
		const h = harness(() => <Rate name="rate" />, {
			middleware: [[i18n, i18nMiddlewareMock]]
		});
		h.expect(baseTemplate());
		const radios = selectRadio(h);
		h.expect(
			() => (
				<div classes={[css.groupWrapper, null]}>
					{createGroup(1, false, false, [createRadio(undefined, '1-1', 1)])}
					{createGroup(2, false, false, [createRadio(undefined, '2-1', 4)])}
					{createGroup(3, false, false, [createRadio(undefined, '3-1', 3)])}
					{createGroup(4, false, false, [createRadio(undefined, '4-1', 4)])}
					{createGroup(5, false, false, [createRadio(undefined, '5-1', 5)])}
				</div>
			),
			() => radios
		);
	});

	it('renders with max', () => {
		const h = harness(() => <Rate name="rate" max={2} />, {
			middleware: [[i18n, i18nMiddlewareMock]]
		});
		h.expect(baseTemplate());
		const radios = selectRadio(h);
		h.expect(
			() => (
				<div classes={[css.groupWrapper, null]}>
					{createGroup(1, false, false, [createRadio(undefined, '1-1', 1)])}
					{createGroup(2, false, false, [createRadio(undefined, '2-1', 4)])}
				</div>
			),
			() => radios
		);
	});

	it('renders disabled', () => {
		const h = harness(() => <Rate name="rate" disabled />, {
			middleware: [[i18n, i18nMiddlewareMock]]
		});
		const properties = { disabled: true };
		h.expect(baseTemplate(properties));
		const radios = selectRadio(h);
		h.expect(
			() => (
				<div classes={[css.groupWrapper, null]}>
					{createGroup(1, false, false, [createRadio(properties, '1-1', 1)])}
					{createGroup(2, false, false, [createRadio(properties, '2-1', 4)])}
					{createGroup(3, false, false, [createRadio(properties, '3-1', 3)])}
					{createGroup(4, false, false, [createRadio(properties, '4-1', 4)])}
					{createGroup(5, false, false, [createRadio(properties, '5-1', 5)])}
				</div>
			),
			() => radios
		);
	});

	it('renders readOnly which prevents allowClear', () => {
		const h = harness(() => <Rate name="rate" initialValue={1} readOnly allowClear />, {
			middleware: [[i18n, i18nMiddlewareMock]]
		});
		const properties = { readOnly: true };
		h.expect(baseTemplate(properties).setProperty('@radioGroup', 'initialValue', `1-1`));
		const radios = selectRadio(h);
		const [radio] = select('[key="1-1"]', radios);
		assert.exists(radio);
		(radio.properties as any).onclick();
		h.expect(
			() => (
				<div classes={[css.groupWrapper, null]}>
					{createGroup(0, true, false, [createRadio(properties, '', 0)])}
					{createGroup(1, false, false, [createRadio(properties, '1-1', 1)])}
					{createGroup(2, false, false, [createRadio(properties, '2-1', 4)])}
					{createGroup(3, false, false, [createRadio(properties, '3-1', 3)])}
					{createGroup(4, false, false, [createRadio(properties, '4-1', 4)])}
					{createGroup(5, false, false, [createRadio(properties, '5-1', 5)])}
				</div>
			),
			() => radios
		);
	});

	it('receives focus and blur', () => {
		const h = harness(() => <Rate name="rate" />, {
			middleware: [[i18n, i18nMiddlewareMock]]
		});
		h.expect(baseTemplate());

		let radios = selectRadio(h);
		h.expect(
			() => (
				<div classes={[css.groupWrapper, null]}>
					{createGroup(1, false, false, [createRadio(undefined, '1-1', 1)])}
					{createGroup(2, false, false, [createRadio(undefined, '2-1', 4)])}
					{createGroup(3, false, false, [createRadio(undefined, '3-1', 3)])}
					{createGroup(4, false, false, [createRadio(undefined, '4-1', 4)])}
					{createGroup(5, false, false, [createRadio(undefined, '5-1', 5)])}
				</div>
			),
			() => radios
		);

		// focus the 1 star rating
		const [radio] = select('[key="1-1"] [key="radio"]', radios);
		assert.exists(radio);
		(radio.properties as any).onFocus();
		radios = selectRadio(h);
		h.expect(
			() => (
				<div classes={[css.groupWrapper, null]}>
					{createGroup(1, false, true, [createRadio(undefined, '1-1', 1)])}
					{createGroup(2, false, false, [createRadio(undefined, '2-1', 4)])}
					{createGroup(3, false, false, [createRadio(undefined, '3-1', 3)])}
					{createGroup(4, false, false, [createRadio(undefined, '4-1', 4)])}
					{createGroup(5, false, false, [createRadio(undefined, '5-1', 5)])}
				</div>
			),
			() => radios
		);

		// select the value
		h.trigger('@radioGroup', 'onValue', '1-1');
		radios = selectRadio(h);
		h.expect(
			() => (
				<div classes={[css.groupWrapper, null]}>
					{createGroup(1, false, true, [createRadio(undefined, '1-1', 1)])}
					{createGroup(2, false, false, [createRadio(undefined, '2-1', 4)])}
					{createGroup(3, false, false, [createRadio(undefined, '3-1', 3)])}
					{createGroup(4, false, false, [createRadio(undefined, '4-1', 4)])}
					{createGroup(5, false, false, [createRadio(undefined, '5-1', 5)])}
				</div>
			),
			() => radios
		);

		// blur the 1 star rating
		(radio.properties as any).onBlur();
		radios = selectRadio(h);
		h.expect(
			() => (
				<div classes={[css.groupWrapper, null]}>
					{createGroup(1, false, false, [createRadio(undefined, '1-1', 1)])}
					{createGroup(2, false, false, [createRadio(undefined, '2-1', 4)])}
					{createGroup(3, false, false, [createRadio(undefined, '3-1', 3)])}
					{createGroup(4, false, false, [createRadio(undefined, '4-1', 4)])}
					{createGroup(5, false, false, [createRadio(undefined, '5-1', 5)])}
				</div>
			),
			() => radios
		);
	});

	it('focus can target full widget', () => {
		const h = harness(() => <Rate name="rate" allowClear={true} />, {
			middleware: [[i18n, i18nMiddlewareMock]]
		});
		h.expect(baseTemplate());

		let radios = selectRadio(h);
		h.expect(
			() => (
				<div classes={[css.groupWrapper, null]}>
					{createGroup(0, true, false, [createRadio(undefined, '', 0)])}
					{createGroup(1, false, false, [createRadio(undefined, '1-1', 1)])}
					{createGroup(2, false, false, [createRadio(undefined, '2-1', 4)])}
					{createGroup(3, false, false, [createRadio(undefined, '3-1', 3)])}
					{createGroup(4, false, false, [createRadio(undefined, '4-1', 4)])}
					{createGroup(5, false, false, [createRadio(undefined, '5-1', 5)])}
				</div>
			),
			() => radios
		);
		const [radio] = select('[key="1-1"] [key="radio"]', radios);
		assert.exists(radio);
		(radio.properties as any).onFocus();

		radios = selectRadio(h);
		h.expect(
			() => (
				<div classes={[css.groupWrapper, css.active]}>
					{createGroup(0, true, false, [createRadio(undefined, '', 0)])}
					{createGroup(1, false, false, [createRadio(undefined, '1-1', 1)])}
					{createGroup(2, false, false, [createRadio(undefined, '2-1', 4)])}
					{createGroup(3, false, false, [createRadio(undefined, '3-1', 3)])}
					{createGroup(4, false, false, [createRadio(undefined, '4-1', 4)])}
					{createGroup(5, false, false, [createRadio(undefined, '5-1', 5)])}
				</div>
			),
			() => radios
		);

		(radio.properties as any).onBlur();
		radios = selectRadio(h);
		h.expect(
			() => (
				<div classes={[css.groupWrapper, null]}>
					{createGroup(0, true, false, [createRadio(undefined, '', 0)])}
					{createGroup(1, false, false, [createRadio(undefined, '1-1', 1)])}
					{createGroup(2, false, false, [createRadio(undefined, '2-1', 4)])}
					{createGroup(3, false, false, [createRadio(undefined, '3-1', 3)])}
					{createGroup(4, false, false, [createRadio(undefined, '4-1', 4)])}
					{createGroup(5, false, false, [createRadio(undefined, '5-1', 5)])}
				</div>
			),
			() => radios
		);
	});

	it('renders with initial value', () => {
		const initialValue = 4;
		const h = harness(() => <Rate name="rate" initialValue={initialValue} />, {
			middleware: [[i18n, i18nMiddlewareMock]]
		});
		h.expect(baseTemplate().setProperty('@radioGroup', 'initialValue', `${initialValue}-1`));
	});

	it('renders with steps', () => {
		const initialValue = 3.75;
		const h = harness(
			() => <Rate name="rate" allowClear={true} steps={4} initialValue={initialValue} />,
			{
				middleware: [[i18n, i18nMiddlewareMock]]
			}
		);
		h.expect(baseTemplate().setProperty('@radioGroup', 'initialValue', `4-3`));
		const radios = selectRadio(h);
		h.expect(
			() => (
				<div classes={[css.groupWrapper, null]}>
					{createGroup(0, true, false, [createRadio(undefined, '', 0)])}
					{createGroup(1, false, false, [
						createRadio(undefined, '1-1', 0, 1, 4),
						createRadio(undefined, '1-2', 0, 2, 4),
						createRadio(undefined, '1-3', 0, 3, 4),
						createRadio(undefined, '1-4', 1, 0, 4)
					])}
					{createGroup(2, false, false, [
						createRadio(undefined, '2-1', 1, 1, 4),
						createRadio(undefined, '2-2', 1, 2, 4),
						createRadio(undefined, '2-3', 1, 3, 4),
						createRadio(undefined, '2-4', 2, 0, 4)
					])}
					{createGroup(3, false, false, [
						createRadio(undefined, '3-1', 2, 1, 4),
						createRadio(undefined, '3-2', 2, 2, 4),
						createRadio(undefined, '3-3', 2, 3, 4),
						createRadio(undefined, '3-4', 3, 0, 4)
					])}
					{createGroup(4, false, false, [
						createRadio(undefined, '4-1', 3, 1, 4),
						createRadio(undefined, '4-2', 3, 2, 4),
						createRadio(undefined, '4-3', 3, 3, 4),
						createRadio(undefined, '4-4', 4, 0, 4)
					])}
					{createGroup(5, false, false, [
						createRadio(undefined, '5-1', 4, 1, 4),
						createRadio(undefined, '5-2', 4, 2, 4),
						createRadio(undefined, '5-3', 4, 3, 4),
						createRadio(undefined, '5-4', 5, 0, 4)
					])}
				</div>
			),
			() => radios
		);
	});

	it('has hover state', () => {
		const renderCharacter = sinon.stub();
		const h = harness(() => <Rate name="rate">{renderCharacter}</Rate>, {
			middleware: [[i18n, i18nMiddlewareMock]]
		});
		h.trigger('@root', 'onpointerenter');
		h.expect(baseTemplate());

		const radios = selectRadio(h);
		const [radio] = select('@5-1', radios);
		assert.exists(radio);
		(radio.properties as any).onpointerenter();

		renderCharacter.reset();
		selectRadio(h);
		sinon.assert.callCount(renderCharacter, 5);
		sinon.assert.calledWithExactly(renderCharacter, true, 5, undefined, 5);

		h.trigger('@root', 'onpointerleave');
		renderCharacter.reset();
		selectRadio(h);
		sinon.assert.callCount(renderCharacter, 5);
		sinon.assert.calledWithExactly(renderCharacter, false, 5, undefined, undefined);
	});

	it('changes value', () => {
		const onValue = sinon.stub();
		const h = harness(() => <Rate name="rate" allowClear={true} onValue={onValue} />, {
			middleware: [[i18n, i18nMiddlewareMock]]
		});
		h.expect(baseTemplate());
		h.trigger('@radioGroup', 'onValue', '2-1');
		sinon.assert.calledWithExactly(onValue, 2);
		onValue.reset();
		h.trigger('@radioGroup', 'onValue', '');
		sinon.assert.calledWithExactly(onValue);
		onValue.reset();
		h.trigger('@radioGroup', 'onValue', '3-1');
		sinon.assert.calledWithExactly(onValue, 3);
		onValue.reset();
		const checkedStub = sinon.stub();
		const radios = selectRadio(h, undefined, checkedStub);
		const [radio] = select('[key="3-1"]', radios);
		assert.exists(radio);
		(radio.properties as any).onclick();
		sinon.assert.calledWithExactly(checkedStub, true);
	});

	it('changes stepped value', () => {
		const onValue = sinon.stub();
		const h = harness(() => <Rate name="rate" steps={2} onValue={onValue} />, {
			middleware: [[i18n, i18nMiddlewareMock]]
		});
		h.expect(baseTemplate());
		h.trigger('@radioGroup', 'onValue', '2-1');
		sinon.assert.calledWithExactly(onValue, 1.5);
		h.trigger('@radioGroup', 'onValue', '3-2');
		sinon.assert.calledWithExactly(onValue, 3);
	});
});
