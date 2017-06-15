var spawn = require('child_process').spawn

module.exports = function spawnDzen (opts) {
  var args = serializeOptions(opts || {})
  var dzenPath = opts && opts.path || require('dzen2-bin')

  return spawn(dzenPath, args)
}

function serializeOptions (opts) {
  var args = []
  if (opts.foreground) {
    args.push('-fg', opts.foreground)
  }
  if (opts.background) {
    args.push('-bg', opts.background)
  }
  if (opts.font) {
    args.push('-fn', opts.font)
  }
  if (opts.align) {
    args.push('-ta', opts.align[0])
  }
  if (opts.titleWidth) {
    args.push('-tw', opts.titleWidth)
  }
  if (opts.secondaryAlign) {
    args.push('-sa', opts.secondaryAlign[0])
  }
  if (opts.secondaryLines) {
    args.push('-l', opts.secondaryLines)
  }
  if (opts.menu) {
    args.push('-m')
  }
  if (opts.updateSimultaneous) {
    args.push('-u')
  }
  if (opts.persist) {
    args.push('-p', opts.persist)
  }
  if (opts.x) {
    args.push('-x', opts.x)
  }
  if (opts.y) {
    args.push('-y', opts.y)
  }
  if (opts.lineHeight) {
    args.push('-h', opts.lineHeight)
  }
  if (opts.width) {
    args.push('-w', opts.width)
  }
  if (opts.screen) {
    args.push('-xs', opts.screen)
  }
  if (opts.dock) {
    args.push('-dock')
  }
  if (opts.events && typeof opts.events === 'string') {
    args.push('-e', opts.events)
  }
  return args
}
