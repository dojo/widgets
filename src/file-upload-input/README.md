# @dojo/widgets/file-upload-input

Dojo's `FileUploadInput` provides an interface for managing file uploads using `<input type="file">`. This is a
controlled component that only provides file selection. The `FileUploader` widget provides more full-featured file
upload functionality. If you require more customization than `FileUploader` provides you can build a custom file
uploader widget based on `FileUploadInput`. You can provide a callback function to the `onValue` property to receive
a `File` array whenever files are selected.

## Features

- Single or multiple file upload
- Add files from OS-provided file selection dialog
- Add files with drag and drop
- Validation

### Keyboard features

- Trigger file selection dialog with keyboard

### i18n features

- Localized version of default labels for the button and DnD can be provided in nls resources
