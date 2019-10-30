// BUY REQUEST
import $axios from '../axios'

export const buyRequest = async data => {
  const { type, cable, email, lastname, name, capacity } = data

  const res = await $axios.post(
    'https://mandrillapp.com/api/1.0/messages/send.json',
    JSON.stringify({
      key: process.env.MANDRILL_KEY,
      message: {
        from_email: 'admin@infrapedia.net',
        to: [
          {
            email: 'admin@infrapedia.com',
            type: 'to'
          }
        ],
        headers: {
          'Reply-To': email
        },
        subject: `Infrapedia Buy Request - ${type} ${cable})`,
        text: `Hi, ${name} ${lastname} (${email})
        , you asked to buy an amount of ${capacity} for ${cable}(${type})`
      }
    })
  )

  return res
}

// ISSUE REQUEST

export const issueRequest = async data => {
  const res = await $axios.post(
    'https://mandrillapp.com/api/1.0/messages/send.json',
    JSON.stringify({
      key: process.env.VUE_APP_MANDRILL_KEY,
      message: {
        from_email: 'admin@infrapedia.net',
        to: [
          {
            email: 'admin@infrapedia.com',
            type: 'to'
          }
        ],
        headers: {
          'Reply-To': data.email
        },
        ...data.data
      }
    })
  )

  return res
}
