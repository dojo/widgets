import { create, tsx } from '@dojo/framework/core/vdom';

interface ThemeTableProperties {
	themes?: string[];
}

const factory = create().properties<ThemeTableProperties>();

export default factory(function ThemeTable({ properties }) {
	const { themes } = properties();
	if (!themes) {
		return null;
	}
	return (
		<div>
			<h1>Themeable Classes</h1>
			<table>
				<thead>
					<tr>
						<th>Name</th>
					</tr>
				</thead>
				<tbody>
					{themes.map((className) => {
						return (
							<tr>
								<td>{`.${className}`}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
});
