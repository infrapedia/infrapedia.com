export var form
export var url
const apiConfig = {
  url: process.env.VUE_APP_INFRA_API,
  bearer: window.localStorage.getItem('auth.token-session') || null
}

export default apiConfig
