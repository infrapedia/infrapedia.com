<template>
  <header class="header fixed h12 w-full no-padding">
    <div class="header-inner-wrapper w-full flex relative h-fit-full">
      <div class="flex no-padding navbar-wrapper w-full justify-content-space-between pr6 pl6">
        <h1 class="logo-title">
          <router-link to="/">
            <el-image class="mt2 logo-img" :src="imageURL" fit="scale-down" />
          </router-link>
        </h1>
        <ul class="links-wrapper p0 m0 h-fit-full">
          <li class="inline-block relative" tabindex="0">
            <div class="list-item pr4 pl4" aria-haspopup="true">
              Our Partners
              <i aria-hidden="true" class="el-icon-arrow-down icon sm-icon ml1" />
            </div>
          </li>
          <el-divider direction="vertical" class="m0" />
          <li class="inline-block relative" tabindex="0">
            <div class="list-item pr4 pl4" aria-haspopup="true">
              Submarine Cables
              <i aria-hidden="true" class="el-icon-arrow-down icon sm-icon ml1" />
            </div>
          </li>
          <el-divider direction="vertical" class="m0" />
          <li class="inline-block relative" tabindex="0">
            <div class="list-item pr4 pl4" aria-haspopup="true">
              Data Centers
              <i aria-hidden="true" class="el-icon-arrow-down icon sm-icon ml1" />
            </div>
          </li>
          <el-divider direction="vertical" class="m0" />
          <li class="inline-block relative" tabindex="0">
            <div class="list-item pr4 pl4" aria-haspopup="true">
              IXPs
              <i aria-hidden="true" class="el-icon-arrow-down icon sm-icon ml1" />
            </div>
          </li>
          <el-divider direction="vertical" class="m0" />
          <li class="inline-block relative" tabindex="0">
            <div class="list-item pr4 pl4" aria-haspopup="true">
              Networks
              <i aria-hidden="true" class="el-icon-arrow-down icon sm-icon ml1" />
            </div>
          </li>
          <el-divider direction="vertical" class="m0" />
          <li class="inline-block outline0 relative" tabindex="0">
            <div class="list-item user-icon nobg pr1 pl1" aria-haspopup="true">
              <div class="pt2">
                <el-avatar icon="el-icon-user-solid" size="small" />
              </div>
            </div>
          </li>
          <li class="inline-block outline0 relative" tabindex="0">
            <div class="list-item nobg info-menu pr1 pl1" role="user" aria-haspopup="true">
              <div class="p2 circle icon-wrapper">
                <i aria-hidden="true" class="el-icon-more icon sm-icon" />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'INavbar',
  data: () => ({
    activeIndex: '1'
  }),
  computed: {
    imageURL() {
      return this.theme
        ? 'https://cdn.infrapedia.com/logos/dark-mode-logo.svg'
        : 'https://cdn.infrapedia.com/logos/light-mode-logo.svg'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/navbar-styles.scss';
</style>
