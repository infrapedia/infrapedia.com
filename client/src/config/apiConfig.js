import { getCookie } from '../helpers/cookies'

export var form
export var url
const apiConfig = {
  url: process.env.VUE_APP_INFRA_API,
  bearer: () => getCookie('auth.token-session')
}

export default apiConfig
