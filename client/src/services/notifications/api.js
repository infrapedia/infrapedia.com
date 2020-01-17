import { Notification } from 'element-ui'

export function handleReqErrors(err) {
  Notification({
    type: 'error',
    message: err.message || err.data.m || err.data.message || '',
    title: 'Something wrong happened'
  })

  return err
}

export function handleReqSuccess(res) {
  if (res.data && res.data.m && res.n !== false) {
    Notification({
      type: 'success',
      message: res.data.m,
      title: 'Success!'
    })
  }
  return res
}
