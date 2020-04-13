import Landing from '../pages/Landing.vue'
import MapHome from '../pages/MapHome.vue'
import Login from '../pages/login.vue'
import NotFound from '../layouts/404.vue'
import User from '../pages/profile/index.vue'
import Profile from '../pages/profile/profile.vue'
import CLS from '../pages/profile/section/cls.vue'
import IxpsSection from '../pages/profile/section/ixps.vue'
import CreateSection from '../pages/profile/section/create.vue'
import TerrestrialNetworksSection from '../pages/profile/section/terrestrial-networks.vue'
import SubseaCablesSection from '../pages/profile/section/subsea-cables.vue'
import IssuesSection from '../pages/profile/section/issues.vue'
import AlertsSection from '../pages/profile/section/alerts.vue'
import ChangePassword from '../pages/profile/recover-password.vue'
import ConnectionsSection from '../pages/profile/section/connections.vue'
import OrgsSection from '../pages/profile/section/organization.vue'
import MyIssuesSection from '../pages/profile/section/myissues.vue'
import FacilitiesSection from '../pages/profile/section/facilities.vue'
import EmailProviders from '../pages/profile/email-providers.vue'
import MarketPlace from '../pages/marketplace'
import MessagesSection from '../pages/profile/section/messages.vue'
import MyMessagesSection from '../pages/profile/section/mymessages.vue'
import Contact from '../pages/Contact.vue'
import About from '../pages/About.vue'
import Attributions from '../pages/Attributions.vue'
import Services from '../pages/Services.vue'

const routes = [
  { path: '*', component: NotFound },
  {
    path: '/app',
    name: 'map-app',
    component: MapHome
  },
  {
    path: '/',
    name: 'landing',
    component: Landing
  },
  {
    path: '/attributions',
    name: 'attributions',
    component: Attributions
  },
  {
    path: '/services',
    name: 'services',
    component: Services
  },
  {
    path: '/marketplace',
    name: 'marketplace',
    component: MarketPlace
  },
  {
    path: '/contact',
    name: 'contact',
    component: Contact
  },
  {
    path: '/about',
    name: 'about',
    component: About
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
    path: '/user/section/terrestrial-networks',
    name: 'user/terrestrial-cables-section',
    component: TerrestrialNetworksSection
  },
  {
    path: '/user/section/subsea-cables',
    name: 'user/subsea-cables-section',
    component: SubseaCablesSection
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
    path: '/user/section/facilities',
    name: 'user/facs-section',
    component: FacilitiesSection
  },
  {
    path: '/user/section/ixps',
    name: 'user/ixps-section',
    component: IxpsSection
  },
  {
    path: '/user/section/groups',
    name: 'user/networks-section',
    component: ConnectionsSection
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
    path: '/user/section/my-messages',
    name: 'user/my-messages',
    component: MyMessagesSection
  },
  {
    path: '/user/section/messages',
    name: 'user/messages',
    component: MessagesSection
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
  }
]

export default routes
