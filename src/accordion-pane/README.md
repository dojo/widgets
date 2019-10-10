# @dojo/widgets/accordion-pane

Dojo's `AccordionPane` component can be used to show multiple pieces of content inside collapsible panes within a common parent component. It provides a mechanism of control over multiple child `TitlePane` components.

## Features

- Optionally supports multiple panes open at once

### Accessibility Features

An `AccordionPane` expects all children to be `TitlePane` components, and as such, supports standard keyboard navigation for toggling child content open or closed.

**TitleBar Events**:

- Space bar: toggles the pane content of a closeable child `TitlePane`
