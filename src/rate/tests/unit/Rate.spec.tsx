import { SinonStub } from 'sinon';

const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';

import { RenderResult } from '@dojo/framework/core/interfaces';

import i18n from '@dojo/framework/core/middleware/i18n';
import { create, tsx } from '@dojo/framework/core/vdom';
import assertationTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import { HarnessAPI } from '@dojo/framework/testing/harness/harness';
import select from '@dojo/framework/testing/harness/support/selector';
import {
	compareTheme,
	createHarness,
	noop,
	isStringComparator
} from '../../../common/tests/support/test-helpers';
import * as baseCss from '../../../common/styles/base.m.css';
import * as css from '../../../theme/default/rate.m.css';
import Icon from '../../../icon';
import Radio from '../../../radio';
import RadioGroup, { RadioGroupProperties } from '../../../radio-group';
import Rate, { RateProperties } from '../../index';

const i18nFactory = create();
const format = (key: string, options?: Record<string, any>) => {
	if (options) {
		return `${key}&${Object.entries(options)
			.sort(([a], [b]) => {
				return a.localeCompare(b);
			})
			.map(([key, value]) => `${key}:${value}`)
			.join('&')}`;
	}
	return key;
};
const i18nMiddlewareMock = i18nFactory(() => ({
	localize() {
		return {
			format
		};
	}
}));

const harness = createHarness([
	compareTheme,
	{
		selector: '*',
		property: 'widgetId',
		comparator: isStringComparator
	}
]);

const selectRadio = (h: HarnessAPI, value?: string, checkedStub?: SinonStub) => {
	const options = h.trigger('@radioGroup', (node: any) => () => node.properties.options);
	return h.trigger(
		'@radioGroup',
		(node: any) => node.children[0].radios,
		'rate',
		(radioValue: string) => ({
			checked(checked?: boolean) {
				if (typeof checked === 'undefined') {
					return radioValue === value;
				}
				checkedStub && checkedStub(checked);
			}
		}),
		options
	);
};
const createStar = (integer: number, selected: boolean, children: RenderResult) => (
	<div
		key={integer}
		classes={[
			integer === 0 ? baseCss.visuallyHidden : null,
			css.star,
			selected ? css.selectedStar : null
		]}
	>
		{children}
	</div>
);
const createRadio = (
	properties: Partial<RateProperties> = {},
	value?: number,
	selected = false,
	filled = false
) => {
	const { disabled = false, readOnly = false } = properties;
	return (
		<div
			key={`${value === undefined ? '' : value}`}
			classes={[css.partial, selected ? css.selectedPartial : null]}
			onclick={noop}
			onpointerenter={noop}
		>
			<Radio
				widgetId=""
				key="radio"
				name="rate"
				checked={false}
				disabled={disabled || readOnly}
				onValue={noop}
				theme={{}}
				classes={{
					'@dojo/widgets/radio': {
						inputWrapper: [baseCss.visuallyHidden]
					},
					'@dojo/widgets/label': {
						root: [css.labelRoot, filled ? css.filled : css.empty]
					}
				}}
			>
				<virtual>
					<span key="radioLabel" classes={baseCss.visuallyHidden}>
						{format('starLabels', { rating: value || 0 })}
					</span>
					<span>
						<Icon theme={{}} type="starIcon" />
					</span>
				</virtual>
			</Radio>
		</div>
	);
};

describe('Rate', () => {
	const baseTemplate = (
		properties: Partial<RateProperties> = {},
		options: RadioGroupProperties['options'] = []
	) =>
		assertationTemplate(() => (
			<div
				key="root"
				focus={noop}
				classes={[
					undefined,
					css.root,
					properties.allowHalf ? css.halfStars : null,
					properties.readOnly ? css.readOnly : null,
					properties.disabled ? css.disabled : null
				]}
				onpointerleave={noop}
			>
				<RadioGroup
					key="radioGroup"
					initialValue={undefined}
					name="rate"
					onValue={noop}
					options={options}
					theme={{}}
				>
					{{ label: undefined, radios: () => [] }}
				</RadioGroup>
			</div>
		));

	it('renders', () => {
		const h = harness(() => <Rate name="rate" />, {
			middleware: [[i18n, i18nMiddlewareMock]]
		});
		const options = h.trigger('@radioGroup', (node: any) => () => node.properties.options);
		h.expect(baseTemplate(undefined, options));
		const radios = selectRadio(h);
		h.expect(
			() => [
				createStar(1, false, [createRadio(undefined, 1)]),
				createStar(2, false, [createRadio(undefined, 2)]),
				createStar(3, false, [createRadio(undefined, 3)]),
				createStar(4, false, [createRadio(undefined, 4)]),
				createStar(5, false, [createRadio(undefined, 5)])
			],
			() => radios
		);
	});

	it('renders with max', () => {
		const h = harness(() => <Rate name="rate" max={2} />, {
			middleware: [[i18n, i18nMiddlewareMock]]
		});
		const options = h.trigger('@radioGroup', (node: any) => () => node.properties.options);
		h.expect(baseTemplate(undefined, options));
		const radios = selectRadio(h);
		h.expect(
			() => [
				createStar(1, false, [createRadio(undefined, 1)]),
				createStar(2, false, [createRadio(undefined, 2)])
			],
			() => radios
		);
	});

	it('renders disabled', () => {
		const h = harness(() => <Rate name="rate" disabled />, {
			middleware: [[i18n, i18nMiddlewareMock]]
		});
		const options = h.trigger('@radioGroup', (node: any) => () => node.properties.options);
		const properties = { disabled: true };
		h.expect(baseTemplate(properties, options));
		const radios = selectRadio(h);
		h.expect(
			() => [
				createStar(1, false, [createRadio(properties, 1)]),
				createStar(2, false, [createRadio(properties, 2)]),
				createStar(3, false, [createRadio(properties, 3)]),
				createStar(4, false, [createRadio(properties, 4)]),
				createStar(5, false, [createRadio(properties, 5)])
			],
			() => radios
		);
	});

	it('renders readOnly which prevents allowClear', () => {
		const h = harness(() => <Rate name="rate" initialValue={1} readOnly allowClear />, {
			middleware: [[i18n, i18nMiddlewareMock]]
		});
		const options = h.trigger('@radioGroup', (node: any) => () => node.properties.options);
		const properties = { readOnly: true, initialValue: 1 };
		h.expect(baseTemplate(properties, options).setProperty('@radioGroup', 'initialValue', `1`));
		const radios = selectRadio(h);
		const [radio] = select('[key="1"]', radios);
		assert.exists(radio);
		(radio.properties as any).onclick();
		h.expect(
			() => [
				createStar(0, false, [createRadio(properties, undefined)]),
				createStar(1, true, [createRadio(properties, 1, true, true)]),
				createStar(2, false, [createRadio(properties, 2)]),
				createStar(3, false, [createRadio(properties, 3)]),
				createStar(4, false, [createRadio(properties, 4)]),
				createStar(5, false, [createRadio(properties, 5)])
			],
			() => radios
		);
	});

	it('renders with initial value', () => {
		const initialValue = 4;
		const h = harness(() => <Rate name="rate" initialValue={initialValue} />, {
			middleware: [[i18n, i18nMiddlewareMock]]
		});
		const options = h.trigger('@radioGroup', (node: any) => () => node.properties.options);
		h.expect(
			baseTemplate({ initialValue: 4 }, options).setProperty(
				'@radioGroup',
				'initialValue',
				`${initialValue}`
			)
		);
	});

	it('renders with partial stars', () => {
		const initialValue = 3.5;
		const h = harness(
			() => <Rate name="rate" allowClear allowHalf initialValue={initialValue} />,
			{
				middleware: [[i18n, i18nMiddlewareMock]]
			}
		);
		const options = h.trigger('@radioGroup', (node: any) => () => node.properties.options);
		h.expect(
			baseTemplate({ allowHalf: true, initialValue }, options).setProperty(
				'@radioGroup',
				'initialValue',
				`${initialValue}`
			)
		);
		const radios = selectRadio(h);
		h.expect(
			() => [
				createStar(0, false, [createRadio()]),
				createStar(1, false, [
					createRadio(undefined, 0.5, false, true),
					createRadio(undefined, 1, false, true)
				]),
				createStar(2, false, [
					createRadio(undefined, 1.5, false, true),
					createRadio(undefined, 2, false, true)
				]),
				createStar(3, false, [
					createRadio(undefined, 2.5, false, true),
					createRadio(undefined, 3, false, true)
				]),
				createStar(4, true, [
					createRadio(undefined, 3.5, true, true),
					createRadio(undefined, 4)
				]),
				createStar(5, false, [createRadio(undefined, 4.5), createRadio(undefined, 5)])
			],
			() => radios
		);
	});

	it('has hover state', () => {
		const renderCharacter = sinon.stub();
		const h = harness(() => <Rate name="rate">{{ character: renderCharacter }}</Rate>, {
			middleware: [[i18n, i18nMiddlewareMock]]
		});
		h.trigger('@root', 'onpointerenter');
		const options = h.trigger('@radioGroup', (node: any) => () => node.properties.options);
		h.expect(baseTemplate(undefined, options));

		const radios = selectRadio(h);
		const [radio] = select('@5', radios);
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
		const options = h.trigger('@radioGroup', (node: any) => () => node.properties.options);
		h.expect(baseTemplate(undefined, options));
		h.trigger('@radioGroup', 'onValue', '2');
		sinon.assert.calledWithExactly(onValue, 2);
		onValue.reset();
		h.trigger('@radioGroup', 'onValue', '');
		sinon.assert.calledWithExactly(onValue);
		onValue.reset();
		h.trigger('@radioGroup', 'onValue', '3');
		sinon.assert.calledWithExactly(onValue, 3);
		onValue.reset();
		const checkedStub = sinon.stub();
		const radios = selectRadio(h, undefined, checkedStub);
		const [radio] = select('[key="3"]', radios);
		assert.exists(radio);
		(radio.properties as any).onclick();
		sinon.assert.calledWithExactly(checkedStub, true);
	});

	it('changes value in with half stars', () => {
		const onValue = sinon.stub();
		const h = harness(() => <Rate name="rate" allowHalf onValue={onValue} />, {
			middleware: [[i18n, i18nMiddlewareMock]]
		});
		const options = h.trigger('@radioGroup', (node: any) => () => node.properties.options);
		h.expect(baseTemplate({ allowHalf: true }, options));
		h.trigger('@radioGroup', 'onValue', '1.5');
		sinon.assert.calledWithExactly(onValue, 1.5);
		h.trigger('@radioGroup', 'onValue', '3');
		sinon.assert.calledWithExactly(onValue, 3);
	});
});
