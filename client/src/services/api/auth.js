import $axios from '../axios'

const url = `https://${process.env.VUE_APP_AUTH0_DOMAIN}/api/v2/`
const defaultOptions = {
  audience: url,
  grant_type: 'client_credentials',
  client_id: process.env.VUE_APP_AUTH0_CLIENT,
  client_secret: process.env.VUE_APP_AUTH0_SECRET
}

export const getAccessToken = async () => {
  const res = await $axios
    .post('https://infrapedia.auth0.com/oauth/token', defaultOptions)
    .catch(err => console.error(err))
  return res
}

export const getUserData = async id => {
  const token = await getAccessToken()
  const res = $axios.get(`${url}users/${id}`, {
    headers: {
      Authorization: 'Bearer ' + token.access_token
    }
  })
  console.log(token)

  return res
}
