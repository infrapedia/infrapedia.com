export default class Dictionary {
  constructor({ levels } = { levels: 1 }) {
    this.__storage = {}
    this.levels = levels
    this.__length = Object.keys(this.__storage).length
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

  getLevels() {
    return this.levels
  }

  getLength() {
    return this.__length
  }

  reset() {
    this.__storage = {}
  }

  /**
   *
   * @param  { array } list
   * @param { string } key - ID property in string
   */
  set(list, key) {
    for (let item of list) {
      this.__storage[item[key]] = item
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
    }
  }

  /**
   *
   * @param { string } id
   */
  remove(id) {
    if (this.__storage[id]) {
      this.__storage[id] = undefined
    }
  }

  /**
   *
   * @param { string } id
   */
  get(id) {
    return this.__storage[id]
  }

  /**
   *
   * @param {string } id
   * @param { object } item
   */
  update(id, item) {
    this.__storage[id] = item
  }

  /**
   *
   * @param { string } id
   */
  includes(id) {
    let includesItem = false
    for (let key in this.__storage) {
      if (key == id) {
        includesItem = true
        break
      }
    }
    return includesItem
  }

  /**
   *
   * @param { array } list
   */
  setCollection(list) {
    console.log(list)
  }

  /**
   *
   * @param { string } parentID
   * @param { string } childrenID
   * @param { object } children
   */
  addChildren(parentID, childrenID, children) {
    if (this.levels != 2 || !this.__storage[parentID]) return
    // -------------------------------- //
    if (this.__storage[parentID].children) {
      if (!this.__storage[parentID].children[childrenID]) {
        this.__storage[parentID].children[childrenID] = children
      }
    } else {
      this.__storage[parentID].children = {}
      this.__storage[parentID].children[childrenID] = children
    }
  }

  /**
   *
   * @param { string } parentID
   * @param { string } childrenID
   * @param { object } children
   */
  updateChildren(parentID, childrenID, children) {
    if (this.levels != 2 || !this.__storage[parentID]) return
    // -------------------------------- //
    if (
      this.__storage[parentID].children &&
      this.__storage[parentID].children[childrenID]
    ) {
      this.__storage[parentID].children[childrenID] = children
    }
  }

  /**
   *
   * @param { string } parentID
   * @param { string } childrenID
   */
  removeChildren(parentID, childrenID) {
    if (this.levels != 2 || !this.__storage[parentID]) return

    if (
      this.__storage[parentID].children &&
      this.__storage[parentID].children[childrenID]
    ) {
      this.__storage[parentID].children[childrenID] = undefined
    }
  }
}

/**
 *  {
      id: '0104d32f43pew024ger3489',
      name: 'Test',
      color: '#ccccc',
      types: ['cls', 'ixps', 'subsea cables', 'custom lines'],
      children: {
        cls: {
          '0104d444d409pew024ger3484': {}
          '0104d444d409pew024ger3482': {}
          '0104d444d409pew024ger3349': {}
          '0104d444d409pew024ger3965': {}
        }
      },
      [...]
    }
 */
