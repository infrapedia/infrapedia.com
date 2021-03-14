<template>
  <transition
    name="animated fast"
    enter-active-class="slideInUp"
    leave-active-class="slideOutDown"
    mode="out-in"
  >
    <div class="main-wrapper donations-banner" v-if="isVisible">
      <div class="inner-wrapper">
        <div class="message-wrapper">
          <p v-html="message" />
        </div>
        <a
          target="_blank"
          rel="noopeneer noreferrer"
          class="inline-block donate-link"
          :href="donationLink"
        >
          <el-image
            src="https://storage.googleapis.com/infrapediacom/assets/paypal-donate-button2.png"
            fit="contain"
            class="image"
          />
        </a>
      </div>
      <el-button
        circle
        :class="{ dark }"
        icon="el-icon-close"
        class="no-border close-btn"
        @click.stop="handleClose"
      />
    </div>
  </transition>
</template>

<script>
import { getCookie, setCookie } from '../../helpers/cookies'

const NUMBER_OF_VISITS_COOKIE = '__.NOV.__'
const DONATED_COOKIE_NAME = '__.USERDd.__'
const IS_BANNER_ACTIVE =
  process.env.NODE_ENV === 'development'
    ? true
    : process.env.VUE_APP_IS_DONATION_BANNER_ACTIVE

export default {
  name: 'DonationsBanner',
  data: () => ({
    isVisible: false
  }),
  computed: {
    message() {
      return 'We are proudly non-profit, non-corporate and non-compromised. We rely on donations to carry out our mission to keep the Web open and free. <br/> Will you give today?'
    },
    donationLink() {
      return 'https://www.paypal.com/donate?hosted_button_id=3YHKKNWF4F3QA'
    },
    dark() {
      return this.$store.state.isDark
    },
    expiracyTime() {
      return 30
    }
  },
  mounted() {
    if (!IS_BANNER_ACTIVE) return
    const numberOfVisits = getCookie(NUMBER_OF_VISITS_COOKIE)
      ? Number(getCookie(NUMBER_OF_VISITS_COOKIE))
      : false
    const userDonated = getCookie(DONATED_COOKIE_NAME)

    if (!numberOfVisits && !userDonated) {
      setCookie(NUMBER_OF_VISITS_COOKIE, 1, this.expiracyTime)
      this.isVisible = true
    }

    if (numberOfVisits >= 7 && !userDonated && numberOfVisits % 3 == 0) {
      this.isVisible = true
      setCookie(NUMBER_OF_VISITS_COOKIE, numberOfVisits + 1, this.expiracyTime)
    } else if (!userDonated) {
      setCookie(NUMBER_OF_VISITS_COOKIE, numberOfVisits + 1, this.expiracyTime)
    }
  },
  methods: {
    handleClose() {
      this.isVisible = false
    },
    handleDonateLink() {
      setCookie(DONATED_COOKIE_NAME, true, this.expiracyTime)
      window.open(this.donationLink, '_blank')
      this.isVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.main-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 20;
  padding: 0.2rem;
  min-height: 6rem;

  width: 100%;
  background: white;

  display: flex;
  justify-content: center;

  min-height: 13rem;
  align-items: flex-start;

  .inner-wrapper {
    width: 66vw;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
  }

  .close-btn {
    margin-left: 1rem;
    margin-top: 0.4rem;
  }

  .message-wrapper {
    font-size: 1em;
  }

  .image {
    flex: 0 0 auto;
    height: 3rem;
  }

  @media screen and (min-width: 1125px) {
    align-items: center;
    min-height: 10rem;
    .inner-wrapper {
      width: 60vw;
    }

    .message-wrapper {
      font-size: 1.2em;
    }

    .close-btn {
      margin-top: 0;
      margin-left: 0;
    }

    .image {
      margin-left: 2rem;
    }

    .donate-link {
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
