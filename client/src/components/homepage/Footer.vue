<template>
  <el-footer height="100%" class="footer p0 pt20 pb20">
    <div class="form-wrapper">
      <div class="inner-wrapper pt16 pb20 mt16">
        <h1 class="title inline-block white">
          Contact us
        </h1>
        <el-form :rules="formRules" :model="form" class="p8 form">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Name" prop="name" required>
                <el-input v-model="form.name" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Email" prop="email" required>
                <el-input v-model="form.email" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Message" prop="msg">
                <el-input type="textarea" :rows="4" v-model="form.msg" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <div class="flex mt4 row justify-content-end">
                  <el-button type="primary">
                    Send
                  </el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-divider />
    </div>
    <div class="inner-wrapper">
      <div class="logo-wrapper">
        <h1 class="logo-title inline-block">
          <router-link to="/">
            <el-image class="mt2 logo-img" :src="imageURL" fit="scale-down" />
          </router-link>
        </h1>
        <p class="fs-small mt4">
          {{ year }} Copyright, All Rights Reserved by Infrapedia Inc.
        </p>
      </div>
      <!-- <el-divider class="transparent w80 hidden-md-and-down"></el-divider> -->
      <div class="links-wrapper">
        <h3 class="title-link m0 mb8">Explore</h3>
        <ul role="group">
          <li class="list-item mb6" v-for="(link, i) in exploreLinks" :key="i">
            <a
              v-if="link.tab"
              :href="link.url"
              target="_blank"
              class="underline-hover color-inherit"
            >
              {{ link.label }}
            </a>
            <router-link
              v-else
              :to="link.url"
              class="underline-hover color-inherit"
              v-text="link.label"
            />
          </li>
        </ul>
      </div>
      <div class="links-wrapper">
        <h3 class="title-link m0 mb8">Company</h3>
        <ul role="group">
          <li
            class="list-item mb6"
            v-for="(link, i) in infoMenuLinks.info"
            :key="i"
          >
            <a
              v-if="link.openTab"
              :href="link.url"
              target="_blank"
              class="underline-hover color-inherit"
            >
              {{ link.label }}
            </a>
            <router-link
              v-else
              :to="link.url"
              class="underline-hover color-inherit"
              v-text="link.label"
            />
          </li>
          <li class="list-item mb6">
            <router-link
              class="underline-hover color-inherit"
              to="/terms-and-conditions"
            >
              Terms & Conditions
            </router-link>
          </li>
          <li class="list-item mb6">
            <router-link
              class="underline-hover  color-inherit"
              to="/privacy-policy"
            >
              Privacy Policy
            </router-link>
          </li>
        </ul>
      </div>
      <div class="links-wrapper">
        <h3 class="title-link m0 mb8">Social</h3>
        <ul role="group">
          <li
            class="list-item mb6"
            v-for="(link, i) in infoMenuLinks.social"
            :key="i"
          >
            <a
              :href="link.url"
              target="_blank"
              class="underline-hover color-inherit"
            >
              {{ link.label }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </el-footer>
</template>

<script>
import infoMenuLinks from '../../config/infoMenuLinks'
import currentYear from '../../helpers/currentYear'

export default {
  name: 'HFooter',
  data: () => ({
    infoMenuLinks,
    exploreLinks: [
      {
        label: 'Home',
        url: '/'
      },
      {
        label: 'Blog',
        url: 'https://infrapedia.com/blog',
        tab: true
      },
      {
        label: 'Services',
        url: '/services'
      },
      {
        label: 'Sponsorships',
        url: '/sponsorships'
      }
    ],
    form: {
      name: '',
      email: '',
      msg: ''
    },
    formRules: {
      name: [
        {
          required: true,
          message: 'Please input your full name',
          trigger: 'change'
        }
      ],
      email: [
        {
          type: 'email',
          message: 'Please input a valid email address',
          trigger: ['blur', 'change']
        }
      ],
      msg: []
    }
  }),
  computed: {
    year() {
      return currentYear()
    },
    imageURL() {
      return !this.dark
        ? 'https://cdn.infrapedia.com/logos/dark-mode-logo.svg'
        : 'https://cdn.infrapedia.com/logos/light-mode-logo.svg'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/footer-homepage-styles.scss';
</style>
