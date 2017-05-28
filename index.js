var path = require('path')
var assert = require('assert')
var spawn = require('child_process').spawn
var duplexify = require('duplexify')
var through = require('through2')

var DZEN_PATH = path.join(__dirname, 'dzen/dzen2')

module.exports = function dzen2 (opts) {
  var args = serializeOptions(opts || {})

  var dz = spawn(DZEN_PATH, args)

  // Every `write()` call becomes a line.
  var input = through(function write (data, enc, cb) {
    var line = data.toString()
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

  return stream

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
