<template>
  <div
    class="main-wrapper flex column wrap justify-content-center no-overflow-x"
  >
    <div class="banner-wrapper mb8">
      <el-image
        lazy
        fit="cover"
        src="https://cdn1.infrapedia.com/bgs/b3.jpg"
        class="banner-img"
      />
    </div>
    <div class="gallery-wrapper">
      <header class="w-fit-full text-center">
        <h1 class="title mb8">
          About us
        </h1>
      </header>
      <p class="content">
        Infrapedia is a crowd-sourced near real-time map of the global internet
        infrastructure detailing the world’s submarine and terrestrials
        networks. You can add networks to the map and update listings with more
        accurate information, track outages and explore possible areas of
        expansion. We're a community that seeks to give engineers an operational
        global view of the internet infrastructure. We connect network
        procurement professionals directly with infrastructure owners. We have
        more than 3,500 datacenters, 15,000 networks, and hundreds of submarine
        and terrestrial network providers.
      </p>

      <div class="team-wrapper">
        <h2 class="title">
          Our team
        </h2>
        <div class="boxes-wrapper mt20 mb20">
          <div class="box text-center" v-for="(p, i) of teamMembers" :key="i">
            <div class="image-wrapper">
              <el-image class="img" lazy :src="p.photo" />
            </div>
            <div class="text-wrapper">
              <strong class="inline-block mt4">
                {{ p.name }}
              </strong>
              <br />
              <p class="title sm diff">{{ p.position }}</p>
            </div>
          </div>
        </div>
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
import teamMembers from '../config/teamMembers'

export default {
  name: 'About',
  data: () => ({
    teamMembers
  }),
  head: {
    title: 'Infrapedia | About Us | Global Internet Infrastructure Map',
    meta: [
      {
        name: 'description',
        content:
          'Meet the team that makes Infrapedia possible. We are committed to bringing you a reliable source of information and services regarding the world’s internet infrastructure.'
      },
      {
        name: 'keywords',
        content:
          'internet map, global internet infrastructure, submarine cable map. telecommunications, network pops, world internet structure'
      }
    ]
  },
  beforeCreate() {
    this.$emit('layout', 'landing-layout')
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/pages/about-styles.scss';
</style>
