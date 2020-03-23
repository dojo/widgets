# @dojo/widgets/breadcrumb-group

Dojo's `BreadcrumbGroup` widget provides a means of displaying a list of breadcrumbs, either as static text or as links.

## Features

- Renders a list of links or static text from an `items` config property.
- Offers a custom renderer allowing users to create their own breadcrumb items.

## Accessibility Features

- The breadcrumb group is labelled via a required `label` property.
- When supported by the user's assistive technology, the current breadcrumb will be called out. At present, breadcrumbs are assumed to represent individual pages. When representing steps in a process, a custom renderer should be used (see below).

## Accessibility Concerns

- When using a custom renderer, be sure to mark the current item with `aria-current="page|step"`. The `<Breadcrumb>` widget current supports the "page" and "step" values. See the [WAI-ARIA specification](https://www.w3.org/TR/wai-aria-1.1/#aria-current) for more details.
- When displaying custom separators within a custom renderer, each separator should be marked as `aria-hidden="true"`. Note that screen readers will announce the contents of pseudo-elements.
