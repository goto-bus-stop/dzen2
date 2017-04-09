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

## Options

 * `foreground` - Foreground and text color. Use a symbolic name or a six-
   character #rrggbb hex code.
 * `background` - Background color.

## License

[MIT](./LICENSE)
