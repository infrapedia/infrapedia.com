import { Notification } from 'element-ui'

function appErrorHandler(err, vm, info) {
  if (!err || !vm || !info || err.message == 'Invalid state') return
  console.error(err)

  return Notification({
    type: 'error',
    message: err.message,
    title: 'Something wrong happened'
  })
}

export default appErrorHandler
