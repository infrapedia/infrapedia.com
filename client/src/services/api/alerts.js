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

  form.append('phone', phone)
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

export const disableAlert = async ({ t, elemnt, email, phone, user_id }) => {
  url = `${apiConfig.url}/auth/alerts/disabled`
  form = new FormData()

  form.append('t', t)
  form.append('email', email)

  form.append('phone', phone)
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
