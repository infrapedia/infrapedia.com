<template>
  <div class="flex column wrap justify-content-center no-overflow-x">
    <div class="banner-wrapper">
      <el-image
        lazy
        fit="cover"
        src="https://images.unsplash.com/photo-1577481759281-b2e3a1e62c2b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9"
        class="banner-img"
      />
    </div>
    <div class="gallery-wrapper">
      <header class="w-fit-full text-center">
        <h2 class="title">
          About us
        </h2>
      </header>
      <p class="content">
        Infrapedia is your team for the world’s largest internet infrastructure
        map access, plus services and data to help you improve your connectivity
        and engage directly with a global network of providers. We are the
        community's go-to provider for data, maps, and services.
      </p>

      <div>
        <h2 class="title">
          Our team
        </h2>
        <div class="boxes-wrapper mt20 mb20">
          <div class="box text-center" v-for="(p, i) of team" :key="i">
            <span class="img">
              <fa :icon="['fas', 'user']" />
            </span>
            <div>
              <strong class="inline-block mt4">
                {{ p.name }}
              </strong>
              <br />
              <p>{{ p.position }}</p>
            </div>
          </div>
        </div>
        <p class="content">
          Infrapedia is your team for the world’s largest internet
          infrastructure map access, plus services and data to help you improve
          your connectivity and engage directly with a global network of
          providers. We are the community's go-to provider for data, maps, and
          services.
        </p>
        <p class="content mb20">
          We are focused on network and data center infrastructures. We scour
          the Internet and maintain close relationships with key market players,
          industry specialists, and Internet resources to find infrastructure
          assets around the world and update our databases on a daily basis with
          subsea cable and data center statuses, outages, and social media
          posts.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  data: () => ({
    team: [
      {
        name: 'Mehmet Akcin',
        position: 'President'
      },
      {
        name: 'Naaz Bax',
        position: '{{ blank }}'
      },
      {
        name: 'Hubert Soisa',
        position: 'Director of Operations'
      },
      {
        name: 'José Martinez',
        position: 'Lead Engineer'
      },
      {
        name: 'Ali Kilic',
        position: 'GIS Engineer'
      },
      {
        name: 'Manuel Blanco',
        position: 'Front End Engineer'
      },
      {
        name: 'Diego Garzon',
        position: 'Director of Marketing'
      }
    ]
  }),
  beforeCreate() {
    this.$emit('layout', 'landing-layout')
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/pages/about-styles.scss';
</style>