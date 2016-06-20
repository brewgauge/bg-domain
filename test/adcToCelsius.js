'use strict'

var test = require('tape')
var adcToCelsius = require('../lib/adcToCelsius')

test('ADC to Celsius - Wrong checksum', function (t) {
  adcToCelsius(2075, 20, (err, temp) => {
    if (!err) {
      t.fail('Wrong checksum ,an error should be generated')
    }
    t.end()
  })
})

test('ADC to Celsius - Correct conversion', function (t) {
  adcToCelsius(2075, 3406, (err, temp) => {
    t.error(err)
    console.log(typeof temp)
    t.equal(temp, 70.830, 'Check that the 2075 ADC => 47.939 C')
    t.end()
  })
})
