import EventEmitter from './EventEmitter'

const STORAGE_CHANGED = 'storage--changed'
const STORAGE_RESET = 'storage--reset'
const STORAGE_ITEM_ADDED = 'storage--item-added'
const STORAGE_ITEM_UPDATED = 'storage--item-updated'
const STORAGE_ITEM_REMOVED = 'storage--item-removed'
export const STORAGE__WATCH = 'storage--watcher--change-recorded'

const events = [
  STORAGE_CHANGED,
  STORAGE_RESET,
  STORAGE_ITEM_ADDED,
  STORAGE_ITEM_UPDATED,
  STORAGE_ITEM_REMOVED
]

export default class Dictionary extends EventEmitter {
  constructor({ debug } = { debug: false }) {
    super({ debug })
    this.__storage = {}
    this.__length = 0
  }

  _emitWatch() {
    this.emit(`${STORAGE__WATCH}`)
  }

  watchStorage() {
    for (let i = 0; i < events.length; i++) {
      this.on(events[i], this._emitWatch.bind(this))
    }
  }

  unwatchStorage() {
    for (let i = 0; i < events.length; i++) {
      this.off(events[i], this._emitWatch.bind(this))
    }
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

  async setFromCollectionList(list) {
    if (Array.isArray(list) && list.length > 0) {
      for await (let ft of list) {
        this.add(ft.properties.editorID, ft)
      }
    }
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
    this.emit(`${STORAGE_RESET}`)
  }

  set(dict) {
    if (dict) {
      this.__storage = dict
      this.__length = Object.keys(dict).length
      this.emit(`${STORAGE_CHANGED}`, this.getRaw())
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
      this.emit(`${STORAGE_ITEM_ADDED}`, item)
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
      this.emit(`${STORAGE_ITEM_REMOVED}`)
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
      this.emit(`${STORAGE_ITEM_UPDATED}`, item)
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
