# @dojo/widgets/icon widget

Dojo 2's `Icon` widget renders an icon.


## Example Usage

*Basic Example*
```typescript
import Icon from '@dojo/widgets/icon';
import { w } from '@dojo/widget-core/d';

w(Icon, { type: 'downIcon', });
```

By default the icon will be rendered with `aria-hidden="true"`.
Custom aria attributes can be specified to override the default, and
text for screen readers can be provided via the `altText` property.

*Custom aria attributes Example*
```typescript
import Icon from '@dojo/widgets/icon';
import { w } from '@dojo/widget-core/d';

w(Icon, {
	type: 'downIcon',
	aria: {
		hidden: 'false',
		label: 'label'
	}
});
```


*Example with altText*
```typescript
import Icon from '@dojo/widgets/icon';
import { w } from '@dojo/widget-core/d';

w(Icon, {
	type: 'downIcon',
	altText: 'Go down'
});
```

## Theming

The following CSS classes are used to style the `Icon` widget and should be provided by custom themes:

- `root`: Applied to the top-level wrapper node
- `icon`: Applied to the icon node

*Icon Classes*
- `downIcon`: Applied to the same level as `icon` if `properties.type` is `'downIcon'`
- `leftIcon`: Applied to the same level as `icon` if `properties.type` is `'leftIcon'`
- `rightIcon`: Applied to the same level as `icon` if `properties.type` is `'rightIcon'`
- `closeIcon`: Applied to the same level as `icon` if `properties.type` is `'closeIcon'`
- `plusIcon`: Applied to the same level as `icon` if `properties.type` is `'plusIcon'`
- `minusIcon`: Applied to the same level as `icon` if `properties.type` is `'minusIcon'`
- `checkIcon`: Applied to the same level as `icon` if `properties.type` is `'checkIcon'`
- `upIcon`: Applied to the same level as `icon` if `properties.type` is `'upIcon'`
- `upAltIcon`: Applied to the same level as `icon` if `properties.type` is `'upAltIcon'`
- `downAltIcon`: Applied to the same level as `icon` if `properties.type` is `'downAltIcon'`
- `searchIcon`: Applied to the same level as `icon` if `properties.type` is `'searchIcon'`
- `barsIcon`: Applied to the same level as `icon` if `properties.type` is `'barsIcon'`
- `settingsIcon`: Applied to the same level as `icon` if `properties.type` is `'settingsIcon'`
- `alertIcon`: Applied to the same level as `icon` if `properties.type` is `'alertIcon'`
- `helpIcon`: Applied to the same level as `icon` if `properties.type` is `'helpIcon'`
- `infoIcon`: Applied to the same level as `icon` if `properties.type` is `'infoIcon'`
- `phoneIcon`: Applied to the same level as `icon` if `properties.type` is `'phoneIcon'`
- `editIcon`: Applied to the same level as `icon` if `properties.type` is `'editIcon'`
- `dateIcon`: Applied to the same level as `icon` if `properties.type` is `'dateIcon'`
- `linkIcon`: Applied to the same level as `icon` if `properties.type` is `'linkIcon'`
- `locationIcon`: Applied to the same level as `icon` if `properties.type` is `'locationIcon'`
- `secureIcon`: Applied to the same level as `icon` if `properties.type` is `'secureIcon'`
- `mailIcon`: Applied to the same level as `icon` if `properties.type` is `'mailIcon'`
