import { create$Service } from '../plugins/axios'

const $axios = create$Service({
  // request interceptor handlers
  reqHandleFunc: config => config,
  reqErrorFunc: error => Promise.reject(error),
  // response interceptor handlers
  resHandleFunc: response => response,
  resErrorFunc: error => Promise.reject(error),
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 12000
})

export default $axios
