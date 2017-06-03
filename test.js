var test = require('tape')

var dzen = function (opts) {
  opts = opts || {}
  return require('.')(opts)
}

test('.exit()', function (t) {
  t.plan(1)
  var dz = dzen({ spawn: false })
  dz.on('data', (line) => {
    t.equal(line.toString(), '^exit()\n')
  })
  dz.exit()
})
