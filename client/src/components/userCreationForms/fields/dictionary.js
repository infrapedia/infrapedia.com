import Dictionary from '../../../lib/Dictionary'

export const categoriesDictionary = new Dictionary({
  debug: process.env.NODE_ENV != 'production'
})
