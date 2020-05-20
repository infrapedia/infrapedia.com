import apiConfig, { url, form } from '../../config/apiConfig'
import $axios from '../axios'

export const sendContactForm = async ({
  email,
  first_name,
  last_name,
  company,
  message
}) => {
  url = `${apiConfig.url}/contact`
  form = new FormData()

  form.append('email', email)
  form.append('first_name', first_name)
  form.append('last_name', last_name)
  form.append('company', company)
  form.append('message', message)

  const res = await $axios.post(url)
  return res
}

export const registerToNewsletter = async ({
  email,
  first_name,
  last_name
}) => {
  url = `${apiConfig.url}/newsletter`
  form = new FormData()

  form.append('email', email)
  form.append('first_name', first_name)
  form.append('last_name', last_name)

  const res = await $axios.post(url)
  return res
}
