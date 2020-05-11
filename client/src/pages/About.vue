<template>
  <div class="flex column wrap justify-content-center no-overflow-x">
    <div class="banner-wrapper">
      <el-image
        lazy
        fit="cover"
        src="https://cdn1.infrapedia.com/bgs/b3.jpg"
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
          <div class="box text-center" v-for="(p, i) of teamMembers" :key="i">
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
