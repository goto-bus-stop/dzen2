# dzen2

Use [dzen2](https://github.com/robm/dzen) as a Node.js duplex stream.

## Install

```bash
npm install --save dzen2
```

## Usage

```js
const dzen2 = require('dzen2')

const dz = dzen2({
  foreground: 'red',
  background: 'white'
})

dz.write('Hello world!')
setTimeout(() => {
  dz.write('Yes this is dog')
}, 3000)
```

## API

### `stream = dzen(options)`

Spawn a dzen process.
`stream` is a duplex stream, write strings to it to display them.

Options:

 * `foreground` - Foreground and text color. Use a symbolic name or a six-
   character #rrggbb hex code.
 * `background` - Background color.
 * `font` - Font.
 * `align` - Content alignment in the title window. `left`, `center` or `right`.
 * `titleWidth` - Width of the title window.
 * `secondaryAlign` - Content alignment in the secondary window. `left`, `center` or `right`.
 * `secondaryLines` - Amount of lines to show in the secondary window.
 * `menu` - Menu mode.
 * `persist` - Keep running for this amount of seconds after the input stream closes.
 * `x` - X position.
 * `y` - Y position.
 * `lineHeight` - Height in pixels of each line. Defaults to the font height + 2px.
 * `width` - Width.
 * `screen` - Xinerama screen number.

### `stream.setTitle(str)`

Set the contents of the title window.
Equivalent to `stream.write('^tw()' + str)`.

### `stream.toggleCollapse()`

Toggle collapsed state of the secondary window.

### `stream.collapse()`

Collapse the secondary window.

### `stream.uncollapse()`

"Uncollapse" (expand) the secondary window.

### `stream.toggleHide()`

Hide or show the title window.

### `stream.hide()`

Hide the title window.
If the secondary window is uncollapsed, the secondary window will still be shown.

### `stream.unhide()`

"Unhide" (show) the title window.

### `stream.raise()`

Raise the window in front of all other windows.

### `stream.lower()`

Lower the window behind all other windows.

### `stream.scrollHome()`

Scroll the secondary window to the top.

### `stream.scrollEnd()`

Scroll the secondary window to the bottom.

### `stream.exit()`

Tell dzen to quit.

## License

[MIT](./LICENSE)
