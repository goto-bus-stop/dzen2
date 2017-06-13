var assert = require('assert')
var through = require('through2')
var shellEscape = require('any-shell-escape')
var spawn = require('./spawn')

var rxEvents = /\^ca\(([1-5]),\s*emit\(([^)]+)\)\)/g
var sendCommand = [process.argv[0], require.resolve('./send-command')]

module.exports = function dzen2 (opts) {
  opts = opts || {}

  var eventServer = opts.events && createEventServer()

  // Every `write()` call becomes a line.
  var stream = through(function write (data, enc, cb) {
    var line = data.toString()
    if (opts.events) {
      line = line.replace(rxEvents, convertEventString)
    }
    cb(null, line + '\n')
  })

  if (opts.spawn !== false) {
    var dz = spawn(opts)
    dz.on('error', function (error) {
      stream.emit('error', error)
    })
    stream.pipe(dz.stdin)
    stream.process = dz
  }

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

  if (eventServer) stream.on('close', function () {
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
    stream.write('^tw()' + title)
    return stream
  }
  function toggleCollapse () {
    stream.write('^togglecollapse()')
    return stream
  }
  function collapse () {
    stream.write('^collapse()')
    return stream
  }
  function uncollapse () {
    stream.write('^uncollapse()')
    return stream
  }
  function toggleHide () {
    stream.write('^togglehide()')
    return stream
  }
  function hide () {
    stream.write('^hide()')
    return stream
  }
  function unhide () {
    stream.write('^unhide()')
    return stream
  }
  function raise () {
    stream.write('^raise()')
    return stream
  }
  function lower () {
    stream.write('^lower()')
    return stream
  }
  function scrollHome () {
    stream.write('^scrollhome()')
    return stream
  }
  function scrollEnd () {
    stream.write('^scrollend()')
    return stream
  }
  function exit () {
    stream.write('^exit()')
    return stream
  }
}
