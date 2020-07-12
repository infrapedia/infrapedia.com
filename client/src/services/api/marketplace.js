import $axios from '../axios'
import apiConfig from '../../config/apiConfig'

export const getMarketPlaceList = async () => {
  const res = await $axios.get(`${apiConfig.url}/marketplace/list`)
  return res
}

export const makeAnOffer = async ({
  name,
  email,
  subject,
  message,
  user_id
}) => {
  const form = new FormData()

  form.append('name', name)
  form.append('email', email)
  form.append('subject', subject)
  form.append('message', message)

  const res = await $axios.post(
    `${apiConfig.url}/auth/message/makeanoffer`,
    form,
    {
      withCredentials: true,
      headers: {
        userid: user_id,
        Authorization: 'Bearer ' + apiConfig.bearer()
      }
    }
  )
  return res
}
