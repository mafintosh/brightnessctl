#!/usr/bin/env node

if (process.getuid()) {
  console.error('Run as root')
  process.exit(1)
}

var diffy = require('diffy')()
var input = require('diffy/input')()
var fs = require('fs')
var path = require('path')

var FOLDER = '/sys/class/backlight/intel_backlight'
var BRIGHTNESS_FILE = path.join(FOLDER, 'brightness')
var MAX_BRIGHTNESS_FILE = path.join(FOLDER, 'max_brightness')
var MAX = readInt(MAX_BRIGHTNESS_FILE)

var pct = Math.floor(100 * readInt(BRIGHTNESS_FILE) / MAX)
var inc = 5

var ws = fs.createWriteStream(BRIGHTNESS_FILE)

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

diffy.render(render)

if (/^\d+?$/.test(process.argv[2])) {
  pct = parseInt(process.argv[2], 10)
  update()
  ws.end()
  ws.on('close', exit)
}

function exit () {
  process.exit(0)
}

function readInt (file) {
  return parseInt(fs.readFileSync(file, 'ascii'), 10)
}

function update () {
  ws.write('' + Math.max(1, Math.floor(pct / 100 * MAX)) + '\n')
  diffy.render()
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

  return  'Use <left> and <right> to adjust brightness\n' +
    slider + ' ' + (pct < 10 ? '  ' : (pct < 100 ? ' ' : '')) + pct + '%\n'
}

function noop () {}
