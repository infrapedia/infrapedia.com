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
    <div class="main-wrapper_after-hero" style="margin-bottom: 10rem">
      <div class="adjust-max-w introduction mt20 mb12 p4 flex row wrap">
        <div class="left">
          <h1 class="title--homepage-variant mb8 mt4">
            The Infrastructure Map
          </h1>

          <div>
            <p class="text--homepage-variant heading">
              Infrapedia is the most complete and versatile interactive
              infrastructure map of the Internet. It is the community’s best and
              freely accessible tool that allows engineers, carriers, data
              center operators, business development executives and other
              stakeholders to navigate the Internet’s infrastructure.
            </p>

            <p>Infrapedia’s free web application consist of:</p>
            <ul style="padding-left: 1rem; list-style: disc">
              <li>
                <h2 class="title-sm">
                  <strong> Submarine Cable Map </strong>
                </h2>
                <p class="text--homepage-variant">
                  Depicting more than 600 internet cables under the ocean and
                  1,450 cable landing stations (CLS) that are currently active,
                  under construction or have been taken out of service
                  (decommissioned).
                </p>
              </li>
              <li>
                <h2 class="title-sm">
                  <strong> Terrestrial Fiber Map </strong>
                </h2>
                <p class="text--homepage-variant">
                  Detailed maps of more than 100 terrestrial fiber networks
                  throughout the world owned and operated by local and national
                  telecom operators and international backbone providers.
                </p>
              </li>
              <li>
                <h2 class="title-sm">
                  <strong> Data Center Map </strong>
                </h2>
                <p class="text--homepage-variant">
                  Detailed information about more than 10,000 facilities
                  globally, including data centers, carrier hotels, towers and
                  earth stations.
                </p>
              </li>
              <li>
                <h2 class="title-sm">
                  <strong> Internet Exchange Map </strong>
                </h2>
                <p class="text--homepage-variant">
                  Over 300 active Internet exchanges and more than 500 buildings
                  in which those exchanges reside.
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div class="right">
          <div class="image-wrapper">
            <el-image
              src="https://cdn1.infrapedia.com/assets/top_new_gif.gif"
              fit="contain"
            />
          </div>
          <div class="mt8" style="text-align: end">
            <router-link
              to="/"
              class="el-button mr4 el-button--primary is-round"
            >
              View Map
            </router-link>
            <router-link class="el-button is-round p4 el-link" to="/contact">
              Contact Us
            </router-link>
          </div>
        </div>
      </div>

      <section class="mt-20" id="whatWeDo">
        <div>
          <h2 class="title--homepage-variant mb5 text-center diff">
            What we do
          </h2>

          <p class="text--homepage-variant mt4">
            Most importantly, Infrapedia is open source and a community where
            you can connect and get assistance from professionals or
            Infrapedia’s team of industry experts. Together with the help from
            our sponsor EdgeUno Inc. Infrapedia is able to keep providing the
            world’s most realistic view of the internet infrastructure for free
            and assure the long term sustainability of the platform and
            community. Joining is easy, no fees needed to register and use the
            interactive map.
            <a
              href="https://infrapedia.com"
              rel="noreferrer noopener"
              target="_self"
              >Start interacting with our map now!</a
            >
          </p>
        </div>
      </section>

      <div class="adjust-max-w">
        <div class="phrases flex row wrap">
          <div class="left" aria-hidden="true" />
          <div class="right">
            <h2 class="title--homepage-variant mt-4">
              Internet infrastructure view
            </h2>

            <p
              style="margin: 4rem 0; text-align: left; max-width: 720px"
              class="text--homepage-variant mt4"
            >
              Infrapedia is the only available public tool that gives an
              operational global view of the internet infrastructure to support
              identifying possible
              <b>
                areas of expansion, new opportunities and potential
                collaborations
              </b>
              with other community members.
            </p>
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
                systems, terrestrial fiber networks, internet exchange points
                and data center facilities.
              </li>
              <li>
                See operational status of networks, especially subsea cable systems.
              </li>
              <li>
                <strong>Find</strong> new routes and get technical details to
                help network planning teams to build more <br />
                resilient networks.
              </li>
              <li>
                <strong>Find and connect</strong> with sales teams to acquire
                capacity without paying commissions to middle parties.
              </li>
            </ul>
            <p class="text--homepage-variant">
              Like
              <a
                href="https://www.peeringdb.com/"
                rel="noreferrer noopener"
                target="_blank"
                >PeeringDB</a
              >, Infrapedia is a crowd-sourced platform. Users can add and
              update information about their networks and data center facilities
              on the map as well as help update listings with more accurate
              information to keep an <br />
              updated and usable tool for the entire Internet community.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import teamMembers from '../../config/teamMembers.js'
import { formatDate } from '../../helpers/formatDate'

export default {
  name: 'HomePage',
  data: () => ({
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
      return teamMembers.filter(t => t.position == 'President')[0]
    },
    formatDate() {
      return date => formatDate(date)
    },
    blogHeight() {
      return this.isMobile ? '40vh' : '28vh'
    },
    isMobile() {
      return window.innerWidth <= 425
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/homepage/homepage-styles.scss';

.title-sm {
  font-size: 0.98em;
  margin-bottom: 0;
  line-height: 1.42;
}
.title-sm + p {
  margin: 0;
}
</style>
