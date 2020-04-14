<template>
  <div class="flex column wrap justify-content-center no-overflow-x mb20">
    <div class="banner-wrapper">
      <img
        srcset="https://images.unsplash.com/photo-1577481759281-b2e3a1e62c2b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9"
        src="https://images.unsplash.com/photo-1577481759281-b2e3a1e62c2b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9"
        class="banner-img"
      />
    </div>
    <el-card class="card-wrapper">
      <header class="w-fit-full text-center">
        <h2 class="title">
          Services & Consulting
        </h2>
        <el-divider />
      </header>
      <div class="services-wrapper">
        <router-link to="/contact" class="inner-wrapper cursor-pointer">
          <el-card shadow="hover" class="p8">
            <header class="inner-wrapper_header">
              <h2 class="title sm">
                Consultancy
              </h2>
              <span class="md-icon">
                <fa :icon="['fas', 'chalkboard-teacher']" />
              </span>
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
            <router-link
              to="/contact"
              class="underline-hover inline-block mt12"
            >
              Learn more
              <span class="fs-xsmall font-thin ml1">
                <fa :icon="['fas', 'angle-double-right']" />
              </span>
            </router-link>
          </el-card>
        </router-link>
        <router-link to="/contact" class="inner-wrapper cursor-pointer">
          <el-card shadow="hover" class="p8">
            <header class="inner-wrapper_header">
              <h2 class="title sm">
                Data analysis
              </h2>
              <span class="md-icon">
                <fa :icon="['fas', 'chart-area']" />
              </span>
            </header>
            <p class="text">
              Our Data Analysis services give you access to our team of analysts
              and engineers who can help you gain insights into Infrapedia’s
              ever-growing infrastructure database.
            </p>
            <p class="text">
              We are able to provide you with detailed specifications of data
              centers and subsea cable systems or build custom analysis software
              to analyze our database in order to find answers to your specific
              questions.
            </p>
            <router-link
              to="/contact"
              class="underline-hover inline-block mt12"
            >
              Learn more
              <span class="fs-xsmall font-thin ml1">
                <fa :icon="['fas', 'angle-double-right']" />
              </span>
            </router-link>
          </el-card>
        </router-link>
        <router-link to="/contact" class="inner-wrapper cursor-pointer">
          <el-card shadow="hover" class="p8">
            <header class="inner-wrapper_header">
              <h2 class="title sm">
                Custom Maps and GIS engineering
              </h2>
              <span class="md-icon">
                <fa :icon="['fas', 'map']" />
              </span>
            </header>
            <p class="text">
              At Infrapedia we have extensive knowledge about developing
              (interactive) maps and GIS.
            </p>
            <p class="text">
              Our Custom Maps and GIS engineering services allow all types of
              organizations, from universities and nonprofit organizations to
              government entities and hyper-scale cloud providers, to add third
              party information for analysis, NOC operations, dedicated maps,
              and more.
            </p>
            <router-link
              to="/contact"
              class="underline-hover inline-block mt12"
            >
              Learn more
              <span class="fs-xsmall font-thin ml1">
                <fa :icon="['fas', 'angle-double-right']" />
              </span>
            </router-link>
          </el-card>
        </router-link>
        <router-link to="/contact" class="inner-wrapper cursor-pointer">
          <el-card shadow="hover" class="p8">
            <header class="inner-wrapper_header">
              <h2 class="title sm">
                Software Development
              </h2>
              <span class="md-icon">
                <fa :icon="['fas', 'code']" />
              </span>
            </header>
            <p class="text">
              Our Infrapedia team consists of skilled software engineers who are
              able to work with you on the development of the software you need
              to increase your team’s efficiency and profitability.
            </p>
            <router-link
              to="/contact"
              class="underline-hover inline-block mt12"
            >
              Learn more
              <span class="fs-xsmall font-thin ml1">
                <fa :icon="['fas', 'angle-double-right']" />
              </span>
            </router-link>
          </el-card>
        </router-link>
        <router-link to="/contact" class="inner-wrapper cursor-pointer">
          <el-card shadow="hover" class="p8">
            <header class="inner-wrapper_header">
              <h2 class="title sm">
                Marketing and Communications
              </h2>
              <span class="md-icon">
                <fa :icon="['fas', 'bullhorn']" />
              </span>
            </header>
            <p class="text">
              Need help with marketing or communications for your organization
              or project? Our platform and our sales and marketing department
              are continuously in contact with people in the telecommunications
              and Internet market and are able to help you with Content
              Development (blogs, articles, presentations, white papers, case
              studies), Online marketing, branding, Client Representation on
              events, and overall comprehensive marketing strategies.
            </p>
            <router-link
              to="/contact"
              class="underline-hover inline-block mt12"
            >
              Learn more
              <span class="fs-xsmall font-thin ml1">
                <fa :icon="['fas', 'angle-double-right']" />
              </span>
            </router-link>
          </el-card>
        </router-link>
      </div>
      <footer class="mt8">
        <el-divider />
        <router-link to="/contact" class="underline-hover cursor-pointer">
          Contact us</router-link
        >
        or
        <el-button
          type="text"
          @click="showPopup"
          class="cursor-pointer fs-medium underline-hover"
          >subscribe</el-button
        >
        to our newsletter
      </footer>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ServicesPage',
  beforeCreate() {
    this.$emit('layout', 'landing-layout')
  },
  methods: {
    showPopup() {
      return console.warn('not done yet')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/pages/services-styles.scss';
</style>
