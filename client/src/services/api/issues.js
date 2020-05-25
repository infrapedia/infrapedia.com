import $axios from '../axios'
import apiConfig from '../../config/apiConfig'

// eslint-disable-next-line
var url
var form

export const createIssue = async ({
  t,
  elemnt,
  issue,
  email,
  phone,
  user_id
}) => {
  url = `${apiConfig.url}/issues/report`
  form = new FormData()

  form.append('t', t)
  form.append('email', email)
  form.append('phone', phone.num)
  form.append('elemnt', elemnt)
  form.append('issue', issue)

  const res = await $axios.post(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export const getIssues = async ({ page, user_id }) => {
  url = `${apiConfig.url}/auth/issues/reports?page=${page}`

  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export const getMyIssues = async ({ page, user_id }) => {
  url = `${apiConfig.url}/auth/issues/myreports?page=${page}`

  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export const viewIssue = async ({ elemnt, id, user_id }) => {
  url = `${apiConfig.url}/auth/issues/view/${elemnt}/${id}`

  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export const deleteIssue = async ({ id, user_id }) => {
  url = `${apiConfig.url}/auth/issues/delete/${id}`

  const res = await $axios.delete(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}
