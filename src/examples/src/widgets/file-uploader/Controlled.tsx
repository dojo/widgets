import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import FileUploader from '@dojo/widgets/file-uploader';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Controlled({ middleware: { icache } }) {
	function validateFiles(files: File[]) {
		return files.map(function(file) {
			const valid = file.size <= 100 * 1024;

			return {
				...file,
				valid,
				message: valid ? 'File is valid!' : 'File is too big'
			};
		});
	}

	function onValue(files: File[]) {
		const validatedFiles = validateFiles(files).slice(0, 4);
		icache.set('files', validatedFiles);
	}

	const files = icache.getOrSet('files', []);

	return (
		<Example>
			<p>
				This Example widget fully controls the FileUploader widget. File size is limited to
				100KB and the total number of files is restricted to 3.
			</p>

			<FileUploader files={files} multiple onValue={onValue}>
				{{
					label: 'Controlled FileUploader'
				}}
			</FileUploader>
		</Example>
	);
});
