'use strict'

var roots = require('quadratic-roots')

/**
 * Convert the value read (ADC) to Ohoms
 */
function adcToOhms (adc) {
  var v = (adc * 5.0) / 4096.0
  return -1000 / ((0.0151762 * v) - 0.925443) - 1000
}

/**
 * Convert measured Ohms to Celsius. See http://www.picotech.com/applications/pt100.html
 * See also README.
 */
function ohmsToCelsius (ohms) {
  const A = 3.9083e-3
  const B = -5.775e-7
  const a = 100 * B
  const b = 100 * A
  const c = (100 - ohms)
  var t = roots(a, b, c)
  return (Math.round(t[1] * 1000) / 1000) // First root, 3 decimal digits
}

/**
 * Check the binary XOR with 10101010101
 */
function validateChecksum (value, checksum) {
  return (value ^ 0b10101010101) === checksum
}

/**
 * Convert the measured value (adc) to celsius (with 3 decimal digits)
 * An error is returned if the checksum is not valid.
 */
function adcToCelsius (value, checksum) {
  if (!validateChecksum(value, checksum)) {
    throw new Error(`Invalid checksum for value ${value} with checksum ${checksum}`)
  }
  var ohms = adcToOhms(value)
  return ohmsToCelsius(ohms)
}

module.exports = adcToCelsius
