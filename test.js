var test = require('tape')

var dzen = function (opts) {
  opts = opts || {}
  opts.path = require.resolve('./mockdzen')
  return require('.')(opts)
}

test('.exit()', function (t) {
  t.plan(1)
  var dz = dzen()
  dz.on('data', (line) => {
    t.equal(line.toString(), '^exit()\n')
    dz.process.kill()
  })
  dz.exit()
})
