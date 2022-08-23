const infoMenuLinks = {
  info: [
    {
      label: 'About us',
      url: '/about-us',
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
      footer: {
        order: 2
      },
      menu: {
        order: 2
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
    // {
    //   label: 'Sponsorships',
    //   url: '/sponsors',
    //   router: true,
    //   menu: {
    //     order: 4
    //   }
    // },
    {
      label: 'Contact us',
      url: '/contact',
      router: true,
      footer: {
        order: 1
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
    // {
    //   label: 'Linkedin',
    //   icon: ['fab', 'linkedin'],
    //   url: 'https://www.linkedin.com/company/infrapedia'
    // },
    {
      label: 'Instagram',
      icon: ['fab', 'instagram'],
      url: 'https://www.instagram.com/live.infrapedia/'
    }
  ]
}

export const navbarLinks = [
  {
    label: 'Home',
    url: '/'
  },
  {
    label: 'Services',
    url: '/services'
  },
  // {
  //   label: 'Sponsorships',
  //   url: '/sponsors'
  // },
  {
    label: 'Blog',
    url: 'https://blog.infrapedia.com',
    tab: true
  },
  {
    label: 'About',
    dropdown: [
      {
        label: 'About us',
        url: '/about-us'
      },
      {
        label: 'Advisory Board',
        url: '/advisory-board'
      },
      {
        label: 'Attributions',
        url: '/attributions'
      },
      {
        label: 'Github',
        url: 'https://github.com/infrapedia',
        tab: true
      },
      {
        label: 'FAQ',
        url: '/faq'
      }
    ]
  },
  {
    label: 'Contact Us',
    url: '/contact'
  }
]

export default infoMenuLinks
