import { tsx } from '@dojo/framework/core/vdom';
import { assertion, renderer, wrap } from '@dojo/framework/testing/renderer';
import { Button } from '../../../button';
import { FileUploadInput } from '../../index';
import { Label } from '../../../label';
import { noop } from '../../../common/tests/support/test-helpers';

import bundle from '../../nls/FileUploadInput';
import * as baseCss from '../../../theme/default/base.m.css';
import * as buttonCss from '../../../theme/default/button.m.css';
import * as css from '../../../theme/default/file-upload-input.m.css';
import * as fixedCss from '../../styles/file-upload-input.m.css';
import * as labelCss from '../../../theme/default/label.m.css';

const { it, describe } = intern.getInterface('bdd');
const { messages } = bundle;

describe('FileUploadInput', function() {
	const WrappedRoot = wrap('div');
	const WrappedWrapper = wrap('div');
	const WrappedLabel = wrap('span');

	const baseRootProperties = {
		key: 'root',
		classes: [null, fixedCss.root, css.root, false, false],
		ondragenter: noop,
		ondragover: noop,
		ondrop: noop
	};

	const baseAssertion = assertion(function() {
		return (
			<WrappedRoot {...baseRootProperties}>
				<WrappedWrapper classes={[css.wrapper]}>
					<input
						key="nativeInput"
						accept={undefined}
						aria="hidden"
						classes={[baseCss.hidden]}
						click={noop}
						disabled={false}
						multiple={false}
						name={undefined}
						onchange={noop}
						required={false}
						type="file"
					/>
					<Button
						disabled={false}
						onClick={noop}
						theme={{
							'@dojo/widgets/button': {
								disabled: buttonCss.disabled,
								label: buttonCss.label,
								popup: buttonCss.popup,
								pressed: buttonCss.pressed,
								root: buttonCss.root
							}
						}}
					>
						{messages.chooseFiles}
					</Button>

					<WrappedLabel classes={[css.dndLabel]}>{messages.orDropFilesHere}</WrappedLabel>
				</WrappedWrapper>
			</WrappedRoot>
		);
	});

	it('renders', function() {
		const r = renderer(function() {
			return <FileUploadInput />;
		});

		r.expect(baseAssertion);
	});

	it('renders content', function() {
		const content = <div>some content</div>;

		const r = renderer(function() {
			return (
				<FileUploadInput>
					{{
						content
					}}
				</FileUploadInput>
			);
		});

		r.expect(baseAssertion.insertAfter(WrappedWrapper, () => [content]));
	});

	it('renders label', function() {
		const label = 'Widget label';

		const r = renderer(function() {
			return (
				<FileUploadInput>
					{{
						label
					}}
				</FileUploadInput>
			);
		});

		r.expect(
			baseAssertion.prepend(WrappedRoot, () => [
				<Label
					disabled={false}
					forId={'file-upload-input-test'}
					hidden={false}
					required={false}
					theme={{
						'@dojo/widgets/label': {
							active: labelCss.active,
							disabled: labelCss.disabled,
							focused: labelCss.focused,
							invalid: labelCss.invalid,
							readonly: labelCss.readonly,
							required: labelCss.required,
							root: labelCss.root,
							secondary: labelCss.secondary,
							valid: labelCss.valid
						}
					}}
					valid={true}
				>
					{label}
				</Label>
			])
		);
	});

	it('renders allowDnd=false', function() {
		const r = renderer(function() {
			return <FileUploadInput allowDnd={false} />;
		});

		r.expect(
			baseAssertion
				.setProperties(WrappedRoot, {
					...baseRootProperties,
					ondragenter: false,
					ondragover: false,
					ondrop: false
				})
				.remove(WrappedLabel)
		);
	});

	it('handles dragenter, dragleave, and the overlay', function() {
		const r = renderer(function() {
			return <FileUploadInput />;
		});
		const WrappedOverlay = wrap('div');

		r.expect(baseAssertion);
		r.property(WrappedRoot, 'ondragenter', { preventDefault: noop });

		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'classes', [
					null,
					fixedCss.root,
					css.root,
					css.dndActive,
					false
				])
				.append(WrappedRoot, function() {
					return [
						<WrappedOverlay
							key="overlay"
							classes={[fixedCss.dndOverlay, css.dndOverlay, false]}
							ondragleave={noop}
						/>
					];
				})
		);

		// TODO: enable when testing bug is fixed
		// https://github.com/dojo/framework/issues/839
		// r.property(WrappedOverlay, 'ondragleave');
		// r.expect(baseAssertion);
	});
});
