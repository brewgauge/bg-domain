# bgcore
brewgauge core functions.

# Usage
See below for the documentation for each function

```
var bgcore = require('bgcore')

// (... get adc / checksum)

bgcore.adc2c(adc, checksum, (err, temp) {
  (...)
})
```

## adc2c
`adc2c`: convert the read value (adc) to Celsius degree. Works only for T > 100

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
