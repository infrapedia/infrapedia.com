import axios from 'axios'

const VueAxiosPlugin = {}

export function createService(initOptions) {
  const service = axios.create(initOptions)
  // Add a request interceptor
  service.interceptors.request.use(
    config => initOptions.reqHandleFunc(config),
    error => initOptions.reqErrorFunc(error)
  )
  // Add a response interceptor
  service.interceptors.response.use(
    response => initOptions.resHandleFunc(response),
    error => initOptions.resErrorFunc(error)
  )

  return service
}

export function create$Service(initOptions) {
  const $service = axios.create(initOptions)
  // Add a request interceptor
  $service.interceptors.request.use(
    config => initOptions.reqHandleFunc(config),
    error =>
      initOptions.reqErrorFunc(
        error.response && error.response.data ? error.response.data : error
      )
  )
  // Add a response interceptor
  $service.interceptors.response.use(
    response =>
      initOptions.resHandleFunc(
        response && response.data ? response.data : response
      ),
    error =>
      initOptions.resErrorFunc(
        error.response && error.response.data ? error.response.data : error
      )
  )

  return $service
}

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

  Vue.prototype.axios = createService(initOptions)
  Vue.prototype.$axios = create$Service(initOptions)
}

export default VueAxiosPlugin
