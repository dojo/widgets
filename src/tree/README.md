# @dojo/widgets/tree

Dojo's `Tree` widget provides fundamental support for rendering a list of heirarchical nodes - such as a file system or a table of contents - with custom node rendering support.

## Features

-   Accepts a flat data structure for easier implementation with relational data
-   Allows controlled and/or uncontrolled support for node selection and expansion
-   Allows a "checked" tree for gathering input selection of multiple nodes
-   Custom node render support with a sensible default renderer
-   (Standards-compliant)[https://www.w3.org/TR/wai-aria-practices/examples/treeview/treeview-2/treeview-2a.html] keyboard navigation

## Usage

-   `expandedNodes` and `checkedNodes` properties are intended for controlled use of the tree, while `initialExpanded` and `initialChecked` are intended for partial control. This means it will be up to the user updating the array passed to `expandedNodes` on the `onExpand` event to update the tree. With `initialExpanded` property, nodes passed to it will initially be expanded, and from then on the tree widget will handle the nodes expanding internally.
