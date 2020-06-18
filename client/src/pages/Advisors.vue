<template>
  <div
    class="p4 pt20 mb20 flex justify-content-center align-items-center column main-wrapper"
  >
    <h1 class="title font-medium">
      Infrapedia Advisory Board
    </h1>
    <ul class="mt20 list-wrapper" role="group">
      <li v-for="(advisor, i) in advisors" :key="i">
        <div class="el-card p4 mb4 relative">
          <p>
            {{ advisor.name }}
          </p>
          <div class="flo-right cursor-pointer link--wrapper">
            <a
              class="link"
              :href="advisor.link"
              target="_blank"
              :title="`${advisor.name.split(',')[0]}'s Linkedin`"
            >
              <i class="el-icon-share" />
            </a>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data: () => ({
    advisors: [
      {
        name: 'Amy Marks, Autodesk/PTC',
        link: 'https://www.linkedin.com/in/amykulkamarks/'
      },
      {
        name: 'Anne-Marie Eklund Löwinder, Swedish Internet Foundation',
        link: 'https://www.linkedin.com/in/annemarieeklundlowinder/'
      },
      {
        name: 'Arnold Nipper, Evangelist DE-CIX',
        link: 'https://www.linkedin.com/in/arnoldnipper/'
      },
      {
        name: "Brynn Fowler, Women's Tech Forum",
        link: 'https://www.linkedin.com/in/brynnfowler/'
      },
      {
        name: 'Carlos Martinez, LACNIC',
        link: 'https://www.linkedin.com/in/carlosm3011/'
      },
      {
        name: 'Chris Street,  Princeton Digital Group',
        link: 'https://www.linkedin.com/in/chrisstreet/'
      },
      {
        name: 'Dave Crowley, Birch Infrastructure, PBLLC',
        link: 'https://www.linkedin.com/in/dave-crowley-007647/'
      },
      {
        name: 'Eric Handa, AP Telecom',
        link: 'https://www.linkedin.com/in/erichanda/'
      },
      {
        name: 'Greg Mahlknecht, Always Active Technologies',
        link: 'https://www.linkedin.com/in/greg-mahlknecht-9b544019/'
      },
      {
        name: 'Jason Black, Ph.D., Uber Technologies',
        link: 'https://www.linkedin.com/in/jmb/'
      },
      {
        name: 'James Daquino, ICM Partners',
        link: 'https://www.linkedin.com/in/daquino/'
      },
      {
        name: 'Mehdi Daoudi, Catchpoint',
        link: 'https://www.linkedin.com/in/mdaoudi/'
      },
      {
        name: 'Naaz Bax, Seaborn Networks',
        link: 'https://www.linkedin.com/in/naaz-bax-015889114/'
      },
      {
        name: 'Nigel Bayliff, Aqua comms',
        link: 'https://www.linkedin.com/in/nigel-bayliff-969277/'
      },
      {
        name: 'Zach Smith, Equinix',
        link: 'https://www.linkedin.com/in/zsmith/'
      }
    ]
  }),
  created() {
    this.$emit('layout', 'default')
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/pages/advisors-styles.scss';
</style>
