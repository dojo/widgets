# @dojo/widgets/tab-container

Dojo's `TabContainer` widget provides a user interface capable of displaying tabbed content. The content shown at any given time is based on the children of the currently-selected tab button.

## Features

- Tab buttons can be positioned above, below, before, or after tab content
- Tabs can be closeable and disabled
- Completely keyboard accessible

### Keyboard Usage

`TabContainer` supports standard keyboard navigation for switching between and closing tabs.

**Tab Button Events**

- Escape key: closes a closeable tab
- Left Arrow: If tab buttons are aligned above or below content, requests to select the previous tab
- Right Arrow: If tab buttons are aligned above or below content, requests to select the next tab
- Up Arrow: If tab buttons are aligned before or after content, requests to select the previous tab
- Down Arrow: If tab buttons are aligned before or after content, requests to select the next tab
- Home key: Requests to select the first tab
- End key: Requests to select the last tab

### Accessibility Features

Beyond complete keyboard accessibility, `TabContainer` ensures that all appropriate ARIA attributes are included.
