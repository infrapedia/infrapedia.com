import { shareLink } from '../../services/api/shortener'
import copyToClipboard from '../../helpers/copyToClipboard'

export async function shareViewLink(user_id) {
  const res = await shareLink({
    url: encodeURI(`${window.location.href}&hasToEase=true`),
    user_id
  })

  if (res && res.data && res.data.r) copyToClipboard(res.data.r)
}

export async function shareViaWhatsApp(user_id) {
  const res = await shareLink({
    url: encodeURI(`${window.location.href}&hasToEase=true`),
    user_id
  })
  if (res && res.data && res.data.r) {
    return copyToClipboard(`https://wa.me/?text=${res.data.r}`)
  }
}

export async function shareViaTelegram(user_id) {
  const res = await shareLink({
    url: encodeURI(`${window.location.href}&hasToEase=true`),
    user_id
  })
  if (res && res.data && res.data.r) {
    return copyToClipboard(`https://telegram.me/share/url?url=${res.data.r}`)
  }
}

export async function shareViaSkype(user_id) {
  const res = await shareLink({
    url: encodeURI(`${window.location.href}&hasToEase=true`),
    user_id
  })
  if (res && res.data && res.data.r) {
    return copyToClipboard(`https://web.skype.com/share?url=${res.data.r}`)
  }
}

export async function shareViaFacebook(user_id) {
  const res = await shareLink({
    url: encodeURI(`${window.location.href}&hasToEase=true`),
    user_id
  })
  if (res && res.data && res.data.r) {
    return copyToClipboard(
      `https://www.facebook.com/dialog/send?app_id=654189014992874&link=${res.data.r}`
    )
  }
}
