import axios from 'axios'

let VueAxiosPlugin = {}

VueAxiosPlugin.install = (Vue, options) => {
  const defaultOptions = {
    // request interceptor handlers
    reqHandleFunc: config => config,
    reqErrorFunc: error => Promise.reject(error),
    // response interceptor handlers
    resHandleFunc: response => response,
    resErrorFunc: error => Promise.reject(error)
  }

  const initOptions = {
    ...defaultOptions,
    ...options
  }

  const service = axios.create(initOptions)

  // Add a request interceptor
  service.interceptors.request.use(
    config => initOptions.reqHandleFunc(config),
    error => initOptions.reqErrorFunc(error.response.data)
  )
  // Add a response interceptor
  service.interceptors.response.use(
    response => initOptions.resHandleFunc(response.data),
    error => initOptions.resErrorFunc(error.response.data)
  )

  Vue.prototype.$axios = service
}

// Auto-install
let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue
}

if (GlobalVue) GlobalVue.use(VueAxiosPlugin)

export default VueAxiosPlugin
