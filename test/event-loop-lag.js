import test from 'ava'
import {debuglog} from 'util'
import {factory} from '../event-loop-lag.js'

const log = debuglog('event-loop-lag')

let counter = 0

let begin

const resetBegin = message => {
  log('%s: reset begin', message)
  begin = Date.now()
}

const heavy = () => {
  const label = `heavy ${counter ++}`
  const start = Date.now()
  log('%s starts at %s', label, start - begin)
  let i = 100000000
  let s = 0
  while (i --) {
    s += i
  }
  const end = Date.now()
  log('%s ends at %s, takes %sms, result %s',
    label, end - begin, end - start, s)
  return end - start
}

let APPROXIMATE_COST

test.before.cb(t => {
  resetBegin('before')
  // also use setTimeout to calculate time
  setTimeout(() => {
    const cost = heavy()
    setTimeout(() => {
      APPROXIMATE_COST = cost
      log('APPROXIMATE_COST: %s', APPROXIMATE_COST)
      t.end()
    })
  }, 0)
})

test.serial('typeof', t => {
  const lag = factory(100)
  t.true(typeof lag === 'function')
  t.true(typeof lag.destroy === 'function')
})

test.serial.cb('can indicate lag', t => {
  const lag = factory(100)
  heavy()
  setTimeout(() => {
    const delay = lag()
    log('lag: %s', delay)
    t.true(delay > APPROXIMATE_COST)
    t.end()
  })
})

test.serial.cb('compare with no weight', t => {
  const interval = 100
  const lag = factory(interval)
  heavy()
  setTimeout(() => {
    const delay = lag()
    log('lag after heavy: %s', delay)

    const safe_interval = interval * 2
    setTimeout(() => {
      const delay2 = lag()
      log('lag after nothing: %s', delay)
      t.true(delay > delay2)
      t.end()
    }, safe_interval)
  })
})

test.serial('TypeError', t => {
  t.throws(() => factory(), /interval must be a number/)
})

test.serial.cb('destroy()', t => {
  const interval = 100
  const lag = factory(interval)
  heavy()
  setTimeout(() => {
    const delay = lag()
    lag.destroy()
    log('lag before stopped: %s', delay)
    t.is(lag(), 0)

    const safe_interval = interval * 2

    setTimeout(() => {
      t.is(lag(), 0)
      setTimeout(() => {
        t.is(lag(), 0)
        t.end()
      }, safe_interval)
    }, safe_interval)
  })
})
