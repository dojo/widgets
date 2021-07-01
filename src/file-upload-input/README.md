# @dojo/widgets/file-upload-input

Dojo's `FileUploadInput` provides an interface for managing file uploads supporting both `<input type="file">` and the
HTML Drag and Drop API. This is a controlled widget that only provides file selection. The `FileUploader` widget
provides more full-featured file upload functionality. If you require more customization than `FileUploader` provides
you can build a custom file uploader widget based on `FileUploadInput`. You can provide a callback function to the
`onValue` property to receive a `File` array whenever files are selected.

## Features

- Single or multiple file upload
- Add files from OS-provided file selection dialog
- Add files with drag and drop

### Keyboard features

- Trigger file selection dialog with keyboard

### i18n features

- Localized version of labels for the button and DnD can be provided in nls resources

## Drag and Drop

This widget uses the [HTML Drag and Drop API](https://developer.mozilla.org/docs/Web/API/HTML_Drag_and_Drop_API).

The entire widget is enabled as a drag and drop target for files from the OS. In order to provide a visual indicator
that the widget is ready to receive a drop, and to handle
[DragEvents](https://developer.mozilla.org/docs/Web/API/DragEvent) more smoothly as soon as a file is dragged over the
widget an overlay is displayed.
