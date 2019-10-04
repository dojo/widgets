import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Chip from '../index';

const factory = create({ icache });

export default factory(function App({ middleware: { icache } }) {
	const clickable = icache.getOrSet<number>('clickable', 0);
	const clickableWithIcon = icache.getOrSet<number>('clickableWithIcon', 0);
	const closed = icache.get<boolean>('closed');
	const customClosed = icache.get<boolean>('customClosed');
	const iconClosed = icache.get<boolean>('iconClosed');
	const clickableClosed = icache.get<boolean>('clickableClosed');
	const clickableClosedCount = icache.getOrSet<number>('clickableClosedCount', 0);
	return (
		<div>
			<h1>Basic examples</h1>
			<Chip label="Chip Example" />

			<h2>Icon</h2>
			<Chip label="Icon Example" icon="alertIcon" />

			<h2>VNode icon</h2>
			<Chip
				label="Custom Icon"
				icon={
					<div
						styles={{
							display: 'inline-block',
							width: '10px',
							height: '10px',
							backgroundColor: 'black'
						}}
					/>
				}
			/>

			<h1>Clickable examples</h1>
			<Chip
				label="Clickable"
				onClick={() => {
					icache.set('clickable', (icache.get<number>('clickable') || 0) + 1);
				}}
			/>
			<div>Clicked {String(clickable)} times</div>

			<h2>Icon</h2>
			<Chip
				label="Clickable With Icon"
				icon="alertIcon"
				onClick={() => {
					icache.set(
						'clickableWithIcon',
						(icache.get<number>('clickableWithIcon') || 0) + 1
					);
				}}
			/>
			<div>Clicked {String(clickableWithIcon)} times</div>

			<h2>Disabled example</h2>
			<Chip
				label="Disabled"
				disabled
				onClick={() => {
					window.alert('clicked');
				}}
			/>

			<h1>Closable examples</h1>
			{!closed && (
				<Chip
					label="Close me"
					onClose={() => {
						icache.set('closed', true);
					}}
				/>
			)}

			<h2>Alternate icons</h2>
			{!customClosed && (
				<Chip
					label="Close me"
					closeIcon="minusIcon"
					onClose={() => {
						icache.set('customClosed', true);
					}}
				/>
			)}
			{!iconClosed && (
				<Chip
					label="Close me"
					icon="plusIcon"
					closeIcon={
						<div
							styles={{
								display: 'inline-block',
								width: '10px',
								height: '10px',
								backgroundColor: 'black'
							}}
						/>
					}
					onClose={() => {
						icache.set('iconClosed', true);
					}}
				/>
			)}

			<h1>Clickable closable example</h1>
			{!clickableClosed && (
				<Chip
					label="Click or close"
					onClick={() => {
						icache.set(
							'clickableClosedCount',
							(icache.get<number>('clickableClosedCount') || 0) + 1
						);
					}}
					onClose={() => {
						icache.set('clickableClosed', true);
					}}
				/>
			)}
			<div>Clicked {String(clickableClosedCount)} times</div>
		</div>
	);
});
