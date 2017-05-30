var net = require('net')
var args = process.argv.slice(2)
var port = parseInt(args[0], 10)
var event = args[1]

var client = net.connect(port, function () {
  client.end(event)
})
