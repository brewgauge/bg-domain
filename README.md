# bgcore
It's a MQTT client that do the temperature calculation, converting the measured
ADC value (received from a MQTT broker) to Celsius when receiving messages.

## Usage
-----

```
var BG = require('bgcore')
var bg = new BG(opts)

var opts = {
  url: 'mqtt://test.mosquitto.org',
  topic: 'brewgauge'
}

bg.on('connect', () => {
  // BG connected
})

bg.on('temperature', (msg) => {
  // Emitting a message with the calculated temperature
})

bg.on('err', (err) => {
  // error
})

// (...)

bg.end() // Call end when done
```
Message received must be JSON string / buffers, with a numeric `adc_value` (otherwise an error is generated), e.g:

```
  var sensorMessage = {
    remote_ip: '10.10.10.10',
    board_id: 3,
    channel_id: 2,
    adc_value: 2075
  }
```
'adc_value' is mandatory. If the `checksum` is present, is verified.

When a message is receved, a `temperature` event is generated with the  new `temperature` property, e.g.:

```
  var sensorMessage = {
    remote_ip: '10.10.10.10',
    board_id: 3,
    channel_id: 2,
    adc_value: 2075,
    temperature: 70.340
  }
```

In the Browser
-----------

[TODO]

## ADC to Celsius Conversion

The relation between Resistance and temperature is (see for instance https://www.picotech.com/library/application-note/pt100-platinum-resistance-thermometers):

`Rt = R0 * (1 + A*t + B*t^2 + C*(t-100)* t^3)`

...where:

`C = 0, for  T > 0`

and

`R0 = 100`

...so:

`Rt = 100 * (1 + A*t + B*t^2)`

Or:

`B*t^2 + A*t + (1 - Rt / 100) = 0`

...which can be written:

`100*B*T^2 + A*100*t + (100 - Rt)`

...which is a quadratic equation, in the form:

`a*t^2 + b*t + c = 0`

where:

```
a = B = -5.775e-5
b = A = 0.39083
c = (100 - Rt)
```

The temperature is the first solution of the quadratic equation.

Acknowledgements
----------------

This project was kindly sponsored by [nearForm](http://nearform.com).
