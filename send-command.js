/**
 * Send click action events to a dzen event server.
 *
 *    node send-command.js $PORT $EVENT_NAME
 *
 * Used with dzen like
 *
 *    ^ca(/usr/bin/node /path/to/send-command.js 43545 some-event)click here^ca()
 *
 */

var net = require('net')
var args = process.argv.slice(2)
var port = parseInt(args[0], 10)
var event = args[1]

var client = net.connect(port, function () {
  client.end(event)
})
