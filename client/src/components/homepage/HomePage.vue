<template>
  <div class="main-wrapper no-overflow-x">
    <div class="hero-wrapper relative">
      <div
        class="absolute z-index20 cubic-transition overlay-inner w-fit-full h-fit-full flex column nowrap justify-content-center align-items-center"
      >
        <div class="flex align-items-center column">
          <h1 class="title--homepage-variant white mb12">
            Free access to our Map!
            <small class="block text-center">
              Sign-up and explore the Internet infrastructure
            </small>
          </h1>
          <router-link
            to="/"
            class="el-button el-button--primary is-round mr4 w42 inline-block is-plain"
          >
            Go to Map
          </router-link>
        </div>
      </div>
      <div class="map-wrapper cubic-transition">
        <img
          src="../../assets/infrapedia_map.png"
          alt="Infrapedia’s Map"
          class="hero-img hidden lg:block"
        />
        <img
          src="../../assets/infrapedia_map_tablet.png"
          alt="Infrapedia’s Map"
          class="hero-img hidden md:block lg:hidden"
        />
        <img
          src="../../assets/infrapedia_map_mobile.png"
          alt="Infrapedia’s Map"
          class="hero-img md:hidden"
        />
      </div>
    </div>
    <div class="main-wrapper_after-hero">
      <div class="introduction mt20 mb12 p4 flex row wrap">
        <div class="left">
          <h1 class="title--homepage-variant mb8 mt4">
            The Infrastructure Map
          </h1>
          <p class="text--homepage-variant heading">
            Infrapedia is the most complete and versatile interactive
            infrastructure map of the Internet. It is the community’s best and
            freely accessible tool that allows engineers, carriers, data center
            operators, business development executives and other stakeholders to
            navigate the Internet’s collection of networks and data centers.
          </p>
          <p class="text--homepage-variant sub mt4">
            Most importantly, Infrapedia is open source and a community where
            you can connect and get assistance from professionals or
            Infrapedia’s team of industry experts.
          </p>
          <p class="text--homepage-variant mt4">
            Joining is easy, no fees needed to register and use the interactive
            map.
          </p>
          <div class="mt8">
            <el-button @click="askToRegister" type="primary" round class="mr4">
              Join now
            </el-button>
            <router-link class="el-button is-round p4 el-link" to="/contact">
              Contact Us
            </router-link>
          </div>
        </div>
        <div class="right">
          <el-image
            src="https://cdn1.infrapedia.com/assets/top_new_gif.gif"
            fit="contain"
          />
        </div>
      </div>
      <div class="p4 mb20 mt20" id="partnersSection">
        <h2 class="title--homepage-variant mb20 text-center diff">
          Our Partners
        </h2>
        <div class="boxes-wrapper">
          <div class="el-card box p2" v-for="(partner, i) in premium" :key="i">
            <el-image fit="contain" :src="partner.logo" />
          </div>
        </div>
      </div>
      <div class="phrases mb8 p4 flex row wrap">
        <div class="left">
          <div class="icons-main-wrapper mt4">
            <div class="icon-wrapper">
              <span class="icon w12 h12 inline-block vertical-align">
                <fa :icon="['fas', 'globe-americas']" />
              </span>
              discover
            </div>
            <div class="icon-wrapper">
              <span class="icon w12 h12 inline-block vertical-align">
                <fa :icon="['fas', 'tasks']" />
              </span>
              plan
            </div>
            <div class="icon-wrapper">
              <span class="icon w12 h12 inline-block vertical-align">
                <fa :icon="['fas', 'headset']" />
              </span>
              connect
            </div>
            <div class="icon-wrapper">
              <span class="icon w12 h12 inline-block vertical-align">
                <fa :icon="['fas', 'money-check-alt']" />
              </span>
              buy
            </div>
          </div>
        </div>
        <div class="right">
          <p class="text--homepage-variant">
            Our focus is to show the layer 1 structure of the global network.
          </p>
          <ul class="list-wrapper">
            <li>
              <strong>View</strong> information about key internet
              infrastructures including fiber optic submarine cable <br />
              systems, terrestrial fiber networks, internet exchange points and
              data center facilities.
            </li>
            <li>
              See <strong>near-real time</strong> operational status of
              networks, especially subsea cable systems.
            </li>
            <li>
              <strong>Find</strong> new routes and get technical details to help
              network planning teams to build more <br />
              resilient networks.
            </li>
            <li>
              <strong>Find and connect</strong> with sales teams to acquire
              capacity without paying commissions to middle parties.
            </li>
          </ul>
          <p class="text--homepage-variant">
            Like PeeringDB, Infrapedia is a crowd-sourced platform. Users can
            add and update information about their networks and data center
            facilities on the map as well as help update listings with more
            accurate information to keep an <br />
            updated and usable tool for the entire Internet community.
          </p>
        </div>
      </div>
      <div class="p4 mb12" id="trustedBySection">
        <h2 class="title--homepage-variant mb20 text-center diff">
          Trusted by
        </h2>
        <div class="boxes-wrapper">
          <div
            class="el-card box p2"
            v-for="(partner, i) in trustedBy"
            :key="i"
          >
            <el-image fit="contain" :src="partner.logo" />
          </div>
        </div>
      </div>
      <div class="blockquote p12 el-card transparent no-border flex row wrap">
        <div class="left">
          <el-image :src="founder.photo" class="circle founder-image" />
        </div>
        <div class="right">
          <p class="text--homepage-variant mt4">
            “My goal is to give people real-time visibility and connect buyers
            and sellers directly to get Internet infrastructure at the best
            value and help connect billions of people to the internet cheaper
            and faster.”
            <br />
            <strong class="inline-block mt4">
              - Mehmet Akcin Founder & President
            </strong>
          </p>
        </div>
      </div>
      <div
        class="bottom-banner el-card flex row nowrap align-items-center mb20 mt12"
      >
        <div class="p2">
          <h2 class="font-medium">Ready to get started?</h2>
          <h2 class="font-thin title--homepage-variant diff">
            Create an account or talk to our experts.
          </h2>
          <div class="call-to-action mb8">
            <el-button round @click="askToRegister" type="primary">
              Join now
            </el-button>
            <router-link to="/contact" class="el-button is-round">
              Contact us
            </router-link>
          </div>
        </div>
        <div class="banner-image hidden-sm-and-down w-fit-full">
          <el-image
            class="w-fit-full h90 hidden-sm-and-down banner-image"
            fit="cover"
            src="https://cdn1.infrapedia.com/assets/footer3.png"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import teamMembers from '../../config/teamMembers.js'
import { formatDate } from '../../helpers/formatDate'
import { getTrustedBy } from '../../services/api/organizations'
import { checkCookie } from '../../helpers/cookies'

export default {
  name: 'HomePage',
  data: () => ({
    trustedBy: [],
    loadingVotes: false,
  }),
  computed: {
    texts() {
      return {
        withIcon: [
          {
            title: 'Data Analysis',
            text: 'Access our team of experts and gain deep insight into our infrastructure database.',
          },
          {
            title: 'Custom Maps & GIS Engineering',
            text: 'GIS and Custom Map development.',
          },
          {
            title: 'Software Development',
            text: 'Our skilled engineers work with you to develop the software you need.',
          },
          {
            title: 'Infrastructure Procurement',
            text: 'Connect with the provider you need and get quotes directly from them.',
          },
        ],
      }
    },
    founder() {
      const founder = teamMembers.filter(t => t.position == 'President')[0]
      return founder
    },
    formatDate() {
      return function (date) {
        return formatDate(date)
      }
    },
    premium() {
      return this.$store.state.premium
    },
    blogHeight() {
      return this.isMobile ? '40vh' : '28vh'
    },
    isMobile() {
      return window.innerWidth <= 425
    },
  },
  async mounted() {
    try {
      await Promise.all([
        this.loadTrustedBy(),
        this.$store.dispatch('getPremiumData'),
      ])
    } catch {
      // Ignore
    }
  },
  methods: {
    async loadTrustedBy() {
      const res = await getTrustedBy()
      if (res && res.data && res.data.r) {
        this.trustedBy = res.data.r
      }
    },
    askToRegister() {
      if (checkCookie('auth0.is.authenticated')) {
        this.$router.push('/app')
      } else {
        this.$router.push('/login?redirect=true')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/homepage/homepage-styles.scss';
</style>
