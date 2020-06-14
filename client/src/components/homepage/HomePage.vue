<template>
  <div class="main-wrapper pb20 no-overflow-x">
    <div class="hero-wrapper relative">
      <div
        class="absolute z-index20 cubic-transition overlay-inner w-fit-full h-fit-full flex column nowrap justify-content-center align-items-center"
      >
        <div class="inner-wrapper-text flex justify-content-center row wrap">
          <h2 class="title white mb12">
            Create your account today and begin to explore
            <small class="block">
              We have a variety of features that make it easy for you to manage
              your assets
            </small>
          </h2>
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
    <div class="carousel-section">
      <div class="carousel-wrapper p4">
        <el-divider></el-divider>
        <div class="mt20">
          <h3 class="title">Blog</h3>
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
      <div class="carousel-wrapper p4">
        <el-divider></el-divider>
        <div class="mt20">
          <h3 class="title">Our Partners</h3>
          <el-carousel
            :interval="6000"
            height="40vh"
            indicator-position="outside"
          >
            <el-carousel-item v-for="(img, i) in premium" :key="i">
              <div class="flex row nowrap justify-content-center">
                <el-card shadow="never" class="no-border w40">
                  <el-image
                    :src="img.logo"
                    fit="scale-down"
                    class="img-sponsor w40 h80 no-selectable"
                  />
                </el-card>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <div class="carousel-wrapper p4">
        <h3 class="title">Trusted by</h3>
        <el-carousel
          :interval="5000"
          height="40vh"
          indicator-position="outside"
        >
          <el-carousel-item v-for="(img, i) in trustedBy" :key="i">
            <div class="flex row nowrap justify-content-center">
              <el-image
                :src="img.logo"
                fit="scale-down"
                class="img-sponsor w40 h80 no-selectable"
              />
            </div>
          </el-carousel-item>
        </el-carousel>
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
    texts: {
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
    },
    trustedBy: [],
    blogPosts: [],
    loadingVotes: false
  }),
  computed: {
    formatDate() {
      return function(date) {
        return formatDate(date)
      }
    },
    premium() {
      return this.$store.state.premium
    },
    blogHeight() {
      return window.innerWidth <= 425 ? '40vh' : '28vh'
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
