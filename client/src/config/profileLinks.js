const profileLinks = [
  {
    label: 'Dashboard',
    url: '/user/dashboard',
    icon: ['fas', 'home']
  },
  {
    label: 'Profile',
    url: '/user/profile',
    icon: ['fas', 'user']
  },
  {
    label: 'Alerts',
    url: '/user/section/alerts',
    icon: ['fas', 'exclamation-triangle']
  },
  {
    label: 'Issues',
    url: '/user/section/issues',
    icon: ['fas', 'bug']
  },
  // {
  //   label: 'Messages',
  //   url: '/user/section/messages',
  //   icon: ['fas', 'envelope']
  // },
  {
    label: 'Organizations',
    url: '/user/section/orgs',
    icon: ['fas', 'sitemap']
  },
  // {
  //   label: 'Groups',
  //   url: '/user/section/groups',
  //   icon: ['fas', 'project-diagram'],
  //   adminOnly: true
  // },
  {
    label: 'CLS',
    url: '/user/section/cls',
    icon: ['fas', 'braille']
  },
  {
    label: 'Subsea Cables',
    url: '/user/section/subsea-cables',
    icon: ['fas', 'water']
  },
  {
    label: 'Terrestrial Networks',
    url: '/user/section/terrestrial-networks',
    icon: ['fas', 'bezier-curve']
  },
  {
    label: 'IXPs',
    url: '/user/section/ixps',
    icon: ['fas', 'dot-circle'],
    adminOnly: true
  },
  {
    label: 'Facilities',
    url: '/user/section/facilities',
    icon: ['fas', 'building'],
    adminOnly: true
  },
  {
    label: 'Maps',
    icon: ['fas', 'map-marked-alt'],
    url: '/user/section/create?id=map',
    adminOnly: true
  }
]

export default profileLinks
