# @dojo/widgets/breadcrumb-group

Dojo's `BreadcrumbGroup` widget provides a means of displaying a list of breadcrumbs, either as static text or as links.

## Features

- Renders a list of links or static text from an `items` config property.
- Offers a custom renderer allowing users to create their own breadcrumb items and separators via the `<Breadcrumb>` and `<BreadcrumbSeparator>` widgets, respectively.

## Accessibility Features

- The breadcrumb group is labelled via a required `label` property.
- When supported by the user's assistive technology, the current breadcrumb will be called out. At present, breadcrumbs are assumed to represent individual pages. When representing steps in a process, a custom renderer should be used.
