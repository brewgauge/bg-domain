'use strict'

var mqtt = require('mqtt')
var adc2c = require('./lib/adcToCelsius')
var EventEmitter = require('events').EventEmitter
var util = require('util')

/**
 * Domain. Subscribe to the `topic` on a `url`,
 * when a message is received, enanche the message
 * calculating the temp and then push it through the web socket.
 */
function Domain (opts) {
  var self = this
  EventEmitter.call(this)
  self.client = mqtt.connect(opts.url)
  self.client.on('connect', function () {
    self.client.subscribe(opts.topic)
    self.emit('connect')
  })

  /**
   * Enhance the message and make it available.
   * If the message is not correct (wrong checksum, missing adc value), an error is pushed.
   * The message is expected to have a `adc_value` property. From that, a
   * `temperature` property is added.
   * When a message is received, a `temperature` message is emitted.
   * Listen for `err` events fo errors.
   */
  self.client.on('message', function (topic, message) {
    if (message) {
      var msg = JSON.parse(message.toString())
      if (msg.adc_value) {
        try {
          msg.temperature = adc2c(msg.adc_value, msg.checksum)
          self.emit('temperature', msg)
        } catch (err) {
          self.emit('err', err)
        }
      } else {
        var err = 'Received message with noadc_value'
        self.emit('err', err)
      }
    }
  })
}

util.inherits(Domain, EventEmitter)

Domain.prototype.end = function () {
  this.client.end()
  this.emit('end')
}

module.exports = Domain
