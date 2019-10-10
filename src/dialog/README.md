# @dojo/widgets/dialog

Dojo's `Dialog` component can be used to show content inside a window over top the application content. It provides default styling for a titlebar, content area, underlay, and a close button.

## Features

- Can be used as a modal window or classic dialog
- Possible to show a semi-transparent underlay
- Custom CSS animations can be provided

### Accessibility Features

- The titlebar and content have screen-reader-accessible labels and instructions
- The close button is a `<button>` with screen-reader-accessible instructive text

### i18n Features
- A localized version of the close button instructive text can be passed in via the `closeText` property.

## Themeing

The following CSS classes are used to style the `Dialog` widget and should be provided by custom themes:

- `close`: Applied to the close button in the titlebar
- `content`: Applied to content of the dialog window
- `main`: Applied to dialog window itself that includes both the titlebar and the content window
- `root`: Applied to the top-level wrapper node
- `title`: Applied to the titlebar of the dialog window
- `underlayVisible`: Applied to the application mask behind a dialog with an underlay
