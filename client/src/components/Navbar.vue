<template>
  <header class="header fixed h12 w-full no-padding">
    <div class="header-inner-wrapper w-full flex relative h-fit-full">
      <div class="flex no-padding navbar-wrapper w-full justify-content-space-between pr6 pl6">
        <h1 class="logo-title">
          <router-link to="/">
            <el-image class="mt2 logo-img" :src="imageURL" fit="scale-down" />
          </router-link>
        </h1>
        <!-- <el-menu
          mode="horizontal"
          default-active="2"
          class="transparent"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>Navigator One</span>
            </template>
            <el-menu-item-group title="Group One">
              <el-menu-item index="1-1">item one</el-menu-item>
              <el-menu-item index="1-2">item one</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Group Two">
              <el-menu-item index="1-3">item three</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template slot="title">item four</template>
              <el-menu-item index="1-4-1">item one</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span>Navigator Two</span>
          </el-menu-item>
          <el-menu-item index="3" disabled>
            <i class="el-icon-document"></i>
            <span>Navigator Three</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span>Navigator Four</span>
          </el-menu-item>
        </el-menu>-->
        <ul class="links-wrapper p0 m0 h-fit-full" tabindex="0">
          <li class="inline-block h-fit-full">
            <div class="list-item">
              <el-button type="text">
                Ours Partners
                <i class="el-icon-arrow-down icon-sm ml1" />
              </el-button>
              <div></div>
            </div>
          </li>
          <el-divider direction="vertical" />
          <li class="inline-block">
            <div class="list-item">
              <el-button type="text">
                Submarine Cables
                <i class="el-icon-arrow-down icon-sm ml1" />
              </el-button>
              <div></div>
            </div>
          </li>
          <el-divider direction="vertical" />
          <li class="inline-block">
            <div class="list-item">
              <el-button type="text">
                Data Centers
                <i class="el-icon-arrow-down icon-sm ml1" />
              </el-button>
              <div></div>
            </div>
          </li>
          <el-divider direction="vertical" />
          <li class="inline-block">
            <div class="list-item">
              <el-button type="text">
                IXPs
                <i class="el-icon-arrow-down icon-sm ml1" />
              </el-button>
              <div></div>
            </div>
          </li>
          <el-divider direction="vertical" />
          <li class="inline-block">
            <div class="list-item">
              <el-button type="text">
                Networks
                <i class="el-icon-arrow-down icon-sm ml1" />
              </el-button>
              <div></div>
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
