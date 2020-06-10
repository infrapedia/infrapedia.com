import $axios from '../axios'
import apiConfig from '../../config/apiConfig'

export const checkUserVote = async user_id => {
  const res = await $axios.get(`${apiConfig.url}/auth/vote`, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

// eslint-disable-next-line
export const vote = async ({ user_id, votes }) => {
  const form = new FormData()
  form.append('votes', JSON.stringify(votes))

  const res = await $axios.post(`${apiConfig.url}/auth/vote`, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}
