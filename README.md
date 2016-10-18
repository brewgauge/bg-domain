# bg-domain 

- __Sponsor:__ [nearForm][Sponsor]

The domain layer for the brewgauge system. It receives messages via hardware, parses the values and emits new messages for storage or consumption.  

- __Work in progress:__ This module is currently a work in progress.


## Install
To install, use npm

```
npm install
```

## Usage

```
var Domain = require('bg-domain')
var domain = new Domain(opts)

var opts = {
  url: 'mqtt://test.mosquitto.org',
  topic: 'brewgauge'
}

domain.on('connect', () => {
  // BG connected
})

domain.on('temperature', (msg) => {
  // Emitting a message with the calculated temperature
})

domain.on('err', (err) => {
  // error
})

// (...)

domain.end() // Call end when done
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
`adc_value` is mandatory. If the `checksum` is present, is verified.

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

## ADC to Celsius Conversion

The relation between resistance and temperature is, 

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

The temperature is the first solution of the quadratic equation. See [here][hwinfo] for info plus input hardware.

## License
Copyright (c) 2016, Marco Piraccini and other contributors.
Licensed under [MIT][License].

[Sponsor]: http://www.nearform.com/
[License]: ./LICENSE
[hwinfo]: https://www.picotech.com/library/application-note/pt100-platinum-resistance-thermometers
