import { create, tsx } from '@dojo/framework/core/vdom';
import Icon from '@dojo/widgets/icon';
import icache from '@dojo/framework/core/middleware/icache';
import NativeSelect from '@dojo/widgets/native-select';
import Example from '../../Example';
import FloatingActionButton, {
	FloatingActionButtonPositions
} from '@dojo/widgets/floating-action-button';

const factory = create({ icache });

export default factory(function Direction({ middleware: { icache } }) {
	const position: FloatingActionButtonPositions | undefined = icache.getOrSet(
		'position',
		'bottom-right'
	);
	const size: 'small' | 'extended' | undefined = icache.getOrSet('size', undefined);
	return (
		<Example>
			<virtual>
				<FloatingActionButton position={position} size={size}>
					<Icon type="plusIcon" />
					{size === 'extended' ? <span>Extended</span> : undefined}
				</FloatingActionButton>
				<NativeSelect
					value={position || ''}
					options={[
						{ value: 'bottom-right' },
						{ value: 'bottom-center' },
						{ value: 'bottom-left' },
						{ value: 'left-center' },
						{ value: 'right-center' },
						{ value: 'top-right' },
						{ value: 'top-center' },
						{ value: 'top-left' },
						{ value: '', label: 'unset' }
					]}
					onValue={(position?: string) => {
						icache.set('position', position || undefined);
					}}
				>
					Position
				</NativeSelect>
				<NativeSelect
					value={size || ''}
					options={[
						{ value: 'small' },
						{ value: '', label: 'unset' },
						{ value: 'extended' }
					]}
					onValue={(size?: string) => {
						icache.set('size', size || undefined);
					}}
				>
					Size
				</NativeSelect>
			</virtual>
		</Example>
	);
});
