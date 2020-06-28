<template>
  <div class="main-wrapper no-overflow-x">
    <div class="hero-wrapper relative">
      <div
        class="absolute z-index20 cubic-transition overlay-inner w-fit-full h-fit-full flex column nowrap justify-content-center align-items-center"
        :class="{ 'visible-from-start': isMobile }"
      >
        <div class="inner-wrapper-text flex justify-content-center row wrap">
          <h1 class="title white mb12">
            Create your free account today and begin to explore.
            <small class="block text-center">
              Take advantage of all the features Infrapedia has for you.
            </small>
          </h1>
          <el-button
            class="mr4 w42"
            plain
            round
            type="primary"
            @click="askToRegister"
          >
            Register or login
          </el-button>
        </div>
      </div>
      <div class="map-wrapper cubic-transition">
        <i-map :disabled="true" />
      </div>
      <a
        size="small"
        class="transparent no-border vertical-align animated slow bounce four delay-3s"
        id="moreBelowBtn"
      >
        <fa :icon="['fas', 'angle-down']" />
      </a>
    </div>
    <div class="main-wrapper_after-hero">
      <div class="p4" id="partnersSection">
        <div class="mt20">
          <h2 class="title mb20 text-center diff">Our Partners</h2>
          <div class="boxes-wrapper">
            <div
              class="el-card box p4"
              :class="{ 'no-gray-filter': isMobile }"
              v-for="(partner, i) in premium"
              :key="i"
            >
              <el-image fit="contain" :src="partner.logo" />
            </div>
          </div>
        </div>
      </div>
      <div class="information-section mt20" id="servicesSection">
        <div class="description flex row wrap p4">
          <div class="inner-wrapper">
            <h1 class="title mb8 mt4">
              Infrastructure Atlas
            </h1>
            <p class="text heading">
              Infrapedia is more than just the world’s largest crowd-sourced
              real-time global internet infrastructure map. We are one of the
              most versatile and useful tools you can use to discover new
              internet routes and improve their resiliency and stability.
            </p>
            <p class="text sub mt4">
              Most importantly, we provide you with a community where you can
              connect and request information and quotes from providers all over
              the world easily.
            </p>
            <router-link
              class="fs-large el-link underline-hover mt6"
              to="/contact"
            >
              Contact Us
              <span class="fs-xsmall font-thin ml1">
                <fa :icon="['fas', 'angle-double-right']" />
              </span>
            </router-link>
          </div>
          <div class="inner-wrapper">
            <el-image
              src="https://cdn1.infrapedia.com/assets/img/footer.png"
              fit="cover"
              class="h80"
            />
          </div>
        </div>
        <div class="p4 services-wrapper">
          <h2 class="title md w80 mt20 mb8">
            Our Services
          </h2>
          <div class="boxes-wrapper row wrap justify-content-space-between">
            <div
              class="box el-card p4"
              v-for="(item, i) in texts.withIcon"
              :key="i"
            >
              <h3 class="title sm">
                {{ item.title }}
              </h3>
              <p class="text" v-text="item.text" />
              <i class="fas fa-people-arrows"></i>
            </div>
          </div>
          <!-- <router-link to="/services" class=" mt12 underline-hover">
            Our Services
            <span class="fs-xsmall font-thin ml1">
              <fa :icon="['fas', 'angle-double-right']" />
            </span>
          </router-link> -->
        </div>
      </div>
      <div class="p4 mb20" id="trustedBySection">
        <h2 class="title mb20 text-center diff">Trusted by</h2>
        <div class="boxes-wrapper">
          <div class="box p2 el-card" v-for="(partner, i) in 12" :key="i">
            <!-- <el-image fit="contain" lazy :src="partner" /> -->
            {{ partner }}
          </div>
        </div>
      </div>
      <div class="p0" id="blogSection">
        <!-- <div class="carousel-wrapper p4">
          <el-divider></el-divider>
          <div class="mt20">
            <h2 class="title">Blog</h2>
            <el-carousel
              :interval="7000"
              :height="blogHeight"
              indicator-position="outside"
            >
              <el-carousel-item v-for="(post, i) in blogPosts" :key="i">
                <div class="flex row nowrap justify-content-center">
                  <a :href="post.link" target="_blank">
                    <el-card shadow="never" class="p8">
                      <div>
                        <small>
                          {{ formatDate(post.modified_gmt) }}
                        </small>
                        <h3 class="title sm">
                          {{ post.title.rendered }}
                        </h3>
                        <p v-html="post.excerpt.rendered" />
                      </div>
                    </el-card>
                  </a>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div> -->
      </div>
      <div
        class="bottom-banner el-card flex row nowrap align-items-center mb20"
      >
        <div class="p4">
          <h2 class="font-medium">
            Ready to get started?
          </h2>
          <h2 class="font-thin title diff">
            Create an account or talk to our experts.
          </h2>
          <div class="call-to-action">
            <el-button plain round @click="askToRegister" type="info">
              Join now
            </el-button>
            <router-link to="/contact" class="el-button is-round">
              Contact us
            </router-link>
          </div>
        </div>
        <el-image
          class="w-fit-full h120"
          fit="cover"
          src="https://i.dlpng.com/static/png/5851670-vector-library-library-crack-texture-png-for-free-download-crack-texture-png-820_505_preview.png"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Map from '../mainMap/Map'
import getBlogPosts from '../../services/api/blog'
import { getTrustedBy } from '../../services/api/organizations'
import { formatDate } from '../../helpers/formatDate'

export default {
  name: 'HomePage',
  components: {
    'i-map': Map
  },
  data: () => ({
    trustedBy: [],
    blogPosts: [],
    loadingVotes: false
  }),
  computed: {
    texts() {
      return {
        withIcon: [
          {
            title: 'Data Analysis',
            text:
              'Access our team of experts and gain deep insight into our infrastructure database.'
          },
          {
            title: 'Custom Maps & GIS Engineering',
            text: 'GIS and Custom Map development.'
          },
          {
            title: 'Software Development',
            text:
              'Our skilled engineers work with you to develop the software you need.'
          },
          {
            title: 'Marketing & Communications',
            text:
              'Get a team of experts be your right hand with branding and marketing.'
          },
          {
            title: 'Infrastructure Procurement',
            text:
              'Connect with the provider you need and get quotes directly from them.'
          }
        ]
      }
    },
    formatDate() {
      return function(date) {
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
    }
  },
  async mounted() {
    try {
      await Promise.all([
        this.loadTrustedBy(),
        this.loadBlogPosts(),
        this.$store.dispatch('getPremiumData')
      ])
    } catch {
      // Ignore
    }
  },
  methods: {
    async loadTrustedBy() {
      const {
        data: { r = [] }
      } = (await getTrustedBy()) || {
        data: { r: [] }
      }
      this.trustedBy = r
    },
    async loadBlogPosts() {
      const posts = (await getBlogPosts()) || []
      this.blogPosts = posts
    },
    askToRegister() {
      this.$parent.$emit('layout', 'nothing-layout')
      this.$router.push('/login?redirect=true')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/homepage/homepage-styles.scss';
</style>
