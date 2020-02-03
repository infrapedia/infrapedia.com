import $axios from '../axios'
import apiConfig from '../../config/apiConfig'

export const shareLink = async ({ user_id, url }) => {
  const form = new FormData()

  form.append('url', url)
  const res = await $axios.post(`${apiConfig.url}/auth/shortener/url`, form, {
    withCredentials: true,
    headers: {
      user_id,
      Authorization:
        'Bearer ' + window.localStorage.getItem('auth.token-session')
    }
  })

  return res
}
