import $axios from '../axios'

export default async function getBlogPosts() {
  const res = await $axios.get(
    'https://blog.infrapedia.com/wp-json/wp/v2/posts'
  )
  return res
}
