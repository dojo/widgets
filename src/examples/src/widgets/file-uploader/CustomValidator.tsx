import { create, tsx } from '@dojo/framework/core/vdom';
import FileUploader from '@dojo/widgets/file-uploader';
import Example from '../../Example';

const factory = create();

export default factory(function CustomValidator() {
	function onValue() {
		// do something with files
	}

	function validateName(file: File) {
		if (file.name === 'validfile.txt') {
			return { valid: true };
		} else {
			return {
				message: 'File name must be "validfile.txt"',
				valid: false
			};
		}
	}

	return (
		<Example>
			<FileUploader customValidator={validateName} onValue={onValue}>
				{{
					label: 'Upload a file named "validfile.txt"'
				}}
			</FileUploader>
		</Example>
	);
});
