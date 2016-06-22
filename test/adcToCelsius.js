'use strict'

var test = require('tape')
var adcToCelsius = require('../lib/adcToCelsius')

test('ADC to Celsius - Wrong checksum', function (t) {
  try {
    var temp = adcToCelsius(2075, 20)
    t.fail(`Wrong checksum ,an error should be generated, instead returned ${temp}`)
  } catch (error) {
    t.end()
  }
})

test('ADC to Celsius - Correct conversion', function (t) {
  try {
    var temp = adcToCelsius(2075, 3406)
    t.equal(temp, 70.830, 'Check that the 2075 ADC => 70.830 C') // TODO: Verify if this conversion is correct.
    t.end()
  } catch (error) {
    t.fail(error)
  }
})
