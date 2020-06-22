import { formatDate } from './formatDate'
import { DateTime } from 'luxon'

const backboneFormat = {
  title: 'Capacity Buy Request',
  date: '',
  small:
    'A Capacity purchase request has been received from the following user:',
  reference: '',
  Organization: ['company', ''],
  Name: ['fullname', ''],
  'E-mail address': ['email', ''],
  small_two: 'The user has the following request:',
  Element: ['element', ''],
  Type: ['type', ''],
  'Capacity requirement': ['capacity', 0],
  From: ['address.pointA', ''],
  To: ['address.pointB', ''],
  Message: ['message', '']
}
const transitFormat = {
  title: 'Transit Buy Request',
  date: '',
  small:
    'A Transit purchase request has been received from the following user:',
  reference: '',
  Organization: ['company', ''],
  Name: ['fullname', ''],
  'E-mail address': ['email', ''],
  small_two: 'The user has the following request:',
  Element: ['element', ''],
  Type: ['type', ''],
  'IP Transit': ['transitIP', ''],
  'Transit Capacity': ['capacity', 0],
  Message: ['message', '']
}
const dataCenterFormat = {
  title: 'Data Center Buy Request',
  date: '',
  small:
    'A Data Center purchase request has been received from the following user:',
  reference: '',
  Organization: ['company', ''],
  Name: ['fullname', ''],
  'E-mail address': ['email', ''],
  small_two: 'The user has the following request:',
  Element: ['element', ''],
  Type: ['type', ''],
  'Rack Total': ['totalRack', 0],
  'Custom Request': ['custom', false],
  Message: ['message', '']
}
const otherFormat = {
  title: 'General Buy Request',
  date: '',
  small:
    'A (general) purchase request has been received from the following user:',
  reference: '',
  Organization: ['company', ''],
  Name: ['fullname', ''],
  'E-mail address': ['email', ''],
  small_two: 'The user has the following request:',
  Element: ['element', ''],
  Type: ['type', ''],
  Message: ['message', '']
}
// eslint-disable-next-line
function createMessage({ data, format, userID }) {
  const date = formatDate(DateTime.local())
  let result = new Set()
  let pointA = null
  let pointB = null

  if (
    data.buyType.toLowerCase() == 'backbone' &&
    data.address.pointA &&
    data.address.pointB
  ) {
    pointA = data.address.pointA
    pointB = data.address.pointB
  }

  for (let formatKey in format) {
    for (let dataKey in data) {
      if (typeof otherFormat[formatKey] == 'string') {
        if (formatKey == 'date') {
          result.add(`<p style="font-size: 16px;"> Date: ${date}</p>`)
        } else if (formatKey == 'title') {
          result.add(
            `<h2 style="font-size= 24px;">${format[formatKey]}</h2><br/>`
          )
        } else if (formatKey == 'reference') {
          result.add(`<p style="font-size: 14px;">Reference: ${userID}</p>`)
        } else {
          result.add(
            `<p style="font-size: 14px; font-weight: bold; margin-top: 3rem;">${format[formatKey]}</p>`
          )
        }
      } else if (format[formatKey][0] == dataKey) {
        if (formatKey == 'Message') {
          result.add(
            `<p style="font-size: 14px;">${formatKey}:</p> <p style="font-size: 14px; white-space: pre-wrap;"> ${data[dataKey]}</p>`
          )
        } else {
          result.add(
            `<p style="font-size: 14px">${formatKey}: ${data[dataKey]}</p>`
          )
        }
      } else if (formatKey == 'From' || formatKey == 'To') {
        result.add(
          `<p style="font-size: 14px">${formatKey}: ${
            formatKey == 'To' ? pointB : pointA
          }</p>`
        )
      }
    }
  }
  return `${[...result].join('')}`
}
/**
 *
 * @param {Object } data - the form data been sent
 * @param { String } userID - this.$auth.user.sub - auth0 user id
 */
export default function buyMessageFormatter({ data, userID }) {
  let message = ''
  const args = {
    data,
    userID
  }
  switch (data.buyType.toLocaleLowerCase()) {
    case 'transit':
      message = createMessage({ ...args, format: transitFormat })
      break
    case 'datacenter':
      message = createMessage({ ...args, format: dataCenterFormat })
      break
    case 'other':
      message = createMessage({ ...args, format: otherFormat })
      break
    default:
      message = createMessage({ ...args, format: backboneFormat })
      break
  }
  return message
}
