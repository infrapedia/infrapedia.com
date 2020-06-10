import { Notification } from 'element-ui'

function appErrorHandler(err, vm, info) {
  if (
    !err ||
    !vm ||
    !info ||
    err.message == 'Invalid state' ||
    err.message == 'a line needs to have two or more coordinates to be valid'
  )
    return

  return Notification({
    type: 'error',
    message: err.message,
    title: 'Something wrong happened'
  })
}

export default appErrorHandler
