# @dojo/widgets/title-pane

Dojo's `TitlePane` component can be used to display content inside a window with a titlebar. When the titlebar is clicked, the content collapses.

## Features

- Content can be prevented from collapsing
- Provides default styling for the titlebar and content area that responds responsively to different screen sizes

### Keyboard Usage

`TitlePane` supports standard keyboard navigation for toggling the content open or closed.

**TitleBar Events**:

- Space bar: toggles the pane content of a closeable `TitlePane`

### Accessibility Features

- The titlebar has a role of heading and accepts a `headingLevel` property to set the correct heading level
- The accordion panel has `aria-labelledby` set to the titlebar
- The accordion opens on Enter and Space
- `aria-expanded` is set to `true` or `false` on the toggle button depending on the `open` property
- `aria-controls` on the toggle button points to the accordion content
