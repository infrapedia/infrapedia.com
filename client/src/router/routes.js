import Home from '../pages/Home.vue'
import NotFound from '../layouts/404.vue'
import User from '../pages/user/index.vue'
import Profile from '../pages/user/Profile.vue'
import CLS from '../pages/user/section/cls.vue'
import CreateSection from '../pages/user/section/create.vue'
import CablesSection from '../pages/user/section/cables.vue'
import NetworksSection from '../pages/user/section/network.vue'
import OrgsSection from '../pages/user/section/organization.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/user',
    name: 'user',
    component: User
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: Profile
  },
  {
    path: '/user/section/cables',
    name: 'user/cables-section',
    component: CablesSection
  },
  {
    path: '/user/section/orgs',
    name: 'user/orgs-section',
    component: OrgsSection
  },
  {
    path: '/user/section/cls',
    name: 'user/cls-section',
    component: CLS
  },
  {
    path: '/user/section/networks',
    name: 'user/networks-section',
    component: NetworksSection
  },
  {
    path: '/user/create',
    name: 'create',
    component: CreateSection
  },
  {
    path: '/404',
    name: '404',
    component: NotFound
  }
]

export default routes
