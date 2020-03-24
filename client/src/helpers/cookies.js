export const setCookie = (cname, cvalue, exdays) => {
  const d = new Date()
  d.setTime(d.getTime() + Number(exdays) * 24 * 60 * 60 * 1000)
  const expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}

export const getCookie = cname => {
  let match = document.cookie.match(new RegExp('(^| )' + cname + '=([^;]+)'))
  if (match) return match[2]
}

export const deleteCookie = cname => {
  document.cookie = cname + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}

export const checkCookie = cname => {
  return getCookie(cname) ? true : false
}
