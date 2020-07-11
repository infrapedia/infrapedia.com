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
  'Location(s)': ['transitIP', ''],
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

function decomposeBuyMessage(msg, splitter) {
  const v = msg.split(splitter)
  return v[1]
}

function decomposeOldMessageFormat(item, format) {
  let data = decomposeBuyMessage(item.message, format).split(
    '<p style="font-size: 16px; color: #323232; text-transform: capitalize;">'
  )
  let data_type = data[1].split('asked to buy an amount')[1].split('for')
  let amount = data_type[0].split('of')[1]
  let type = data_type[1].split('.')[0].split('(')
  let locations = data[1].split('From pointA')
  let request = ''

  if (type.length >= 3) {
    type = type[2].split(')')[0]
  } else if (type.length == 2) {
    type = type[1].split(')')[0]
  }

  type = type.toLowerCase()

  if (type == 'backbone') {
    let points = locations[1].split('to')
    request = `<strong>Capacity requirement:</strong> ${amount}<p><strong>From:</strong> ${points[1].replace(
      'pointB',
      ''
    )}</p> <p> <strong>To:</strong> ${points[0].replace('to', '')}</p>`
  } else if (type == 'datacenter') {
    let facility = locations[0]
      .split('for')[1]
      .split('</p>')[0]
      .split('(')[0]

    request = `<strong>Data Center Space</strong> <br> <strong>Facility:</strong> ${facility} <br> <strong> Rack total: </strong> ${
      amount.split('rack total')[0]
    }`
  }
  return {
    request,
    rgDate: item.rgDate,
    status: item.status,
    message: item.message,
    subject: `${decomposeBuyMessage(item.message, format)
      .split('AI: asked to buy an amount of')[1]
      .split(').')[0] + ')'}`
  }
}

function decomposeNewMessageFormat(item, format) {
  let data = decomposeBuyMessage(item.message, format)
  let customRequest = item.message.includes('Custom Request: true')
  let request = data.split('Type:')[1].split('<p style="font-size: 14px">')[1]
  let rawR = data.split('Type:')[1].split('<p style="font-size: 14px">')[1]
  let element = decomposeBuyMessage(item.message, format)
    .split('Element:')[1]
    .split('<p style')[0]
  let type = item.message
    .split('Buy Request')[0]
    .split('">')[1]
    .trim()
    .replace(' ', '')
    .toLowerCase()

  if (type == 'datacenter') {
    if (customRequest) {
      request = `<strong>Data Center Space </strong> <br> <strong> Facility: </strong> ${element} <br> This request has custom requirements. <br> Contact Infrapedia's team for further assistance`
      rawR = `Data Center Space Custom Request for ${element.trim()}`
    } else {
      request = `<strong>Data Center Space</strong> <br> <strong> Facility: </strong> ${element} <strong>Rack Total: </strong> ${request
        .split(':')[1]
        .replace('</p>', '')}`
      rawR = `${rawR
        .split(':')[1]
        .replace('</p>', '')} racks total for ${element.trim()}`
    }
  } else if (type == 'capacity') {
    let from = item.message.split('From: ')[1].split('</p>')[0]
    let to = item.message.split('To: ')[1].split('</p>')[0]

    request = `<strong>Capacity requirement:</strong> ${request
      .split(':')[1]
      .replace(
        '</p>',
        ''
      )}<p><strong>From:</strong> ${from}</p> <p> <strong>To:</strong> ${to}</p>`

    rawR = `${rawR.split(':')[1].replace('</p>', '')} for ${element.trim()}`
  } else if (type == 'transit') {
    let cap = item.message.split('Transit Capacity: ')[1].split('</p>')[0]
    request = `<strong>IP Transit Capacity: </strong> ${cap} <br> <strong> Facility: </strong> ${element}`

    rawR = `${cap} for  ${decomposeBuyMessage(item.message, format)
      .split('Element:')[1]
      .split('<p style')[0]
      .replace('</p>', '')
      .trim()}`
  } else if (type == 'general') {
    request = `<strong> This a general request for: </strong> ${element} <br> Contact Infrapedia's team for further assistance`

    rawR = `General request for ${element.trim()}`
  } else return false

  return {
    request,
    subject: rawR,
    rgDate: item.rgDate,
    status: item.status,
    message: item.message
  }
}

export function formatMarketPlaceData(item) {
  const formats = {
    old: 'sent you a message: </p>',
    new: 'The user has the following request:</p>'
  }

  if (decomposeBuyMessage(item.message, formats.new)) {
    return decomposeNewMessageFormat(item, formats.new)
  } else if (decomposeBuyMessage(item.message, formats.old)) {
    return decomposeOldMessageFormat(item, formats.old)
  } else return false
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
