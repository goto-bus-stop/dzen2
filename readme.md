# dzen2

Use [dzen2](https://github.com/robm/dzen) as a Node.js stream.

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

<a id="api-dzen"></a>
### `stream = require('dzen2')(options)`

Spawn a dzen process.
`stream` is a stream, write strings to it to display them.

Options:

 * `spawn`: __*(Bool=true)*__ Whether to spawn a dzen process.
   Set to `false` if you want to pipe the dzen formatted `stream` to a separate dzen instance.
   If `true`, all options are also passed through to [spawn](#api-spawn).
 * `events`: __*(String)*__ List of events and actions. See [Events and actions](#events-and-actions).
 * `eventServer`: __*(Bool=false)*__ Enable [events server](#event-server). *Note: this options has been renamed from `events`.*

If `spawn` is true, the `stream` has a `process` property with the [spawn](#api-spawn)ed process.

<a id="api-spawn"></a>
### `pr = require('dzen2/spawn')(options)`

Spawn a dzen process.
Returns a plain [ChildProcess](https://nodejs.org/api/child_process.html#child_process_class_childprocess).
You can pipe a [`stream`](#api-dzen) to its stdin.

Options:

 * `path` - Path to the dzen2 binary to use.
   Defaults to [dzen2-bin](https://github.com/goto-bus-stop/dzen2-bin).
 * `foreground` - Foreground and text color. Use a symbolic name or a six-character #rrggbb hex code.
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
 * `dock` - Set to true to dock the window, eg for use as a taskbar or statusbar.
   Otherwise it'll show on top of other windows.

### Stream methods
#### `stream.setTitle(str)`

Set the contents of the title window.
Equivalent to `stream.write('^tw()' + str)`.

#### `stream.toggleCollapse()`

Toggle collapsed state of the secondary window.

#### `stream.collapse()`

Collapse the secondary window.

#### `stream.uncollapse()`

"Uncollapse" (expand) the secondary window.

#### `stream.toggleHide()`

Hide or show the title window.

#### `stream.hide()`

Hide the title window.
If the secondary window is uncollapsed, the secondary window will still be shown.

#### `stream.unhide()`

"Unhide" (show) the title window.

#### `stream.raise()`

Raise the window in front of all other windows.

#### `stream.lower()`

Lower the window behind all other windows.

#### `stream.scrollHome()`

Scroll the secondary window to the top.

#### `stream.scrollEnd()`

Scroll the secondary window to the bottom.

#### `stream.exit()`

Tell dzen to quit.

## Events and actions
This allows you to associate actions to events. Events and actions are separated by `=` and each pair is separaded by a `;`. If an event triggers more than one action, the actions are separated by `,`.

For example: `entertitle=uncollapse,unhide;button1=exec:xterm:firefox;` will uncollapse and unhide the window when the mouse enters the title and will execute `xterm` and `firefox` when the mouse button 1 is clicked.

For more information, see the "(2) Option '-e': Events and actions" section of the [dzen2 README].

## Clickable areas

The `^ca()` modifier allows for running commands when the enclosed text is clicked. `^ca(BTN, CMD)` marks the beggining of a clickable area which will call `CMD` when `BTN` is clicked in it. `^ca()` marks the end of the clickable area.

```js
var dzen2 = require('dzen2')
var stream = dzen2()
stream.write('^ca(1, firefox --new-tab npmjs.com/package/dzen2)click me^ca()')
```

For more information about clickable areas, see the "Interaction" section of the [dzen2 README].

### Event-server

When `eventServer` is set to `true`, the `emit()` function will be available inside `^ca()`.

```js
var dzen2 = require('dzen2')
var stream = dzen2({
  eventServer: true
})

stream.write('^ca(1, emit(hello))click me^ca()')
stream.on('hello', function () {
  console.log('hello from dzen!')
})
```

This internally this starts a tiny TCP server.
The `emit(event)` parts are rewritten to execute a node script that sends the event to the server.

```js
"^ca(1, emit(test-event))Test event^ca()"
// is equivelent to
"^ca(1, /usr/bin/node '/home/username/Projects/dzen2/send-command.js' 41481 'test-event')Test event^ca()"
```

## License

[MIT](./LICENSE)

[dzen2 README]: https://github.com/robm/dzen/blob/master/README
