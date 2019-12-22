import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faUserCircle,
  faBell,
  faPen,
  faCog,
  faTimes,
  faStar,
  faBolt,
  faHome,
  faMap,
  faDizzy,
  faCaretDown,
  faCaretUp,
  faSearch,
  faFilter,
  faCartPlus,
  faArrowLeft,
  faExpandArrowsAlt,
  faEllipsisV,
  faChevronUp,
  faCertificate,
  faSignOutAlt,
  faExclamationCircle,
  faShareAlt,
  faHeart,
  faCloudUploadAlt
} from '@fortawesome/free-solid-svg-icons'
import {
  faFacebook,
  faTwitter,
  faLinkedin,
  faInstagram
} from '@fortawesome/free-brands-svg-icons'

library.add(
  faUserCircle,
  faBell,
  faPen,
  faCog,
  faExpandArrowsAlt,
  faCaretUp,
  faCaretDown,
  faTimes,
  faStar,
  faBolt,
  faHome,
  faMap,
  faDizzy,
  faSearch,
  faFilter,
  faCartPlus,
  faArrowLeft,
  faEllipsisV,
  faChevronUp,
  faCertificate,
  faSignOutAlt,
  faFacebook,
  faTwitter,
  faLinkedin,
  faInstagram,
  faShareAlt,
  faHeart,
  faCloudUploadAlt,
  faExclamationCircle
)

Vue.component('fa', FontAwesomeIcon)
