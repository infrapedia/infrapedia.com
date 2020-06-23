<template>
  <div class="main-wrapper pb20 no-overflow-x">
    <div class="hero-wrapper relative">
      <div
        class="absolute z-index20 cubic-transition overlay-inner w-fit-full h-fit-full flex column nowrap justify-content-center align-items-center"
        :class="{ 'visible-from-start': isMobile }"
      >
        <div class="inner-wrapper-text flex justify-content-center row wrap">
          <h1 class="title white mb12">
            Create your free account today and begin to explore.
            <small class="block">
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
        <i-map :disabled="true" @clicked-disabled-map="askToRegister" />
      </div>
    </div>
    <div class="information-section mt20 mb20">
      <h1 class="text-center title">
        What is Infrapedia?
      </h1>
      <div
        class="inner-wrapper mt24 flex justify-content-center column wrap align-items-center"
      >
        <p class="text heading">
          Infrapedia is more than just the world’s largest crowd-sourced
          real-time global internet infrastructure map. We are one of the most
          versatile and useful tools you can use to discover new internet routes
          and improve their resiliency and stability.
        </p>
        <p class="text sub">
          Most importantly, we provide you with a community where you can
          connect and request information and quotes from providers all over the
          world easily.
        </p>
        <div
          id="contactUsButtonUnderHeading"
          class="text-center flex w-fit-full justify-content-center mt12"
        >
          <router-link class="el-button el-button--default" to="/contact">
            Contact Us
          </router-link>
        </div>
        <div class="centered-wrapper relative w-fit-full mt24">
          <div class="flex row nowrap with-icon justify-self-center">
            <div
              class="inner-wrapper"
              v-for="(item, i) in texts.withIcon"
              :key="i"
            >
              <h2 class="title md">
                <span
                  class="xl-icon mr4 bottom-shadow circle p4 vertical-align"
                >
                  <fa :icon="item.icon" />
                </span>
                {{ item.title }}
              </h2>
              <p class="text" v-text="item.text" />
              <i class="fas fa-people-arrows"></i>
            </div>
          </div>
        </div>
      </div>
      <router-link
        to="/services"
        class="text-center w-fit-full inline-block mt12 underline-hover"
      >
        Our Services
        <span class="fs-xsmall font-thin ml1">
          <fa :icon="['fas', 'angle-double-right']" />
        </span>
      </router-link>
    </div>
    <div class="carousel-section pb20">
      <div class="carousel-wrapper p4">
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
      </div>
      <div class="section-wrapper p4">
        <el-divider></el-divider>
        <div class="mt20">
          <h2 class="title mb20">Our Partners</h2>
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
      <div class="section-wrapper p4">
        <el-divider></el-divider>
        <h2 class="title mb20">Trusted by</h2>
        <div class="boxes-wrapper">
          <div class="box p4 el-card" v-for="(partner, i) in 12" :key="i">
            <!-- <el-image fit="contain" lazy :src="partner" /> -->
            {{ partner }}
          </div>
        </div>
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
            title: 'Versatile',
            icon: ['fas', 'people-arrows'],
            text:
              'This is an extremely useful feature, especially during times when attending conferences and in-person meetings is a challenge.'
          },
          {
            title: 'Discover',
            icon: ['fas', 'globe-americas'],
            text:
              'We bring more visibility to all routes including submarine and terrestrial networks in detail, plus other critical structures, including data centers.'
          },
          {
            title: 'Connect',
            icon: ['fas', 'headset'],
            text:
              'The technical details we provide will help your team build more resilient networks. Our team is a direct funnel to connect you with sales teams to acquire capacity without commissions.'
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
