import $axios from '../axios'
import apiConfig from '../../config/apiConfig'
// eslint-disable-next-line
var url
var form

export const uploadOrgLogo = async ({ logo, user_id }) => {
  url = `${apiConfig.url}/auth/upload/logo`
  form = new FormData()
  form.append('file', logo)
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
