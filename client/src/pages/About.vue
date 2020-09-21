<template>
  <div
    class="main-wrapper flex column wrap justify-content-center no-overflow-x pt20"
  >
    <div class="inner-wrapper">
      <template>
        <header>
          <h1 class="title mb8">
            About us
          </h1>
        </header>
        <p class="content">
          Our focus is to show the layer 1 structure of the global Internet and
          develop a platform that allows community members to engage directly
          with infrastructure and datacenter providers to swap resources, see
          special deals and more. No commissions, no bias.
        </p>
        <p class="content">
          We scour the Internet and maintain close relationships with key market
          players, industry specialists and Internet resources to find
          infrastructure assets around the world and update our databases on a
          daily basis with subsea cable and data center statuses, outages, and
          social media posts.
        </p>
        <p class="content">
          Infrapedia is the only available public tool for engineers,
          decision-makers and infrastructure experts that gives an operational
          global view of the internet infrastructure to support identifying
          possible areas of expansion, new opportunities and potential
          collaborations with other community members.
        </p>
        <p class="content">
          We do not stand alone. With the help of our
          <router-link to="/advisory-board">Board of Advisors</router-link>
          consisting of industry specialists, we are developing awareness of our
          community, reaching out to other carriers, service providers and
          Internet business such as Google, Microsoft and Facebook. And with the
          help from our Partners and
          <router-link to="/sponsors">Sponsors</router-link>
          Infrapedia is able to keep providing the world’s most realistic view
          of the internet infrastructure for free by assuring the long term
          sustainability of the platform and community.
        </p>
      </template>

      <div class="team-wrapper w-fit-full mb20 mt20">
        <h2 class="title">
          Our team
        </h2>
        <div class="boxes-wrapper flex row wrap mt20 mb20">
          <div
            class="box text-center mb12"
            v-for="(p, i) of teamMembers"
            :key="i"
          >
            <div class="image-wrapper">
              <el-image class="img circle" lazy :src="p.photo" />
            </div>
            <div class="text-wrapper">
              <span class="font-bold mb1 inline-block">
                {{ p.name }}
              </span>
              <br />
              <span class="title sm diff">{{ p.position }}</span>
            </div>
          </div>
        </div>
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
    ],
    link: [
      {
        rel: 'canonical',
        href: `${window.origin}/about`
      }
    ]
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/pages/about-styles.scss';
</style>
