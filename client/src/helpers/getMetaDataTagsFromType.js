function getMetaDataTagsFromSelectionType({ type, name, owners }) {
  const description = {
    ixps: `${name}, IXP information, cable systems and operators #internet #ixps`,
    cls: `${name}, CLS information, cable systems and operators #internet #cls`,
    cables: `${name}, a fiber optic submarine telecommunications cable system information, owned/operated by ${owners.join(
      ','
    )}`,
    fac: `${name}, Facility information, cable systems and operators #internet #facility`,
    org: `${name}, Organization information, cable systems and operators #internet #organization #org`
  }
  const typeClean = {
    title: name,
    t: ''
  }

  switch (type.toLowerCase().trim()) {
    case 'ixps':
      typeClean.title = `${typeClean.title} | Internet Exchange Point | IXP`
      typeClean.t = 'ixps'
      break
    case 'facility':
      typeClean.title = `${typeClean.title} | Facility`
      typeClean.t = 'fac'
      break
    case 'facilities':
      typeClean.title = `${typeClean.title} | Facility`
      typeClean.t = 'fac'
      break
    case 'cls':
      typeClean.title = `${typeClean.title} | Cable Landing Station | CLS`
      typeClean.t = 'cls'
      break
    case 'networks':
      typeClean.title = `${typeClean.title} | Organization`
      typeClean.t = 'org'
      break
    case 'groups':
      typeClean.title = `${typeClean.title} | Organization`
      typeClean.t = 'org'
      break
    case 'cable':
      typeClean.title = `${typeClean.title} | Submarine Cable System`
      typeClean.t = 'cables'
      break
    case 'cables':
      typeClean.title = `${typeClean.title} | Submarine Cable System`
      typeClean.t = 'cables'
      break
    case 'subsea cables':
      typeClean.title = `${typeClean.title} | Submarine Cable System`
      typeClean.t = 'cables'
      break
    case 'terrestrial networks':
      typeClean.title = `${typeClean.title} | Terrestrial Network System System`
      typeClean.t = 'cables'
      break
    case 'terrestrial':
      typeClean.title = `${typeClean.title} | Terrestrial Network System System`
      typeClean.t = 'cables'
      break
    case 'organizations':
      typeClean.title = `${typeClean.title} | Organization`
      typeClean.t = 'org'
      break
    case 'org':
      typeClean.title = `${typeClean.title} | Organization`
      typeClean.t = 'org'
      break
    case 'owners':
      typeClean.title = `${typeClean.title} | Organization`
      typeClean.t = 'org'
      break
    case 'partners':
      typeClean.title = `${typeClean.title} | Organization`
      typeClean.t = 'org'
      break
  }
  return {
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
      {
        // vmid: 'og:site_name',
        name: 'og:site_name',
        content: name
      },
      {
        // vmid: 'twitter:title',
        name: 'twitter:title',
        content: typeClean.title
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
}

export default getMetaDataTagsFromSelectionType
