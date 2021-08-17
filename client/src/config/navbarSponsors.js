const sponsors = []

const {
  VUE_APP_SPONSORS_0_src,
  VUE_APP_SPONSORS_0_url,
  VUE_APP_SPONSORS_0_alt,
  VUE_APP_SPONSORS_1_src,
  VUE_APP_SPONSORS_1_url,
  VUE_APP_SPONSORS_1_alt
} = process.env

if (
  VUE_APP_SPONSORS_0_src &&
  VUE_APP_SPONSORS_0_url &&
  VUE_APP_SPONSORS_0_alt
) {
  sponsors.push({
    url: VUE_APP_SPONSORS_0_url,
    src: VUE_APP_SPONSORS_0_src,
    alt: VUE_APP_SPONSORS_0_alt
  })
}

if (
  VUE_APP_SPONSORS_1_src &&
  VUE_APP_SPONSORS_1_url &&
  VUE_APP_SPONSORS_1_alt
) {
  sponsors.push({
    url: VUE_APP_SPONSORS_1_url,
    src: VUE_APP_SPONSORS_1_src,
    alt: VUE_APP_SPONSORS_1_alt
  })
}

// [
//   {
//     url: 'http://bit.ly/3mkhjdR',
//     alt: 'catchpoint advertiser',
//     src: 'https://cdn1.infrapedia.com/assets/img/catchpoint-logo.png'
//   },
//   {
//     url: 'https://www.edgeuno.com?ref=https://www.infrapedia.com',
//     alt: 'edgeuno advertiser',
//     src: 'https://cdn1.infrapedia.com/assets/img/dark-logo.png'
//   }
// ]

export default sponsors
