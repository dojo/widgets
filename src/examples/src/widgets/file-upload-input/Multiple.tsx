import { create, tsx } from '@dojo/framework/core/vdom';
import { FileUploadInput } from '@dojo/widgets/file-upload-input';
import Example from '../../Example';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function Multiple({ middleware: { icache } }) {
	const selectedFiles: File[] = icache.getOrSet('selectedFiles', []);

	function onValue(files: File[]) {
		icache.set('selectedFiles', files);
	}

	return (
		<Example>
			<FileUploadInput onValue={onValue} multiple />
			{selectedFiles.length > 0 && (
				<table>
					<thead>
						<th>Name</th>
						<th>Modified</th>
						<th>Type</th>
						<th>Bytes</th>
					</thead>
					<tbody>
						{selectedFiles.map(function(file) {
							return (
								<tr key={file.name}>
									<td>{file.name}</td>
									<td>{new Date(file.lastModified).toLocaleString()}</td>
									<td>{file.type}</td>
									<td>{String(file.size)}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			)}
		</Example>
	);
});
