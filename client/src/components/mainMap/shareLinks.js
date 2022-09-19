import { shareLink } from '../../services/api/shortener'
import copyToClipboard from '../../helpers/copyToClipboard'
import { getCookie } from '../../helpers/cookies'
import { queryCookieName } from '../../config/sharedViewCookieName'

export async function shareViewLink(user_id, link) {
  const res = await shareLink({
    url: encodeURI(link + getCookie(queryCookieName)),
    user_id
  })

  if (res && res.data && res.data.r) return copyToClipboard(res.data.r)
}

export async function shareViaWhatsApp(user_id, link) {
  const res = await shareLink({
    url: encodeURI(link + getCookie(queryCookieName)),
    user_id
  })
  if (res && res.data && res.data.r) {
    const r = `https://wa.me/?text=${res.data.r}`
    return r
  }
}

export async function shareViaTelegram(user_id, link) {
  const res = await shareLink({
    url: encodeURI(link + getCookie(queryCookieName)),
    user_id
  })
  if (res && res.data && res.data.r) {
    const r = `https://telegram.me/share/url?url=${res.data.r}`
    return r
  }
}

export async function shareViaSkype(user_id, link) {
  const res = await shareLink({
    url: encodeURI(link + getCookie(queryCookieName)),
    user_id
  })
  if (res && res.data && res.data.r) {
    const r = `https://web.skype.com/share?url=${res.data.r}`
    return r
  }
}

export async function shareViaFacebook(user_id, link) {
  const res = await shareLink({
    url: encodeURI(link + getCookie(queryCookieName)),
    user_id
  })
  if (res && res.data && res.data.r) {
    const r = `https://www.facebook.com/dialog/send?app_id=654189014992874&link=${res.data.r}`
    return r
  }
}

// export async function shareViaLinkedin(user_id, link, title) {
//   const res = await shareLink({
//     url: encodeURI(link + getCookie(queryCookieName)),
//     user_id
//   })
//   if (res && res.data && res.data.r) {
//     const encoded = encodeURIComponent(res.data.r)
//     const r = `https://www.linkedin.com/shareArticle/?mini=true&url=${encoded}&title=${title}&source=${encodeURIComponent(
//       'https://www.infrapedia.com'
//     )}`
//     return r
//   }
// }
