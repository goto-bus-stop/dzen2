var path = require('path')
var assert = require('assert')
var spawn = require('child_process').spawn
var duplexify = require('duplexify')
var through = require('through2')
var shellEscape = require('any-shell-escape')
var DZEN_PATH = require('dzen2-bin')

var rxEvents = /\^ca\(([1-5]),\s*emit\(([^)]+)\)\)/g
var sendCommand = [process.argv[0], require.resolve('./send-command')]

module.exports = function dzen2 (opts) {
  opts = opts || {}
  var args = serializeOptions(opts)

  var dzenPath = opts.path || DZEN_PATH
  var dz = spawn(dzenPath, args)
  var eventServer = opts.events && createEventServer()

  // Every `write()` call becomes a line.
  var input = through(function write (data, enc, cb) {
    var line = data.toString()
    if (opts.events) {
      line = line.replace(rxEvents, convertEventString)
    }
    cb(null, line + '\n')
  })
  input.pipe(dz.stdin)

  var stream = duplexify(input, dz.stdout)
  stream.process = dz
  stream.process.on('error', function (error) {
    stream.emit('error', error)
  })
  stream.setTitle = setTitle
  stream.toggleCollapse = toggleCollapse
  stream.collapse = collapse
  stream.uncollapse = uncollapse
  stream.toggleHide = toggleHide
  stream.hide = hide
  stream.unhide = unhide
  stream.raise = raise
  stream.lower = lower
  stream.scrollHome = scrollHome
  stream.scrollEnd = scrollEnd
  stream.exit = exit

  dz.on('close', function () {
    eventServer.close()
  })

  return stream

  function convertEventString (_, button, args) {
    var command = sendCommand.concat([eventServer.address().port + ''])
    if (args) command.push(args)
    return '^ca(' + button + ', ' + shellEscape(command) + ')'
  }
  function createEventServer () {
    return require('net').createServer(function (socket) {
      var buffer = ''
      socket.on('data', function (chunk) { buffer += chunk })
      socket.on('end', function () {
        var args = buffer.split(',').map(function (str) {
          return str.trim()
        })
        stream.emit.apply(stream, args)
      })
    }).listen()
  }

  function setTitle (title) {
    assert.equal(typeof title, 'string')
    input.write('^tw()' + title)
    return stream
  }
  function toggleCollapse () {
    input.write('^togglecollapse()')
    return stream
  }
  function collapse () {
    input.write('^collapse()')
    return stream
  }
  function uncollapse () {
    input.write('^uncollapse()')
    return stream
  }
  function toggleSticky () {
    input.write('^togglestick()')
    return stream
  }
  function stick () {
    input.write('^stick()')
    return stream
  }
  function unstick () {
    input.write('^unstick()')
    return stream
  }
  function toggleHide () {
    input.write('^togglehide()')
    return stream
  }
  function hide () {
    input.write('^hide()')
    return stream
  }
  function unhide () {
    input.write('^unhide()')
    return stream
  }
  function raise () {
    input.write('^raise()')
    return stream
  }
  function lower () {
    input.write('^lower()')
    return stream
  }
  function scrollHome () {
    input.write('^scrollhome()')
    return stream
  }
  function scrollEnd () {
    input.write('^scrollend()')
    return stream
  }
  function exit () {
    input.write('^exit()')
    return stream
  }
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
