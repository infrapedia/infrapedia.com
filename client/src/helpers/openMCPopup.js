export default function openMCPopup() {
  window.dojoRequire(['mojo/signup-forms/Loader'], function(L) {
    L.start({
      baseUrl: 'mc.us20.list-manage.com',
      uuid: 'f43f7a1a03f4924061abd90c7',
      lid: 'a3ead10726',
      uniqueMethods: true
    })
  })
  document.cookie =
    'MCPopupClosed=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;'
  document.cookie =
    'MCPopupSubscribed=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;'
}
