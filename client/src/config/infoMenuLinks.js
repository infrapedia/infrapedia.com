const infoMenuLinks = {
  info: [
    { label: 'About us', url: 'https://www.infrapedia.com/', openTab: !0 },
    {
      label: 'List your business',
      url: 'https://www.infrapedia.com/yourbusiness',
      openTab: !0
    },
    { label: 'FAQ', url: 'https://www.infrapedia.com/faq', openTab: !0 },
    { label: 'Blog', url: '/blog', openTab: false, router: true },
    {
      label: 'Contact us',
      url: 'mailto:admin@infrapedia.com',
      openTab: !0
    },
    {
      label: 'Attributions',
      url: 'https://github.com/infrapedia/public/blob/master/attributions',
      openTab: !0
    }
  ],
  social: [
    {
      icon: ['fab', 'facebook'],
      url: 'https://www.facebook.com/infrapediainc'
    },
    { icon: ['fab', 'twitter'], url: 'https://www.twitter.com/infrapedia' },
    {
      icon: ['fab', 'linkedin'],
      url: 'https://www.linkedin.com/company/netatlas'
    },
    { icon: ['fab', 'instagram'], url: 'https://www.instagram.com/infrapedia/' }
  ]
}

export default infoMenuLinks
