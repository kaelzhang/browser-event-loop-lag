[![Build Status](https://travis-ci.org/kaelzhang/cross-event-loop-lag.svg?branch=master)](https://travis-ci.org/kaelzhang/cross-event-loop-lag)
[![Coverage](https://codecov.io/gh/kaelzhang/cross-event-loop-lag/branch/master/graph/badge.svg)](https://codecov.io/gh/kaelzhang/cross-event-loop-lag)
<!-- optional appveyor tst
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/kaelzhang/cross-event-loop-lag?branch=master&svg=true)](https://ci.appveyor.com/project/kaelzhang/cross-event-loop-lag)
-->
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/cross-event-loop-lag.svg)](http://badge.fury.io/js/cross-event-loop-lag)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/cross-event-loop-lag.svg)](https://www.npmjs.org/package/cross-event-loop-lag)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/cross-event-loop-lag.svg)](https://david-dm.org/kaelzhang/cross-event-loop-lag)
-->

# cross-event-loop-lag

Measures event loop lag on browsers or node.

Just a fork of [event-loop-lag](https://github.com/pebble/event-loop-lag) but works on both nodejs environment and browsers.

## Install

```sh
$ npm i cross-event-loop-lag
```

## Usage

```js
import {factory} from 'cross-event-loop-lag'

const interval = 50
const lag = factory(interval)

someHeavyMethod()
lag()  // 500, get the lag measurement
```

## factory(interval: number)

- **interval** `number` The number of milliseconds representing how often to refresh the event loop lag measurement.

Creates a function `lag` which can be invoked to return the latest lag measurement in ms. Besides, we can use `lag.destroy()` to stop the measuring and destroy the timer inside.

After `lag.destroy()`ed, `lag()` will always return `0`

```js
// Destroy the timer and stop measuring
lag.destroy()

lag() // 0
lag() // 0
```

## License

MIT
