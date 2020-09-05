export function setCookie(cname, cValue, exDays) {
  const d = new Date()
  d.setTime(d.getTime() + Number(exDays) * 24 * 60 * 60 * 1000)
  const expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cValue + ';' + expires + ';path=/;secure'
}

export function getCookie(cname) {
  let match = document.cookie.match(new RegExp('(^| )' + cname + '=([^;]+)'))
  if (match) return match[2]
}

export function deleteCookie(cname) {
  document.cookie = cname + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}

export function checkCookie(cname) {
  return Boolean(getCookie(cname))
}
