import $axios from '../axios'
import apiConfig from '../../config/apiConfig'

// eslint-disable-next-line
var url
var form

export const createAlert = async ({ t, elemnt, email, phone, user_id }) => {
  url = `${apiConfig.url}/auth/alerts/add`
  form = new FormData()

  form.append('t', t)
  form.append('email', email)

  form.append('phone', phone.num)
  form.append('elemnt', elemnt)

  const res = await $axios.post(url, form, {
    withCredentials: true,
    headers: {
      user_id,
      Authorization:
        'Bearer ' + window.localStorage.getItem('auth.token-session')
    }
  })

  return res
}

export const disableAlert = async ({ t, elemnt, user_id }) => {
  url = `${apiConfig.url}/auth/alerts/disabled`
  form = new FormData()

  form.append('t', t)
  form.append('elemnt', elemnt)

  const res = await $axios.patch(url, form, {
    withCredentials: true,
    headers: {
      user_id,
      Authorization:
        'Bearer ' + window.localStorage.getItem('auth.token-session')
    }
  })

  return res
}

export const configProviders = async data => {
  url = `${apiConfig.url}/auth/alerts/config/provider/email`
  form = new FormData()

  const { user_id, provider } = data
  let options = {}

  switch (provider) {
    case 'mandrill':
      options.from = data.email
      options.apiKey = data.apiKey
      break
    case 'sendgrip':
      options.from = data.email
      options.apiKey = data.apiKey
      break
    case 'mailgun':
      options.from = data.email
      options.apiKey = data.apiKey
      options.domain = data.domain
      options.region = data.region
      break
    case 'smtp':
      options.from = data.email
      options.host = data.host
      options.port = data.port
      options.username = data.username
      options.password = data.password
      break
  }

  form.append('provider', provider)
  form.append('options', JSON.stringify(options))

  const res = await $axios.post(url, form, {
    withCredentials: true,
    headers: {
      user_id,
      Authorization:
        'Bearer ' + window.localStorage.getItem('auth.token-session')
    }
  })

  return res
}

export const activeEmailProvider = async ({ user_id }) => {
  url = `${apiConfig.url}/auth/alerts/provider/email`

  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      user_id,
      Authorization:
        'Bearer ' + window.localStorage.getItem('auth.token-session')
    }
  })

  return res
}
