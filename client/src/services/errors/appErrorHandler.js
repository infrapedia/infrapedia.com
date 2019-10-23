function appErrorHandler(err, vm, info) {
  if (!err || !vm || !info) return
  console.error(err)
  console.info(info, vm)
}

export default appErrorHandler
