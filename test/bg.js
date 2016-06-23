'use strict'

var test = require('tape')
var mqtt = require('mqtt')
var BG = require('..')

var mqttUrl = 'mqtt://test.mosquitto.org'
var topic = 'brewgauge'

var opts = {
  url: mqttUrl,
  topic: topic
}

test('bg - Received correct temperature message', function (t) {
  var bg = new BG(opts)
  var client
  var received = false

  bg.on('connect', () => {
    console.log('BG connected, we can publish the message')
    client = mqtt.connect(mqttUrl)

    var sensorMessage = {
      remote_ip: '10.10.10.10',
      board_id: 3,
      channel_id: 2,
      adc_value: 2075
    }

    client.on('connect', function () {
      client.subscribe(topic)
      client.publish(topic, JSON.stringify(sensorMessage))
    })
  })

  bg.on('temperature', (msg) => {
    t.equals(msg.temperature, 70.830)
    received = true
  })

  setTimeout(() => {
    bg.end()
    client.end()
    if (!received) {
      t.fail('No message received')
    }
    return t.end()
  }, 500)
})

test('bg - Received wrong message, missing adc_value', function (t) {
  var bg = new BG(opts)
  var client
  var received = false

  bg.on('connect', () => {
    console.log('BG connected, we can publish the message')
    client = mqtt.connect(mqttUrl)

    // Message with no adc_value
    var sensorMessage = {
      remote_ip: '10.10.10.10'
    }

    client.on('connect', function () {
      client.subscribe(topic)
      client.publish(topic, JSON.stringify(sensorMessage))
    })
  })

  bg.on('err', (err) => {
    t.equals(err, 'Received message with noadc_value')
    received = true
  })

  setTimeout(() => {
    bg.end()
    client.end()
    if (!received) {
      t.fail('No message received')
    }
    return t.end()
  }, 500)
})

test('bg - Received wrong message, wrong adc_value', function (t) {
  var bg = new BG(opts)
  var client
  var received = false

  bg.on('connect', () => {
    console.log('BG connected, we can publish the message')
    client = mqtt.connect(mqttUrl)

    // Message with no adc_value
    var sensorMessage = {
      adc_value: 'xxxxxxxx'
    }

    client.on('connect', function () {
      client.subscribe(topic)
      client.publish(topic, JSON.stringify(sensorMessage))
    })
  })

  bg.on('err', (err) => {
    // t.equals(err, '[Error: Value xxxxxxxx is not a number]')
    received = true
  })

  setTimeout(() => {
    bg.end()
    client.end()
    if (!received) {
      t.fail('No expected error received')
    }
    return t.end()
  }, 1000)
})
