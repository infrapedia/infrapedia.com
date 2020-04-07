function initFreshChat() {
  window.fcWidget.init({
    token: 'fdae290b-ee74-4ba6-9ebb-2e21d4e4ba6e',
    host: 'https://wchat.freshchat.com'
  })
}
function initialize(i, t) {
  var e
  i.getElementById(t)
    ? initFreshChat()
    : (((e = i.createElement('script')).id = t),
      (e.async = !0),
      (e.src = 'https://wchat.freshchat.com/js/widget.js'),
      (e.onload = initFreshChat),
      i.head.appendChild(e))
}
export default function initiateCall() {
  initialize(document, 'freshchat-js-sdk')
}
