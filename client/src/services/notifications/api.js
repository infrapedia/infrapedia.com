import { Notification } from 'element-ui'

export function handleReqErrors(err) {
  Notification({
    type: 'error',
    message: err.message,
    title: 'Something wrong happened'
  })

  return err
}

export function handleReqSuccess(res) {
  // Notification({
  //   type: 'success',
  //   message: 'Data loaded correctly',
  //   title: 'Success!'
  // })
  return res
}
