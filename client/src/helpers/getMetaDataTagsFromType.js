import apiConfig from '../config/apiConfig'

export default async function getMetaDataTagsFromSelectionType({
  type,
  name,
  owners,
  url,
  slug
}) {
  const description = {
    ixps: `${name}, Internet Exchange (IXP) information, data center locations and members #internet #ixps`,
    cls: `${name}, CLS information, cable systems and operators #internet #cls`,
    subsea: `${name}, a fiber optic submarine telecommunications cable system information, owned/operated by ${owners
      .map(o => o.name)
      .join(', ')}`,
    terrestrial: `${name}, a fiber optic submarine telecommunications cable system information, owned/operated by ${owners
      .map(o => o.name)
      .join(', ')}`,
    fac: `${name}, data center facility information #internet #facility`,
    org: `${name}, Organization information, cable systems and operators #internet #organization #org`
  }
  const typeClean = {
    title: name,
    slug: '',
    t: ''
  }

  switch (type.toLowerCase().trim()) {
    case 'ixp':
      typeClean.title = `${typeClean.title} | Internet Exchange Point | IXP | Infrapedia`
      typeClean.t = 'ixps'
      typeClean.slug = `ixp-${slug}`
      break
    case 'facility':
      typeClean.title = `${typeClean.title} | Facility | Infrapedia`
      typeClean.t = 'fac'
      typeClean.slug = `facility-${slug}`
      break
    case 'cls':
      typeClean.title = `${typeClean.title} | Cable Landing Station | CLS | Infrapedia`
      typeClean.t = 'cls'
      typeClean.slug = `cls-${slug}`
      break
    case 'subsea-cable':
      typeClean.title = `${typeClean.title} | Submarine Cable System | Infrapedia`
      typeClean.t = 'subsea'
      typeClean.slug = `subsea-cable-${slug}`
      break
    case 'terrestrial-network':
      typeClean.title = `${typeClean.title} | Terrestrial Network System | Infrapedia`
      typeClean.t = 'terrestrial'
      typeClean.slug = `terrestrial-network-${slug}`
      break
    case 'networks':
      typeClean.title = `${typeClean.title} | Organization | Infrapedia`
      typeClean.t = 'org'
      break
    case 'groups':
      typeClean.title = `${typeClean.title} | Organization | Infrapedia`
      typeClean.t = 'org'
      break
    case 'organizations':
      typeClean.title = `${typeClean.title} | Organization | Infrapedia`
      typeClean.t = 'org'
      break
    case 'org':
      typeClean.title = `${typeClean.title} | Organization | Infrapedia`
      typeClean.t = 'org'
      break
    case 'owners':
      typeClean.title = `${typeClean.title} | Organization | Infrapedia`
      typeClean.t = 'org'
      break
    case 'partners':
      typeClean.title = `${typeClean.title} | Organization | Infrapedia`
      typeClean.t = 'org'
      break
  }

  const meta = {
    title: typeClean.title,
    meta: [
      {
        // vmid: 'keywords',
        name: 'keywords',
        content: `custom maps, fiber optics maps, internet infrastructure map, live map, consulting, data center, sponsorship, ads, telecommunications, capacity, internet, ${name}`
      },
      {
        // vmid: 'description',
        name: 'description',
        content: description[typeClean.t]
      },
      {
        // vmid: 'og:type',
        name: 'og:type',
        content: 'article'
      },
      {
        // vmid: 'og:title',
        name: 'og:title',
        content: typeClean.title
      },
      /// IF HUBERT EVER LEAVES INFRAPEDIA THIS SHOULD BE REMOVED
      {
        // vmid: 'og:title',
        name: 'fb:admins',
        content: '100006549764818'
      },
      {
        // vmid: 'description',
        name: 'og:description',
        content: description[typeClean.t]
      },
      {
        // vmid: 'og:site_name',
        name: 'og:site_name',
        content: 'Infrapedia'
      },
      {
        name: 'og:image',
        content:
          type == 'org'
            ? 'https://cdn1.infrapedia.com/assets/default.jpg'
            : `${apiConfig.url}/elm/map/${typeClean.slug}.jpg`
      },
      {
        name: 'og:image:width',
        content: '1200'
      },
      {
        name: 'og:image:height',
        content: '630'
      },
      {
        name: 'og:url',
        content: url
      },
      {
        // vmid: 'twitter:title',
        name: 'twitter:title',
        content: typeClean.title
      },
      {
        // vmid: 'twitter:title',
        name: 'twitter:card',
        content: 'summary_large_image'
      },
      {
        // vmid: 'twitter:title',
        name: 'twitter:description',
        content: description[typeClean.t]
      },
      {
        // vmid: 'twitter:site',
        name: 'twitter:site',
        content: '@infrapedia'
      },
      {
        // vmid: 'twitter:creator',
        name: 'twitter:creator',
        content: '@infrapedia'
      },
      {
        // vmid: 'content-language',
        name: 'content-language',
        content: 'en-US'
      }
    ]
  }
  return meta
}
