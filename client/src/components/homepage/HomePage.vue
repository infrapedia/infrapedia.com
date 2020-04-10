<template>
  <div class="pb20 no-overflow-x">
    <div class="hero-wrapper relative">
      <div
        class="absolute z-index20 cubic-transition overlay-inner w-fit-full h-fit-full flex column nowrap justify-content-center align-items-center"
        @click="askToRegister"
      >
        <div class="w120 flex justify-content-center row wrap">
          <h2 class="title white mb12">
            Create your account today and begin to explore
            <small class="block">
              We have a variety of features that make it for you to manage your
              assets
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
      <div class="map-wrapper transition-all">
        <i-map
          style="height: 62vh;"
          :disabled="true"
          @clicked-disabled-map="askToRegister"
        />
      </div>
    </div>
    <div class="information-section mt20">
      <h1 class="text-center title">
        What is Infrapedia?
      </h1>
      <div
        class="inner-wrapper mt20 flex justify-content-center column wrap align-items-center"
      >
        <p class="text font-bold">
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
        <div class="centered-wrapper relative w-fit-full mt20 pt2">
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
        class="text-center w-fit-full inline-block mt12"
      >
        Learn more
        <span class="fs-xsmall font-thin ml1">
          <fa :icon="['fas', 'angle-double-right']" />
        </span>
      </router-link>
    </div>
  </div>
</template>

<script>
import Map from '../mainMap/Map'

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
    }
  }),
  methods: {
    async askToRegister() {
      await this.$auth.loginWithRedirect()
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/components/homepage-styles.scss';
</style>
