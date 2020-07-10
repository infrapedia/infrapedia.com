const infoMenuLinks = {
  info: [
    {
      label: 'About us',
      url: '/about',
      router: true,
      footer: {
        order: 0
      },
      menu: {
        order: 1
      }
    },
    {
      label: 'Blog',
      url: 'https://blog.infrapedia.com',
      openTab: true,
      menu: {
        order: 3
      }
    },
    {
      label: 'Services',
      url: '/services',
      router: true,
      menu: {
        order: 2
      }
    },
    {
      label: 'Sponsorships',
      url: '/sponsors',
      router: true,
      menu: {
        order: 4
      }
    },
    {
      label: 'Contact us',
      url: '/contact',
      router: true,
      footer: {
        order: 0
      },
      menu: {
        order: 7
      }
    },
    {
      label: 'Attributions',
      url: '/attributions',
      router: true,
      menu: {
        order: 6
      }
    },
    {
      label: 'Advisory Board',
      url: '/advisory-board',
      router: true,
      footer: {
        order: 5
      },
      menu: {
        order: 5
      }
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
