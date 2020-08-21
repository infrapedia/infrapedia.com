import EventEmitter from './EventEmitter'

export default class Dictionary extends EventEmitter {
  constructor({ debug } = { debug: false }) {
    super({ debug })
    this.__storage = {}
    this.__length = 0
  }

  getCollectionList() {
    let arr = []
    for (let key in this.__storage) {
      if (this.__storage[key]) {
        arr.push(this.__storage[key])
      }
    }
    return arr
  }

  getRaw() {
    return this.__storage
  }

  getLength() {
    return this.__length
  }

  reset() {
    this.__storage = {}
    this.__length = 0
    this.emit('storage--reset')
  }

  set(dict) {
    if (dict) {
      this.__storage = dict
      this.__length = Object.keys(dict).length
      this.emit('storage--changed', this.getRaw())
    }
  }

  /**
   *
   * @param  { string } id
   * @param { object } item
   */
  add(id, item) {
    if (!this.__storage[id]) {
      this.__storage[id] = item
      this.__length++
      this.emit('storage--item-added', item)
    }
  }

  /**
   *
   * @param { string } id
   */
  remove(id) {
    if (this.__storage[id]) {
      delete this.__storage[id]
      this.__length--
    }
  }

  /**
   *
   * @param { string } id
   */
  get(id) {
    if (id) {
      return JSON.parse(JSON.stringify(this.__storage[id]))
    }
  }

  /**
   *
   * @param { string } id
   * @param { object } item
   */
  update(id, item) {
    if (id && item) {
      this.__storage[id] = item
      this.emit('storage--item-updated', item)
    }
  }

  /**
   *
   * @param { string } id
   */
  includes(id) {
    if (id) {
      let includesItem = false
      for (let key in this.__storage) {
        if (key == id) {
          includesItem = true
          break
        }
      }
      return includesItem
    }
  }
}
