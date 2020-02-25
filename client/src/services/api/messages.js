import $axios from '../axios'
import apiConfig from '../../config/apiConfig'

// eslint-disable-next-line
var url
var form

export const sendMessage = async ({
  user_id,
  t,
  elemnt,
  email,
  phone,
  message
}) => {
  url = `${apiConfig.url}/auth/message/send`
  form = new FormData()

  form.append('t', t)
  form.append('email', email)
  form.append('elemnt', elemnt)
  form.append('message', message)
  form.append('phone', phone.num)

  const res = await $axios.post(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization:
        'Bearer ' + window.localStorage.getItem('auth.token-session')
    }
  })
  return res
}

export const getMessages = async ({ page, user_id }) => {
  url = `${apiConfig.url}/auth/messages/sents?page=${page}`

  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization:
        'Bearer ' + window.localStorage.getItem('auth.token-session')
    }
  })

  return res
}

export const getMyMessages = async ({ page, user_id }) => {
  url = `${apiConfig.url}/auth/messages/mymessages?page=${page}`

  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization:
        'Bearer ' + window.localStorage.getItem('auth.token-session')
    }
  })

  return res
}

export const viewMessage = async ({ elemnt, id, user_id }) => {
  url = `${apiConfig.url}/auth/message/view/${elemnt}/${id}`

  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization:
        'Bearer ' + window.localStorage.getItem('auth.token-session')
    }
  })

  return res
}

export const deleteMessage = async ({ id, user_id }) => {
  url = `${apiConfig.url}/auth/message/delete/${id}`

  const res = await $axios.delete(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization:
        'Bearer ' + window.localStorage.getItem('auth.token-session')
    }
  })

  return res
}
