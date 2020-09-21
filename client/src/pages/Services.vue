<template>
  <div
    class="main-wrapper flex column wrap justify-content-center no-overflow-x mb20"
  >
    <!-- <div class="banner-wrapper">
      <el-image
        lazy
        fit="cover"
        src="https://cdn1.infrapedia.com/bgs/b2.jpg"
        class="banner-img"
      />
    </div> -->
    <div class="card-wrapper mt20 mb20">
      <header class="w-fit-full text-center">
        <h1 class="title mb12" :class="{ dark }">
          Services & Consulting
        </h1>
      </header>
      <div class="services-wrapper" :class="{ dark }">
        <router-link to="/contact" class="inner-wrapper cursor-pointer">
          <div class="p4">
            <div class="card-inner-wrapper">
              <header class="inner-wrapper_header">
                <h2 class="title sm" :class="{ dark }">
                  <span class="md-icon">
                    <fa :icon="['fas', 'chalkboard-teacher']" />
                  </span>
                  Consultancy
                </h2>
              </header>
              <p class="text">
                Our team consists of industry leaders that are always eager to
                help.
              </p>
              <p class="text">
                We offer you a range of services that includes data analysis and
                advice, software development, project support, operations,
                marketing consultancy, and more.
              </p>
            </div>
          </div>
        </router-link>
        <router-link to="/contact" class="inner-wrapper cursor-pointer">
          <div class="p4">
            <div class="card-inner-wrapper">
              <header class="inner-wrapper_header">
                <h2 class="title sm" :class="{ dark }">
                  <span class="md-icon">
                    <fa :icon="['fas', 'chart-area']" />
                  </span>
                  Data analysis
                </h2>
              </header>
              <p class="text">
                Our Data Analysis services give you access to our team of
                analysts and engineers who can help you gain insights into
                Infrapedia’s ever-growing infrastructure database.
              </p>
              <p class="text">
                We are able to provide you with detailed specifications of data
                centers and subsea cable systems or build custom analysis
                software to analyze our database in order to find answers to
                your specific questions.
              </p>
            </div>
          </div>
        </router-link>
        <router-link to="/contact" class="inner-wrapper cursor-pointer">
          <div class="p4">
            <div class="card-inner-wrapper">
              <header class="inner-wrapper_header">
                <h2 class="title sm" :class="{ dark }">
                  <span class="md-icon">
                    <fa :icon="['fas', 'map']" />
                  </span>
                  Custom Maps and GIS engineering
                </h2>
              </header>
              <p class="text">
                At Infrapedia we have extensive knowledge about developing
                (interactive) maps and GIS.
              </p>
              <p class="text">
                Our Custom Maps and GIS engineering services allow all types of
                organizations, from universities and nonprofit organizations to
                government entities and hyper-scale cloud providers, to add
                third party information for analysis, NOC operations, dedicated
                maps, and more.
              </p>
            </div>
          </div>
        </router-link>
        <router-link to="/contact" class="inner-wrapper cursor-pointer">
          <div class="p4">
            <div class="card-inner-wrapper">
              <header class="inner-wrapper_header">
                <h2 class="title sm" :class="{ dark }">
                  <span class="md-icon">
                    <fa :icon="['fas', 'code']" />
                  </span>
                  Software Development
                </h2>
              </header>
              <p class="text">
                Our Infrapedia team consists of skilled software engineers who
                are able to work with you on the development of the software you
                need to increase your team’s efficiency and profitability.
              </p>
            </div>
          </div>
        </router-link>
      </div>
      <footer class="mt8 pt4 pb4">
        <el-divider :class="{ dark }" />
        <router-link
          to="/contact"
          class="el-button transparent no-border p0 underline cursor-pointer"
          :class="{ dark }"
        >
          Contact us</router-link
        >
        or
        <el-button
          type="text"
          :class="{ dark }"
          @click="toggleNewsletterDialog"
          class="cursor-pointer fs-medium underline"
          >subscribe</el-button
        >
        to our newsletter
      </footer>
    </div>
    <newsletter-dialog
      :visibility="isNewsLetterDialog"
      @close="toggleNewsletterDialog"
    />
  </div>
</template>

<script>
import NewsletterDialog from '../components/dialogs/NewsletterDialog'

export default {
  name: 'ServicesPage',
  components: {
    NewsletterDialog
  },
  data: () => ({
    isNewsLetterDialog: false
  }),
  head: {
    title:
      'Infrapedia | Services & Consultancy | Global Internet Infrastructure Map',
    link: [
      {
        rel: 'canonical',
        href: `${window.origin}/services`
      }
    ],
    meta: [
      {
        name: 'description',
        content:
          'Infrapedia is your one-stop partner for internet infrastructure data, map, and services that include custom maps and personalized consulting.'
      },
      {
        name: 'keywords',
        content:
          'internet map, global internet infrastructure, submarine cable map. telecommunications, network pops, world internet structure'
      }
    ]
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  methods: {
    toggleNewsletterDialog() {
      this.isNewsLetterDialog = !this.isNewsLetterDialog
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/pages/services-styles.scss';
</style>
