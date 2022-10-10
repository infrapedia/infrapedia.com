import { getInstance } from '../auth/index'
import { checkCookie } from '../helpers/cookies'
import NotFound from '../layouts/404.vue'
import ProfileLayout from '../layouts/profile.vue'
import HomepageLayout from '../layouts/homepage.vue'

import Landing from '../pages/Landing.vue'
import MapApp from '../pages/MapApp.vue'
import Login from '../pages/login.vue'
import Profile from '../pages/profile/profile.vue'
import ChangePassword from '../pages/profile/recover-password.vue'
import EmailProviders from '../pages/profile/email-providers.vue'
import Contact from '../pages/Contact.vue'
// import About from '../pages/About.vue'
import Attributions from '../pages/Attributions.vue'
// import Services from '../pages/Services.vue'
// import Sponsors from '../pages/Sponsors.vue'
// import VotesResults from '../pages/VotesResults.vue'
import PrivacyPolicy from '../pages/PrivacyPolicy.vue'
import TermsAndConditions from '../pages/TermsAndConditions.vue'
import FAQ from '../pages/FAQ.vue'
// import Advisors from '../pages/Advisors.vue'

async function handleAdminOnlyRoutes(next, to) {
  const $authInstance = getInstance()
  const isUserAnAdmin = $authInstance.isUserAnAdmin
  // If the user is not an admin
  // There's no reason for them to access the creation page of those sections
  if (to) {
    const query =
      to.query.id == 'csp' || to.query.id == 'map' || to.query.id == 'ixps'

    if (to.path == '/user/section/cloud-service-providers' && !isUserAnAdmin)
      next('/user')
    else if (query && !isUserAnAdmin) next('/user')
    else next()
  } else if (!isUserAnAdmin) {
    next('/user')
  } else {
    next()
  }
}

/**
 * DYNAMIC IMPORT OF USER DASHBOARD ROUTES
 */
const UserDashboard = () =>
  import(
    /* webpackChunkName: "user-nested-routes-group" */
    '../pages/profile/index.vue'
  )
const TerrestrialNetworksSection = () =>
  import(
    /* webpackChunkName: "user-nested-routes-group" */
    '../pages/profile/section/terrestrial-networks.vue'
  )
const SubseaCablesSection = () =>
  import(
    /* webpackChunkName: "user-nested-routes-group" */
    '../pages/profile/section/subsea-cables.vue'
  )
const CLSSection = () =>
  import(
    /* webpackChunkName: "user-nested-routes-group" */
    '../pages/profile/section/cls.vue'
  )
const IxpsSection = () =>
  import(
    /* webpackChunkName: "user-nested-routes-group" */
    '../pages/profile/section/ixps.vue'
  )
const CreateSection = () =>
  import(
    /* webpackChunkName: "user-nested-routes-group" */
    '../pages/profile/section/create.vue'
  )
const AlertsSection = () =>
  import(
    /* webpackChunkName: "user-nested-routes-group" */
    '../pages/profile/section/alerts.vue'
  )
const OrgsSection = () =>
  import(
    /* webpackChunkName: "user-nested-routes-group" */
    '../pages/profile/section/organization.vue'
  )
const CloudSection = () =>
  import(
    /* webpackChunkName: "user-nested-routes-group" */
    '../pages/profile/section/cloud-services-providers.vue'
  )
const FacilitiesSection = () =>
  import(
    /* webpackChunkName: "user-nested-routes-group" */
    '../pages/profile/section/facilities.vue'
  )
const CreateFacilitySection = () =>
  import(
    /* webpackChunkName: "user-nested-routes-group" */
    '../pages/profile/section/create-facility.vue'
  )

/**
 * THIS ARE RELATED NESTED ROUTES SO WE CAN DEFER THEM FROM THE OTHERS
 */
const IssuesSection = () =>
  import(
    /* webpackChunkName: "user-nested-routes-issues-group" */
    '../pages/profile/section/issues.vue'
  )
const MyIssuesSection = () =>
  import(
    /* webpackChunkName: "user-nested-routes-issues-group" */
    '../pages/profile/section/myissues.vue'
  )

const routes = [
  { path: '*', component: NotFound },
  {
    path: '/',
    name: 'app',
    alias: ['/subsea-cable/*', '/cls/*', '/terrestrial-network/*', '/ixp/*', '/facility/*', '/organization/*'],
    component: MapApp
  },
  // {
  //   path: '/homepage',
  //   name: 'homepage',
  //   alias: '/',
  //   component: Landing
  // },
  {
    path: '/',
    name: 'landing',
    component: HomepageLayout,
    children: [
      {
        path: '/attributions',
        name: 'attributions',
        component: Attributions
      },
      {
        path: '/faq',
        name: 'faq',
        component: FAQ
      },
      // {
      //   path: '/services',
      //   name: 'services',
      //   component: Services
      // },
      {
        path: '/privacy-policy',
        name: 'privacy-policy',
        component: PrivacyPolicy
      },
      {
        path: '/terms-and-conditions',
        name: 'terms-and-conditions',
        component: TermsAndConditions
      },
      // {
      //   path: '/sponsors',
      //   name: 'sponsors',
      //   component: Sponsors
      // },
      {
        path: '/contact',
        name: 'Contact',
        component: Contact
      },
      {
        path: '/about-us',
        name: 'About Us',
        component: Landing
      },
      // {
      //   path: '/votes-results',
      //   name: 'votes-results',
      //   component: VotesResults
      // },
      // {
      //   path: '/advisory-board',
      //   name: 'Advisory Board',
      //   component: Advisors
      // }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/user/change-password',
    name: 'change-password',
    component: ChangePassword
  },
  {
    path: '/user',
    name: 'user',
    component: ProfileLayout,
    beforeEnter: (to, from, next) => {
      const auth = getInstance()
      if (!checkCookie('auth0.is.authenticated')) {
        auth.loginWithRedirect()
      } else next()
    },
    children: [
      {
        path: 'dashboard',
        name: 'user-dashboard',
        component: UserDashboard
      },
      {
        path: 'profile',
        name: 'user-profile',
        component: Profile
      },
      {
        path: 'profile/email-providers',
        name: 'email-providers',
        component: EmailProviders
      },
      {
        path: 'section/terrestrial-networks',
        name: 'user/terrestrial-cables-section',
        component: TerrestrialNetworksSection
      },
      {
        path: 'section/subsea-cables',
        name: 'user/subsea-cables-section',
        component: SubseaCablesSection
      },
      {
        path: 'section/orgs',
        name: 'user/orgs-section',
        component: OrgsSection
      },
      {
        path: 'section/cls',
        name: 'user/cls-section',
        component: CLSSection
      },
      {
        path: 'section/facilities',
        name: 'user/facs-section',
        component: FacilitiesSection,
        beforeEnter: (to, from, next) => handleAdminOnlyRoutes(next, to)
      },
      {
        path: 'section/cloud-service-providers',
        name: 'user/add-csp',
        component: CloudSection,
        beforeEnter: (to, from, next) => handleAdminOnlyRoutes(next, to)
      },
      {
        path: 'section/ixps',
        name: 'user/ixps-section',
        component: IxpsSection,
        beforeEnter: (to, from, next) => handleAdminOnlyRoutes(next)
      },
      {
        path: 'section/issues',
        name: 'user/issues-section',
        component: IssuesSection
      },
      {
        path: 'section/issues-reported',
        name: 'user/issues-reported',
        component: MyIssuesSection
      },
      {
        path: 'section/alerts',
        name: 'user/alerts-section',
        component: AlertsSection
      },
      {
        path: 'section/create',
        name: 'create',
        component: CreateSection,
        beforeEnter: (to, from, next) => handleAdminOnlyRoutes(next, to)
      },
      {
        path: 'section/create-facility',
        name: 'create-facility',
        component: CreateFacilitySection,
        beforeEnter: (to, from, next) => handleAdminOnlyRoutes(next, to)
      },
      {
        path: 'section',
        redirect: { name: 'user/orgs-section' }
      },
      {
        path: '/user',
        redirect: { name: 'user-dashboard' }
      }
    ]
  }
]

export default routes
