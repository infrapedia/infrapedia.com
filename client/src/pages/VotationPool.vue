<template>
  <div class="main-wrapper flex row nowrap">
    <div
      class="votation-pool-wrapper transition-all"
      :class="{ 'no-width': currentStep == 4 }"
    >
      <h1 class="title text-center font-medium">
        {{ titles[currentStep] }}
      </h1>
      <el-image
        class="mt2 w-fit-full awards-image"
        src="https://cdn1.infrapedia.com/assets/awards.png"
        fit="scale-down"
      />
      <img class="hero" :src="currentImage" :src-set="currentImage" />
    </div>
    <template v-if="currentStep == 4">
      <transition name="fade" mode="out-in">
        <div>
          <header class="header">
            <router-link to="/app">
              <el-image
                class="mt2 ml4 logo-img"
                :src="imageURL"
                fit="scale-down"
              />
            </router-link>
            <div class="controllers flex row nowrap justify-content-end pr12">
              <el-button
                icon="el-icon-arrow-left"
                :disabled="isDisabledBackButton"
                class="mr4"
                circle
                @click="handleControllersButton(currentStep, 'previous')"
              />
              <el-button
                circle
                icon="el-icon-arrow-right"
                :disabled="isDisabledNextButton"
                @click="handleControllersButton(currentStep, 'next')"
              />
            </div>
          </header>
          <div
            class="options-wrapper final-step flex row justify-content-center"
          >
            <el-card class="p4 mt20 mr4">
              <header slot="header" class="p4">
                <h2>
                  Thank you for voting on the very first Infrapedia
                  Infrastructure Awards.
                </h2>
              </header>
              <p>
                Your votes:
              </p>

              <ul role="group">
                <li v-for="(key, i) in selectionsKeys" :key="i" class="mt2">
                  <!-- <span
                    v-if="i >= selectionsKeys.length - 1"
                    class="block w-fit-full"
                  >
                    And
                  </span> -->
                  <strong>
                    {{ selections[key] }}
                  </strong>
                  as {{ key }}
                </li>
              </ul>
              <el-button
                @click="submitVotes"
                class="mt8"
                type="success"
                :loading="sendingData"
              >
                Submit votes
              </el-button>
            </el-card>
          </div>
        </div>
      </transition>
    </template>
    <template v-else>
      <transition name="fade" mode="out-in">
        <div style="width: 50vw">
          <header class="header">
            <router-link to="/app">
              <el-image
                class="mt2 ml4 logo-img"
                :src="imageURL"
                fit="scale-down"
              />
            </router-link>
            <template>
              <div
                class="controllers flex row nowrap justify-content-end pr12 mt4"
              >
                <el-button
                  icon="el-icon-arrow-left"
                  :disabled="isDisabledBackButton"
                  class="mr4"
                  @click="handleControllersButton(currentStep, 'previous')"
                >
                  Prev. category
                </el-button>
                <el-button
                  :disabled="isDisabledNextButton"
                  @click="handleControllersButton(currentStep, 'next')"
                >
                  Next. category
                  <i class="el-icon-arrow-right" />
                </el-button>
              </div>
            </template>
            <el-divider />
            <p class="text-center">
              {{ subtitle[currentStep] }}
            </p>
          </header>
          <div class="search-wrapper">
            <el-form class="p4">
              <el-form-item :label="searchLabel">
                <el-input
                  placeholder
                  :autofocus="true"
                  v-model="search"
                  @input="searchElement"
                />
              </el-form-item>
            </el-form>
          </div>
          <div
            v-if="isSearching || currentStep != 0"
            class="options-wrapper overflow-y-auto mt4 overflow-x-hidden"
          >
            <el-button
              v-for="(opt, i) in steps[currentStep].filter(
                data =>
                  !search || data.toLowerCase().includes(search.toLowerCase())
              )"
              :key="i"
              class="votation-button capitalize p4 transition-all"
              type="text"
              :class="{
                selected: selections[titles[currentStep]].includes(opt)
              }"
              @click="handleSelection(currentStep, opt)"
            >
              {{ opt }}
            </el-button>
          </div>
        </div>
      </transition>
    </template>
  </div>
</template>

<script>
import debounce from '../helpers/debounce'
import { vote } from '../services/api/voting'
import { steps } from '../config/votingSteps'
import { checkUserVote } from '../services/api/voting'

export default {
  data: () => ({
    isSearching: false,
    sendingData: false,
    search: '',
    subtitle: [
      'Choose one subsea cable system below',
      'Choose one of the Internet Exchanges below',
      'Choose one of the Telecom Companies below',
      'Choose one the datacenter companies below'
    ],
    titles: [
      'Best Subsea Cable System',
      'Best Internet Exchange',
      'Best International Telecommunications Company',
      'Best Datacenter Company'
    ],
    selections: {
      'Best Internet Exchange': '',
      'Best Datacenter Company': '',
      'Best Subsea Cable System': '',
      'Best International Telecommunications Company': ''
    },
    currentStep: 0
  }),
  computed: {
    steps() {
      return steps
    },
    isDisabledBackButton() {
      return this.currentStep == 0
    },
    searchLabel() {
      let label = 'Search for any subsea cable you like'
      switch (this.currentStep) {
        case 1:
          label = 'Search for any Internet Exchanges you like'
          break
        case 2:
          label = 'Search for any Telecom companies you like'
          break
        case 3:
          label = 'Search for any datacenter you like'
          break
        case 4:
          label = ''
          break
        default:
          label = 'Search for any subsea cable you like'
          break
      }
      return label
    },
    isDisabledNextButton() {
      return (
        this.selections[this.titles[this.currentStep]] == '' ||
        this.currentStep == 4
      )
    },
    currentImage() {
      let src = 'https://cdn1.infrapedia.com/assets/bgs/subsea.jpg'

      switch (this.currentStep) {
        case 1:
          src = 'https://cdn1.infrapedia.com/assets/bgs/ixp.jpg'
          break
        case 2:
          src = 'https://cdn1.infrapedia.com/assets/bgs/telecomunication.jpg'
          break
        case 3:
          src = 'https://cdn1.infrapedia.com/assets/bgs/server.jpg'
          break
        case 4:
          src = ''
          break
        default:
          src = 'https://cdn1.infrapedia.com/assets/bgs/subsea.jpg'
          break
      }
      return src
    },
    imageURL() {
      return this.dark
        ? 'https://cdn1.infrapedia.com/assets/img/dark-mode-logo.svg'
        : 'https://cdn1.infrapedia.com/assets/img/light-mode-logo.svg'
    },
    selectionsKeys() {
      return Object.keys(this.selections)
    },
    imageURLSphere() {
      return this.dark
        ? 'https://cdn1.infrapedia.com/assets/img/dark-mode-logo-sphere.svg'
        : 'https://cdn1.infrapedia.com/assets/img/light-mode-logo-sphere.svg'
    }
  },
  async created() {
    this.$emit('layout', 'nothing-layout')
    await this.checkVote()
  },
  methods: {
    searchElement(s) {
      this.isSearching = Boolean(s)
    },
    checkVote: debounce(async function() {
      const { t } = (await checkUserVote(await this.$auth.getUserID())) || {
        t: 'error'
      }
      if (t == 'error') {
        this.$message('You already have a vote')
        setTimeout(() => {
          this.$router.replace('/app')
        }, 820)
      }
    }, 2600),
    handleSelection(currentStep, opt) {
      if (this.selections[this.titles[currentStep]] == opt) {
        this.selections[this.titles[currentStep]] = ''
        return
      }
      this.selections[this.titles[currentStep]] = opt
    },
    handleControllersButton(currentStep, btn) {
      let forwardPositionTo = currentStep
      if (btn == 'next') {
        if (currentStep < 4) {
          if (this.selections[this.titles[this.currentStep + 1]] != '') {
            this.search = this.selections[this.titles[this.currentStep + 1]]
            this.isSearching = true
          } else {
            this.search = ''
            this.isSearching = false
          }
          forwardPositionTo += 1
        }
      } else if (btn == 'previous') {
        if (!currentStep <= 5 && currentStep > 0) {
          this.search = this.selections[this.titles[this.currentStep - 1]]
          this.isSearching = true
          forwardPositionTo -= 1
        }
      }
      this.currentStep = forwardPositionTo
    },
    async submitVotes() {
      this.sendingData = true
      const { t } = await vote({
        user_id: await this.$auth.getUserID(),
        votes: this.selections
      })
      if (t != 'error') {
        this.$router.replace('/app')
      }
      this.sendingData = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/pages/votation-pool-styles.scss';
</style>
