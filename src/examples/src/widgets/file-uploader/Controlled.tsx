import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import FileUploader, { FileWithValidation } from '@dojo/widgets/file-uploader';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Controlled({ middleware: { icache } }) {
	function validateFiles(files: FileWithValidation[]) {
		return files.map(function(file) {
			// Files bigger than 100KB are marked invalid
			const valid = file.size <= 100 * 1024;
			file.valid = valid;
			// Each file can include a message for the valid state as well as invalid
			file.message = valid ? 'File is valid' : 'File is too big';

			return file;
		});
	}

	// onValue receives any files selected from the file dialog or
	// dragged and dropped from the OS
	function onValue(files: File[]) {
		// Validation and manipulation of the selected files is done
		// entirely external to the FileUploader widget.
		// This line both validates the files and truncates the total count to 4.
		const validatedFiles = validateFiles(files).slice(0, 4);

		icache.set('files', validatedFiles);
	}

	// If FileUploader receives a value for `files` then it will only render that.
	// If it receives a falsy value then it will render whatever files the user selects.
	// To ensure no files are rendered pass an empty array.
	const files = icache.getOrSet('files', []);

	return (
		<Example>
			<FileUploader files={files} multiple onValue={onValue}>
				{{
					label: 'Controlled FileUploader'
				}}
			</FileUploader>
		</Example>
	);
});
