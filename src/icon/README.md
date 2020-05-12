# @dojo/widgets/icon

Dojo's `Icon` widget renders one of Dojo's predefined font icons.

We use [font awesome](http://fontawesome.io/) for icons.
Where a theme requires specific icons that are not part of the Font Awesome set, then those themes will ship their own icons.

Icon fonts are generated using [IcoMoon](https://icomoon.io/app). If a new icon is required, it is possible to upload the current `dojoSelect.json` from `src/theme/fonts` and then add new icons by selecting from the Font Awesome library. After selecting the new icons from the library, merge them down into the current icon set, then delete the rest of the Font Awesome icons that were added by IcoMoon. After this you can export and download them as a zip. Once downloaded you will also need to unzip them and replace the font files (svg, woff, ttf) in `src/theme/fonts`. Now download the new selection JSON file from the `projects` page of IcoMoon and replace the current `dojoSelection.json` file.

To make use of the new icons it is necessary to update the `icon.m.css` file in the theme folder with the new unicode icon like so:

```css
.newIcon:before {
	content: "\f123";
}
```

Where `\f123` is the unicode character for the new icon. To check the new icon works you can render it in the `src/widgets/examples/icon/Basic.tsx` to make sure everything renders correctly.
