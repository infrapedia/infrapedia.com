const infoMenuLinks = {
  info: [
    { label: 'About us', url: '/about', router: true, footer: true },
    { label: 'Blog', url: 'https://blog.infrapedia.com', openTab: true },
    {
      label: 'Services',
      url: '/services',
      router: true
    },
    {
      label: 'Sponsorships',
      url: '/sponsors',
      router: true
    },
    {
      label: 'Contact us',
      url: '/contact',
      router: true,
      footer: true
    },
    {
      label: 'Attributions',
      url: '/attributions'
    },
    {
      label: 'Advisory board',
      url: '/advisory-board',
      router: true
    }
  ],
  social: [
    {
      label: 'Facebook',
      icon: ['fab', 'facebook'],
      url: 'https://www.facebook.com/infrapediainc'
    },
    {
      label: 'Twitter',
      icon: ['fab', 'twitter'],
      url: 'https://www.twitter.com/infrapedia'
    },
    {
      label: 'Linkedin',
      icon: ['fab', 'linkedin'],
      url: 'https://www.linkedin.com/company/infrapedia'
    },
    {
      label: 'Instagram',
      icon: ['fab', 'instagram'],
      url: 'https://www.instagram.com/live.infrapedia/'
    }
  ]
}

export default infoMenuLinks
