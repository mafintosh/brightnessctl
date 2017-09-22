#!/usr/bin/env node

if (process.getuid()) {
  console.error('Run as root')
  process.exit(1)
}

var diff = require('ansi-diff-stream')()
var input = require('neat-input')()
var fs = require('fs')

var FILE = '/sys/class/backlight/intel_backlight/brightness'
var MAX = 7500

var pct = Math.floor(100 * parseInt(fs.readFileSync(FILE, 'ascii'), 10) / MAX)
var inc = 5

var ws = fs.createWriteStream(FILE)

input.on('right', function () {
  pct += inc
  if (pct > 100) pct = 100
  update()
})

input.on('left', function () {
  pct -= inc
  if (pct < 0) pct = 0
  update()
})

diff.pipe(process.stdout)
render()

process.on('SIGWINCH', noop)
process.stdout.on('resize', onresize)

function update () {
  ws.write('' + Math.max(1, Math.floor(pct / 100 * MAX)) + '\n')
  render()
}

function onresize () {
  diff.clear()
  render()
}

function times (str, n) {
  var res = ''
  while (n--) res += str
  return res
}

function render () {
  var wid = Math.max(0, process.stdout.columns - 8)
  var widPct = Math.floor(wid * pct / 100)
  var slider = '[' + times('#', widPct) + times(' ', wid - widPct) + ']'

  diff.write(
    'Use <left> and <right> to adjust brightness\n' +
    slider + ' ' + (pct < 11 ? '  ' : (pct < 100 ? ' ' : '')) + pct + '%'
  )
}

function noop () {}
