import Home from '../pages/Home.vue'
import Login from '../pages/login.vue'
import NotFound from '../layouts/404.vue'
import User from '../pages/profile/index.vue'
import Blog from '../pages/blog/index.vue'
import Profile from '../pages/profile/profile.vue'
import CLS from '../pages/profile/section/cls.vue'
import IxpsSection from '../pages/profile/section/ixps.vue'
import CreateSection from '../pages/profile/section/create.vue'
import CablesSection from '../pages/profile/section/cables.vue'
import IssuesSection from '../pages/profile/section/issues.vue'
import AlertsSection from '../pages/profile/section/alerts.vue'
import ChangePassword from '../pages/profile/recover-password.vue'
import NetworksSection from '../pages/profile/section/network.vue'
import OrgsSection from '../pages/profile/section/organization.vue'
import MyIssuesSection from '../pages/profile/section/myissues.vue'
import FacilitiesSection from '../pages/profile/section/facilities.vue'
import EmailProviders from '../pages/profile/email-providers.vue'
import MarketPlace from '../pages/marketplace'
import Dashboard from '../pages/dashboard'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/marketplace',
    name: 'marketplace',
    component: MarketPlace
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard
  },
  {
    path: '/login',
    name: 'login',
    component: Login
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
    path: '/user/profile/email-providers',
    name: 'user-profile/email-providers',
    component: EmailProviders
  },
  {
    path: '/change-password',
    name: 'change-password',
    component: ChangePassword
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
    path: '/user/section/facs',
    name: 'user/facs-section',
    component: FacilitiesSection
  },
  {
    path: '/user/section/ixps',
    name: 'user/ixps-section',
    component: IxpsSection
  },
  {
    path: '/user/section/networks',
    name: 'user/networks-section',
    component: NetworksSection
  },
  {
    path: '/user/section/issues',
    name: 'user/issues-section',
    component: IssuesSection
  },
  {
    path: '/user/section/issues-reported',
    name: 'user/issues-reported',
    component: MyIssuesSection
  },
  {
    path: '/user/section/alerts',
    name: 'user/alerts-section',
    component: AlertsSection
  },
  {
    path: '/user/section/create',
    name: '/user/create',
    component: CreateSection
  },
  {
    path: '/user/section',
    redirect: { name: 'user/orgs-section' }
  },
  {
    path: '/blog',
    name: 'blog',
    component: Blog
  },
  {
    path: '/404',
    name: '404',
    component: NotFound
  }
]

export default routes
