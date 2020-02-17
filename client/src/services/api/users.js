import $axios from '../axios'
import apiConfig from '../../config/apiConfig'

// eslint-disable-next-line
var url
// var form

export const usersLogs = async ({ user_id }) => {
  url = `${apiConfig.url}/auth/user/logs`
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
