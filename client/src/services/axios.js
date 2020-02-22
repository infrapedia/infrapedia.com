import { create$Service } from '../plugins/axios'
import { handleReqErrors, handleReqSuccess } from './notifications/api'

const $axios = create$Service({
  // request interceptor handlers
  reqHandleFunc: config => config,
  reqErrorFunc: err => handleReqErrors(err),
  // response interceptor handlers
  resHandleFunc: res => handleReqSuccess(res),
  resErrorFunc: err => handleReqErrors(err),
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 3600000
})

export default $axios
