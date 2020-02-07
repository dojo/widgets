const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import focus from '@dojo/framework/core/middleware/focus';
import createFocusMock from '@dojo/framework/testing/mocks/middleware/focus';
import { tsx } from '@dojo/framework/core/vdom';
import * as sinon from 'sinon';

import Label from '../../../label/index';
import Slider from '../../index';
import * as css from '../../../theme/default/slider.m.css';
import * as fixedCss from '../../styles/slider.m.css';
import {
	compareId,
	compareForId,
	createHarness,
	noop,
	stubEvent
} from '../../../common/tests/support/test-helpers';

const compareFor = {
	selector: '*',
	property: 'for',
	comparator: (property: any) => typeof property === 'string'
};
const harness = createHarness([compareId, compareForId, compareFor]);

const expected = function(
	label = false,
	tooltip = false,
	overrides = {},
	child = '0',
	progress = '0%',
	focused = false,
	showOutput = true,
	vertical = false
) {
	return assertionTemplate(() => (
		<div
			key="root"
			classes={[
				css.root,
				null,
				focused ? css.focused : null,
				null,
				null,
				null,
				vertical ? css.vertical : null,
				fixedCss.rootFixed
			]}
		>
			{label ? (
				<Label
					theme={undefined}
					classes={undefined}
					disabled={undefined}
					focused={focused}
					hidden={undefined}
					valid={undefined}
					readOnly={undefined}
					required={undefined}
					forId=""
				>
					foo
				</Label>
			) : null}
			<div
				assertion-key="inputWrapper"
				classes={[css.inputWrapper, fixedCss.inputWrapperFixed]}
				styles={vertical ? { height: '200px' } : {}}
			>
				<input
					key="input"
					classes={[css.input, fixedCss.nativeInput]}
					disabled={undefined}
					id=""
					focus={noop}
					aria-invalid={null}
					max="100"
					min="0"
					name={undefined}
					readOnly={undefined}
					aria-readonly={null}
					required={undefined}
					step="1"
					styles={vertical ? { width: '200px' } : {}}
					type="range"
					value="0"
					onblur={noop}
					onfocus={noop}
					oninput={noop}
					onpointerenter={noop}
					onpointerleave={noop}
					{...overrides}
				/>
				<div
					assertion-key="track"
					classes={[css.track, fixedCss.trackFixed]}
					aria-hidden="true"
					styles={vertical ? { width: '200px' } : {}}
				>
					<span
						assertion-key="fill"
						classes={[css.fill, fixedCss.fillFixed]}
						styles={{ width: progress }}
					/>
					<span
						assertion-key="thumb"
						classes={[css.thumb, fixedCss.thumbFixed]}
						styles={{ left: progress }}
					/>
				</div>
				{showOutput ? (
					<output
						assertion-key="output"
						classes={[css.output, tooltip ? css.outputTooltip : null]}
						for=""
						tabIndex={-1}
						styles={progress !== '0%' ? { left: progress } : {}}
					>
						{child}
					</output>
				) : null}
			</div>
		</div>
	));
};

registerSuite('Slider', {
	tests: {
		'default properties'() {
			const h = harness(() => <Slider />);
			h.expect(expected());
		},

		'custom properties'() {
			const h = harness(() => (
				<Slider
					aria={{ describedBy: 'foo' }}
					widgetId="foo"
					max={60}
					min={10}
					name="bar"
					output={() => 'tribbles'}
					outputIsTooltip
					step={5}
					initialValue={35}
				/>
			));

			h.expect(
				expected(
					false,
					true,
					{
						'aria-describedby': 'foo',
						id: 'foo',
						max: '60',
						min: '10',
						name: 'bar',
						step: '5',
						value: '35'
					},
					'tribbles',
					'50%'
				)
			);
		},

		'with showOutput false'() {
			const h = harness(() => <Slider showOutput={false} />);
			h.expect(expected(undefined, undefined, {}, undefined, undefined, undefined, false));
		},

		'focused class'() {
			const focusMock = createFocusMock();

			focusMock('input', true);

			const h = harness(() => <Slider />, {
				middleware: [[focus, focusMock]]
			});

			h.expect(expected(false, false, {}, '0', '0%', true));
		},

		'vertical slider': {
			'default properties'() {
				const h = harness(() => <Slider vertical />);

				h.expect(expected(false, false, {}, '0', '0%', false, true, true));
			},

			'custom properties'() {
				const h = harness(() => (
					<Slider
						max={10}
						min={5}
						outputIsTooltip
						initialValue={6}
						vertical
						verticalHeight="100px"
					/>
				));

				h.expect(
					expected(false, true, {}, '0', '0%', false, true, true)
						.setProperty('~inputWrapper', 'styles', { height: '100px' })
						.setProperty('@input', 'styles', { width: '100px' })
						.setProperty('@input', 'max', '10')
						.setProperty('@input', 'min', '5')
						.setProperty('@input', 'value', '6')
						.setProperty('@track', 'styles', { width: '100px' })
						.setProperty('~fill', 'styles', { width: '20%' })
						.setProperty('~thumb', 'styles', { left: '20%' })
						.setProperty('~output', 'styles', { top: '80%' })
						.setChildren('~output', ['6'])
				);
			}
		},

		'max value should be respected'() {
			const h = harness(() => <Slider max={40} initialValue={100} />);
			h.expect(
				expected()
					.setProperty('@input', 'value', '40')
					.setProperty('@input', 'max', '40')
					.setProperty('~fill', 'styles', { width: '100%' })
					.setProperty('~thumb', 'styles', { left: '100%' })
					.setChildren('~output', ['40'])
			);
		},

		'min value should be respected'() {
			const h = harness(() => <Slider min={30} initialValue={20} />);

			h.expect(
				expected()
					.setProperty('@input', 'value', '30')
					.setProperty('@input', 'min', '30')
					.setProperty('~fill', 'styles', { width: '0%' })
					.setProperty('~thumb', 'styles', { left: '0%' })
					.setChildren('~output', ['30'])
			);
		},

		label() {
			const h = harness(() => <Slider label="foo" />);

			h.expect(expected(true));
		},

		'state classes'() {
			let properties = {
				valid: false,
				disabled: true,
				readOnly: true,
				required: true
			};
			const h = harness(() => <Slider {...properties} />);

			h.expect(
				expected()
					.setProperty('@root', 'classes', [
						css.root,
						css.disabled,
						null,
						css.invalid,
						null,
						css.readonly,
						null,
						fixedCss.rootFixed
					])
					.setProperty('@input', 'aria-invalid', 'true')
					.setProperty('@input', 'aria-readonly', 'true')
					.setProperty('@input', 'readOnly', true)
					.setProperty('@input', 'required', true)
					.setProperty('@input', 'disabled', true)
			);

			properties = {
				valid: true,
				disabled: false,
				readOnly: false,
				required: false
			};

			h.expect(
				expected()
					.setProperty('@root', 'classes', [
						css.root,
						null,
						null,
						null,
						css.valid,
						null,
						null,
						fixedCss.rootFixed
					])
					.setProperty('@input', 'readOnly', false)
					.setProperty('@input', 'required', false)
					.setProperty('@input', 'disabled', false)
			);
		},

		events() {
			const onBlur = sinon.stub();
			const onFocus = sinon.stub();
			const onValue = sinon.stub();

			const h = harness(() => <Slider onBlur={onBlur} onFocus={onFocus} onValue={onValue} />);

			h.trigger('@input', 'onblur', stubEvent);
			assert.isTrue(onBlur.called, 'onBlur called');

			h.trigger('@input', 'onfocus', stubEvent);
			assert.isTrue(onFocus.called, 'onFocus called');

			h.trigger('@input', 'oninput', stubEvent);
			assert.isTrue(onValue.called, 'onValue called');
		}
	}
});
