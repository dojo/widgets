# DOM structure

The only way to launch the operating system's file selection dialog is with the native `<input type="file">` element.
This element renders a button in the UI which is not very customizable. A hidden input can still be used to open the
dialog but you have to call its `click` method.

The overlay `<div>` provides a visual indicator that a drag operation is in progress.

The widget accepts children so that widgets using FileUploadInput can render file information within the bounds of
the FileUploadInput and when the overlay is displayed it will cover the children as well.

# Drag and Drop

https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API

DOM events are used directly because writing reactive middleware for this use-case ends up either very specific and not
widely useful, or if attempts are made to provide a general-purpose API the logic becomes very convoluted. Dealing with
a conditionally rendered overlay becomes a hassle as well.

The `dragenter` event must be listened for to detect when a drag enters the target area. At this point the overlay
should be rendered and it must have no children and must be the highest layer. If `dragenter` and `dragleave` event
listeners are added to an element with visible children then spurious enter/leave events are constantly triggered as
the cursor moves over children (even letters in text).

- `dragenter`: listened for on the root element at all times that DnD is allowed
  - makes the overlay visible to indicate DnD is active
- `dragover`: this event must be listened for, but nothing needs to be done with it other than `event.preventDefault()`
(the default action for DragEvents is to cancel the drag operation)
  - is listened for on the root since it bubbles from the overlay
- `dragleave`: listened for on the overlay since it is unreliable on the root element
  - when this event fires the overlay is hidden
- `drop`: listened for on the root since it bubbles from the overlay
  - get the files and update to indicate DnD is no longer active

# Validation

When the `accept` parameter is set on `<input type="file">` the dialog restricts which files can be selected. For
Drag and Drop the validation has to be done by the widget, otherwise any file will be accepted.
