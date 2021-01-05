const { describe, it } = intern.getInterface('bdd');
import * as baseCss from '../../../common/styles/base.m.css';
import * as fixedCss from '../../styles/range-slider.m.css';
import * as themeCss from '../../../theme/default/range-slider.m.css';
import Label from '../../../label';
import RangeSlider from '../../index';
import assertationTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import harness from '@dojo/framework/testing/harness/harness';
import { tsx } from '@dojo/framework/core/vdom';
import { stub } from 'sinon';
import { stubEvent } from '../../../common/tests/support/test-helpers';
const { assert } = intern.getPlugin('chai');

const noop = () => {};

describe('RangeSlider', () => {
	const template = assertationTemplate(() => {
		return (
			<div
				key="root"
				classes={[undefined, themeCss.root, null, null, null, null, null, null]}
			>
				<div
					classes={[themeCss.inputWrapper, fixedCss.inputWrapperFixed]}
					onpointerenter={noop}
					onpointerleave={noop}
				>
					<input
						aria-describedby="min-label-test"
						aria-invalid={undefined}
						aria-labelledby="range-slider-test-label"
						aria-readonly={undefined}
						classes={[themeCss.input, fixedCss.nativeInput]}
						disabled={undefined}
						key="slider1"
						max="100"
						min="0"
						name="_min"
						onblur={noop}
						onfocus={noop}
						oninput={noop}
						readonly={undefined}
						required={undefined}
						step="1"
						styles={{
							clip: `rect(auto, 0px, auto, auto)`
						}}
						type="range"
						value="0"
					/>
					<div classes={baseCss.visuallyHidden} id="min-label-test" key="minimumLabel">
						Minimum
					</div>
					<input
						aria-labelledby="range-slider-test-label"
						aria-describedby="max-label-test"
						aria-invalid={undefined}
						aria-readonly={undefined}
						classes={[themeCss.input, fixedCss.nativeInput]}
						disabled={undefined}
						key="slider2"
						max="100"
						min="0"
						name="_max"
						onblur={noop}
						onfocus={noop}
						oninput={noop}
						readonly={undefined}
						required={undefined}
						step="1"
						styles={{
							clip: `rect(auto, auto, auto, 0px)`
						}}
						type="range"
						value="100"
					/>
					<div classes={baseCss.visuallyHidden} id="max-label-test" key="maximumLabel">
						Maximum
					</div>
					<div
						classes={[themeCss.filled, fixedCss.filledFixed]}
						key="track"
						styles={{
							left: '0%',
							width: '100%'
						}}
					/>
					<div
						key="leftThumb"
						classes={[
							themeCss.thumb,
							themeCss.leftThumb,
							undefined,
							fixedCss.thumbFixed
						]}
						styles={{
							left: '0%'
						}}
					/>
					<div
						key="rightThumb"
						classes={[
							themeCss.thumb,
							themeCss.rightThumb,
							undefined,
							fixedCss.thumbFixed
						]}
						styles={{
							left: '100%'
						}}
					/>
				</div>
			</div>
		);
	});

	it('renders', () => {
		const h = harness(() => <RangeSlider />);
		h.expect(template);
	});

	it('renders a label', () => {
		const h = harness(() => <RangeSlider>{{ label: 'label' }}</RangeSlider>);
		const testTemplate = template.prepend('@root', () => [
			<Label
				classes={undefined}
				variant={undefined}
				disabled={undefined}
				focused={false}
				hidden={undefined}
				key="label"
				readOnly={undefined}
				required={undefined}
				secondary={true}
				theme={undefined}
				valid={undefined}
				widgetId="range-slider-test-label"
			>
				label
			</Label>
		]);
		h.expect(testTemplate);
	});

	it('renders max and min constraints', () => {
		const h = harness(() => <RangeSlider min={10} max={1337} />);
		const testTemplate = template
			.setProperty('@slider1', 'min', '10')
			.setProperty('@slider1', 'max', '1337')
			.setProperty('@slider1', 'value', '10')
			.setProperty('@slider2', 'min', '10')
			.setProperty('@slider2', 'max', '1337')
			.setProperty('@slider2', 'value', '1337');
		h.expect(testTemplate);
	});

	it('renders with initialValue', () => {
		const h = harness(() => <RangeSlider initialValue={{ min: 10, max: 100 }} />);
		const testTemplate = template
			.setProperty('@track', 'styles', { left: '10%', width: '90%' })
			.setProperty('@leftThumb', 'styles', { left: '10%' })
			.setProperty('@slider1', 'value', '10')
			.setProperty('@slider2', 'value', '100');
		h.expect(testTemplate);
	});

	it('renders with controlled value', () => {
		const value = { min: 10, max: 100 };

		const h = harness(() => <RangeSlider initialValue={{ min: 20, max: 80 }} value={value} />);
		const testTemplate = template
			.setProperty('@track', 'styles', { left: '10%', width: '90%' })
			.setProperty('@leftThumb', 'styles', { left: '10%' })
			.setProperty('@slider1', 'value', '10')
			.setProperty('@slider2', 'value', '100');
		h.expect(testTemplate);
	});

	it('renders output', () => {
		const h = harness(() => <RangeSlider showOutput />);
		const testTemplate = template
			.setProperty('@root', 'classes', [
				undefined,
				themeCss.root,
				null,
				null,
				null,
				null,
				null,
				themeCss.hasOutput
			])
			.insertAfter('@rightThumb', () => [
				<output
					classes={[themeCss.output, null]}
					for="range-slider-test"
					styles={undefined}
					tabIndex={-1}
				>
					0, 100
				</output>
			]);
		h.expect(testTemplate);
	});

	it('renders output tooltip', () => {
		const h = harness(() => <RangeSlider showOutput outputIsTooltip />);
		const testTemplate = template
			.setProperty('@root', 'classes', [
				undefined,
				themeCss.root,
				null,
				null,
				null,
				null,
				null,
				themeCss.hasOutput
			])
			.insertAfter('@rightThumb', () => [
				<output
					classes={[themeCss.output, themeCss.outputTooltip]}
					for="range-slider-test"
					styles={{
						left: '50%'
					}}
					tabIndex={-1}
				>
					0, 100
				</output>
			]);
		h.expect(testTemplate);
	});

	it('renders focused when inputs focus', () => {
		const focusedTemplate = template.setProperty('@root', 'classes', [
			undefined,
			themeCss.root,
			null,
			themeCss.focused,
			null,
			null,
			null,
			null
		]);

		const h = harness(() => <RangeSlider />);
		h.trigger('@slider1', 'onfocus', stubEvent);
		h.expect(focusedTemplate);

		h.trigger('@slider1', 'onblur', stubEvent);
		h.expect(template);
	});

	it('calls event callbacks', () => {
		const onBlurStub = stub();
		const onFocusStub = stub();
		const onValueStub = stub();

		const h = harness(() => (
			<RangeSlider onBlur={onBlurStub} onFocus={onFocusStub} onValue={onValueStub} />
		));

		h.trigger('@slider1', 'onblur', stubEvent);
		h.trigger('@slider2', 'onblur', stubEvent);
		assert.isTrue(onBlurStub.calledTwice, 'onBlur called');

		h.trigger('@slider1', 'onfocus', stubEvent);
		h.trigger('@slider2', 'onfocus', stubEvent);
		assert.isTrue(onFocusStub.called, 'onFocus called');

		h.trigger('@slider1', 'oninput', stubEvent);
		h.trigger('@slider2', 'oninput', stubEvent);
		assert.isTrue(onValueStub.called, 'onValue called');
	});
});
