export default class EventEmitter {
  constructor({ debug } = { debug: false }) {
    this._events = {}
    this.debug = debug
  }

  /**
   *
   * @param { string } name - listener name
   * @param { function } listener - handler
   */
  on(name, listener) {
    if (!this._events[name]) {
      this._events[name] = []
    }
    this._events[name].push(listener)
  }

  /**
   *
   * @param { string } name - listener name to remove
   * @param { function } listenerToRemove - handler being removed
   */
  off(name, listenerToRemove) {
    if (!this._events[name]) return
    const filterListeners = listener => listener !== listenerToRemove
    this._events[name] = this._events[name].filter(filterListeners)
  }
  /**
   *
   * @param { string } name - event name
   * @param { any } data - whatever you want to pass on
   */
  async emit(name, data) {
    if (!this._events[name]) return
    const fireCallbacks = async callback => {
      await callback(data)
    }

    for (let callback of this._events[name]) {
      if (this.debug) {
        console.log(
          '%cEMITTING EVENT-------------' + '%c' + name,
          'color: lightblue',
          'color: salmon'
        )
      }
      await fireCallbacks(callback)
    }
  }
}
