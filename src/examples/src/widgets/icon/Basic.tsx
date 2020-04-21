import { create, tsx } from '@dojo/framework/core/vdom';
import Icon from '@dojo/widgets/icon';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<div>
				<Icon type="downIcon" />
				<Icon type="leftIcon" />
				<Icon type="rightIcon" />
				<Icon type="closeIcon" />
				<Icon type="plusIcon" />
				<Icon type="minusIcon" />
				<Icon type="checkIcon" />
				<Icon type="upIcon" />
				<Icon type="upAltIcon" />
				<Icon type="downAltIcon" />
				<Icon type="searchIcon" />
				<Icon type="barsIcon" />
				<Icon type="settingsIcon" />
				<Icon type="alertIcon" />
				<Icon type="helpIcon" />
				<Icon type="infoIcon" />
				<Icon type="cancelIcon" />
				<Icon type="checkedBoxIcon" />
				<Icon type="phoneIcon" />
				<Icon type="editIcon" />
				<Icon type="dateIcon" />
				<Icon type="linkIcon" />
				<Icon type="locationIcon" />
				<Icon type="secureIcon" />
				<Icon type="mailIcon" />
				<Icon type="eyeIcon" />
				<Icon type="eyeSlashIcon" />
				<Icon type="starIcon" />
			</div>
		</Example>
	);
});
