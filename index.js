var spawn = require('child_process').spawn
var duplexify = require('duplexify')
var through = require('through2')

module.exports = function dzen2 (opts) {
  var args = serializeOptions(opts || {})

  var dz = spawn('dzen2', args)

  // Every `write()` call becomes a line.
  var input = through(function write (data, enc, cb) {
    var line = data.toString()
    cb(null, `${line}\n`)
  })
  input.pipe(dz.stdin)

  var stream = duplexify(input, dz.stdout)
  stream.process = dz
  stream.process.on('error', function (error) {
    stream.emit('error', error)
  })
  return stream
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
  return args
}
