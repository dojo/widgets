import { tsx } from '@dojo/framework/core/vdom';
import { assertion, renderer, wrap } from '@dojo/framework/testing/renderer';
import { noop } from '@dojo/widgets/common/tests/support/test-helpers';
import FileUploader from '../../index';
import FileUploadInput from '../../../file-upload-input';

import * as css from '../../../theme/default/file-uploader.m.css';
import * as fileUploadInputCss from '../../../theme/default/file-upload-input.m.css';
import * as fileUploadInputFixedCss from '../../../file-upload-input/styles/file-upload-input.m.css';

const { after, afterEach, it, describe } = intern.getInterface('bdd');

describe('FileUploader', function() {
	const WrappedRoot = wrap('div');
	const WrappedFileUploadInput = wrap(FileUploadInput);

	const baseRootProperties = {
		key: 'root',
		classes: [null, fileUploadInputFixedCss.root, css.root, false]
	};
	const baseInputProperties = {
		accept: undefined,
		allowDnd: true,
		disabled: false,
		multiple: false,
		name: undefined,
		onValue: noop,
		required: false,
		theme: {
			'@dojo/widgets/file-upload-input': {
				disabled: fileUploadInputCss.disabled,
				dndActive: fileUploadInputCss.dndActive,
				dndLabel: fileUploadInputCss.dndLabel,
				dndOverlay: fileUploadInputCss.dndOverlay,
				root: fileUploadInputCss.root,
				wrapper: fileUploadInputCss.wrapper
			}
		}
	};

	const baseAssertion = assertion(function() {
		return (
			<WrappedRoot {...baseRootProperties}>
				<WrappedFileUploadInput {...baseInputProperties}>
					{{
						content: null
					}}
				</WrappedFileUploadInput>
			</WrappedRoot>
		);
	});

	it('renders', function() {
		const r = renderer(function() {
			return <FileUploader onValue={noop} />;
		});

		r.expect(baseAssertion);
	});
});
