<template>
  <div class="votation-pool" v-loading="isCheckingVote">
    <header class="flex justify-content-center column">
      <h2 class="title text-center">
        Infrapedia Infrastructure Awards
        <el-button
          icon="el-icon-refresh-right"
          circle
          size="mini"
          id="refresh-btn"
          title="Load votes results"
          @click="loadVotesPool"
        />
      </h2>
    </header>
    <el-divider class="transparent mt12 mb12" />
    <div class="pool-wrapper">
      <div
        class="pool_inner-wrapper el-card p4"
        v-for="(category, i) in categories"
        :key="i"
        v-loading="loadingVotes"
      >
        <h2 class="text-left">
          {{ category }}
        </h2>
        <ul class="list-wrapper" role="group">
          <template v-for="(vote, y) in votesPool[category]">
            <li :key="category + y" class="mt4">
              <span> {{ vote._id }}</span>
              <el-progress
                :stroke-width="12"
                :percentage="calculatePercentage(vote)"
              />
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { checkUserVote, getVotes } from '../services/api/voting'

export default {
  data: () => ({
    votesPool: {},
    isCheckingVote: true,
    loadingVotes: false,
    categories: [
      'Best Subsea Cable System',
      'Best Internet Exchange',
      'Best International Telecommunications Company',
      'Best Datacenter Company'
    ]
  }),
  async created() {
    this.$emit('layout', 'default')
    await this.checkVote()
  },
  async mounted() {
    await this.loadVotesPool()
  },
  methods: {
    async checkVote() {
      this.isCheckingVote = true
      const { t } = (await checkUserVote(await this.$auth.getUserID())) || {
        t: 'error'
      }

      this.isCheckingVote = false
      if (t != 'error') {
        this.$message(
          'You have not voted yet. For seeing the results, you first have to vote'
        )
        setTimeout(() => this.$router.replace('/app'), 320)
      }
    },
    calculatePercentage(vote) {
      return Math.round((vote.votes * 100) / vote.totalVotes)
    },
    async loadVotesPool() {
      try {
        this.loadingVotes = true
        const {
          data: { r: votes = [] }
        } = (await getVotes()) || {
          data: {
            votes: []
          }
        }
        const votesPerCategory = {}

        for (let category of this.categories) {
          const filteredCategories = votes
            .map(vote => {
              if (vote.category == category) {
                return vote
              } else return false
            })
            .filter(vote => vote)
            .sort((a, b) => b.votes - a.votes)

          votesPerCategory[category] = filteredCategories
            .map((item, i) => (i <= 4 ? item : false))
            .filter(item => item)
            .sort((a, b) => {
              return a._id[0] > b._id[0]
            })
        }

        this.loadingVotes = false
        this.votesPool = votesPerCategory
      } catch {
        // Ignore
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/pages/votes-results-styles.scss';
</style>
