import { tsx } from '@dojo/framework/core/vdom';
import { assertion, renderer, wrap } from '@dojo/framework/testing/renderer';
import { Button } from '../../../button';
import { FileUploadInput } from '../../index';
import { noop } from '../../../common/tests/support/test-helpers';

import bundle from '../../nls/FileUploadInput';
import * as baseCss from '../../../theme/default/base.m.css';
import * as buttonCss from '../../../theme/default/button.m.css';
import * as css from '../../../theme/default/file-upload-input.m.css';
import * as fixedCss from '../../styles/file-upload-input.m.css';

const { it, describe } = intern.getInterface('bdd');
const { messages } = bundle;

describe('FileUploadInput', function() {
	const WrappedButton = wrap(Button);
	const WrappedDndLabel = wrap('span');
	const WrappedOverlay = wrap('div');

	const baseAssertion = assertion(function() {
		return (
			<div key="root" classes={[undefined, fixedCss.root, css.root, false, false]}>
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
				<WrappedButton
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
				</WrappedButton>
				<WrappedDndLabel classes={[css.dndLabel]}>
					{messages.orDropFilesHere}
				</WrappedDndLabel>
				<WrappedOverlay
					key="overlay"
					classes={[fixedCss.dndOverlay, css.dndOverlay, baseCss.hidden]}
				/>
			</div>
		);
	});

	it('renders', function() {
		const r = renderer(function() {
			return <FileUploadInput />;
		});

		r.expect(baseAssertion);
	});

	it('renders labels', function() {
		const buttonLabel = 'Button label';
		const dndLabel = 'Dnd label';

		const r = renderer(function() {
			return (
				<FileUploadInput>
					{{
						buttonLabel,
						dndLabel
					}}
				</FileUploadInput>
			);
		});

		r.expect(
			baseAssertion
				.setChildren(WrappedButton, () => [buttonLabel])
				.setChildren(WrappedDndLabel, () => [dndLabel])
		);
	});

	it('renders allowDnd=false', function() {
		const r = renderer(function() {
			return <FileUploadInput allowDnd={false} />;
		});

		r.expect(baseAssertion.remove(WrappedDndLabel).remove(WrappedOverlay));
	});
});
