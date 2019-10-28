export const createBitlyURL = async (link, $axios) => {
  if (!$axios || !link) return

  const res = await $axios.post(
    'https://api-ssl.bitly.com/v4/shorten',
    {
      domain: 'bit.ly',
      long_url: link
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.VUE_APP_BITLINK_KEY}`,
        'Content-Type': 'application/json',
        withCredentials: true
      }
    }
  )

  return res
}
