const NOOP = () => {}

export const factory = interval => {
  if (typeof interval !== 'number') {
    throw new TypeError('interval must be a number')
  }

  let start = Date.now()
  let delay = 0
  let timeout
  let stopped = false

  let check = () => {
    // workaround for https://github.com/joyent/node/issues/8364
    clearTimeout(timeout)

    if (stopped) {
      return
    }

    // how much time has actually elapsed in the loop beyond what
    // setTimeout says is supposed to happen. we use setTimeout to
    // cover multiple iterations of the event loop, getting a larger
    // sample of what the process is working on.
    const now = Date.now()

    // we use Math.max to handle case where timers are running efficiently
    // and our callback executes earlier than `interval` due to how timers are
    // implemented. this is ok. it means we're healthy.
    delay = Math.max(0, now - start - interval)
    start = now

    timeout = setTimeout(check, interval)
  }

  check()

  // return the loop delay in milliseconds
  const lag = () => delay

  lag.destroy = () => {
    delay = 0
    stopped = true
    check = null
    lag.stop = NOOP
  }

  return lag
}
