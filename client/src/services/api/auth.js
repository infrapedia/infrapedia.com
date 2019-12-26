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
    .post(
      'https://infrapedia.auth0.com/oauth/token',
      { ...defaultOptions },
      {
        'content-type': 'application/x-www-form-urlencoded'
      }
    )
    .catch(err => console.error(err))
  return res
}

export const getUserData = async id => {
  if (!id) {
    throw { message: 'There is no ID parameter being passed' }
  }
  const token = await getAccessToken()
  if (token && token.access_token) {
    const res = $axios.get(`${url}users/${id}`, {
      headers: {
        Authorization: 'Bearer ' + token.access_token
      }
    })
    return res
  }
}

export const updateUserData = async (data, user, isPassword) => {
  const token = await getAccessToken()
  if (!token || !user) return

  const provider = user.connection
  const dataUpdate = { ...data }

  if (!isPassword) {
    if (
      provider.includes('google-oauth') ||
      provider.includes('linkedin') ||
      provider.includes('facebook')
    ) {
      dataUpdate.user_metadata.name = dataUpdate.name
      dataUpdate.user_metadata.email = dataUpdate.email
      delete dataUpdate.name
      delete dataUpdate.email
      dataUpdate.connection = provider
    }
  }

  const res = await $axios.patch(
    `${url}users/${user._id}`,
    Object.keys(dataUpdate).length === 1 ? data : dataUpdate,
    {
      headers: {
        Authorization: 'Bearer ' + token.access_token
      }
    }
  )
  return res
}
