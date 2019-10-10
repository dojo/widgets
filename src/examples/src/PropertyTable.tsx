import { create, tsx } from '@dojo/framework/core/vdom';
import { PropertyInterface } from './properties.block';

interface PropertyTableProperties {
	props?: PropertyInterface[];
}

const factory = create().properties<PropertyTableProperties>();

export default factory(function PropertyTable({ properties }) {
	const { props } = properties();
	if (!props) {
		return null;
	}
	return (
		<div classes={["docs"]}>
			<h1>Properties</h1>
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Type</th>
						<th>Optional</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					{props.map((prop) => {
						return (
							<tr>
								<td>{prop.name}</td>
								<td>{prop.type}</td>
								<td>{`${prop.optional || 'false'}`}</td>
								<td>{prop.description}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
});
