<template>
  <div class="main-wrapper flex row nowrap">
    <div
      class="votation-pool-wrapper transition-all"
      :class="{ 'no-width': currentStep == 4 }"
    >
      <h2 class="title fs-xlarge text-center font-medium">
        {{ titles[currentStep] }}
      </h2>
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
                You vote:
              </p>

              <ul role="group">
                <li v-for="(key, i) in selectionsKeys" :key="i" class="mt2">
                  <span v-if="i >= selectionsKeys.length - 1"> And </span>
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
          <div class="options-wrapper overflow-y-auto mt4 overflow-x-hidden">
            <el-button
              v-for="(opt, i) in steps[currentStep]"
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
import { checkUserVote } from '../services/api/voting'

export default {
  data: () => ({
    sendingData: false,
    steps: {
      0: [
        'AEC-1',
        'Crosslake-Fibre',
        'INDIGO-Central',
        'INDIGO-West',
        'BRUSA',
        'Hawaiki',
        'JUNIOR',
        'MAREA',
        'New Cross Pacific (NCP) Cable System',
        'South Atlantic Cable System (SACS)',
        'South Atlantic Inter Link (SAIL)',
        'Tannat',
        'Monet',
        'SEA-US',
        'Seabras-1',
        'Asia Pacific Gateway (APG)',
        'Bay of Bengal Gateway (BBG)',
        'FASTER',
        'SMW-5/SeaMeWe-5',
        'GTT Express',
        'Pacific Caribbean Cable System (PCCS)'
      ],
      1: [
        'Brazil Internet Exchange (IX.br)',
        'Deutscher Commercial Internet Exchange (DE-CIX)',
        'Amsterdam Internet Exchange (AMS-IX)',
        'London Internet Exchange (LINX)',
        'France-IX',
        'Equinix Exchange',
        'Seattle Internet Exchange (SIX)',
        'Hong Kong Internet eXchange (HKIX)',
        'Japan Network Access Point (JPNAP)',
        'JPIX',
        'BBIX',
        'Neutral Internet Exchange (NL-ix)',
        'Netnod Internet Exchange in Sweden (Netnod)',
        'FL-IX',
        'SFMIX',
        'Toronto Internet Exchange ( TorIX )',
        'Coresite Any2 Los Angeles',
        'PITChile',
        'MKS-IX'
      ],
      2: [
        'Global Cloud Exchange',
        'Colt',
        'EUNetworks',
        'Tata Communications',
        'America Movil',
        'AT&T',
        'BT',
        'Orange',
        'Vodafone',
        'GTT',
        'C&W Networks',
        'NTT',
        'PCCW',
        'KDDI',
        'Softbank Telecom',
        'Level 3',
        'Telstra',
        'Verizon',
        'Turk Telekom',
        'Zayo Group',
        'China Telecom',
        'Deutsche Telecom'
      ],
      3: [
        'QTS',
        'Interxion',
        'Equinix',
        'Coresite',
        'Cyxtera',
        'ST Telemedia Global Data Centres (STT GDC)',
        'Macquarie Data Centers',
        'Global Switch',
        'Digital Realty',
        'CenturyLink',
        'NTT',
        'Zayo',
        'Durand',
        'Iron Mountain',
        'Flexential',
        'Xfernet'
      ]
    },
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
    isDisabledBackButton() {
      return this.currentStep == 0
    },
    isDisabledNextButton() {
      return (
        this.selections[this.titles[this.currentStep]] == '' ||
        this.currentStep == 4
      )
    },
    currentImage() {
      let src =
        'https://pmiind.com/wp-content/uploads/2015/07/ThinkstockPhotos-178547455.jpg'
      switch (this.currentStep) {
        case 1:
          src = 'https://guardian.ng/wp-content/uploads/2017/09/IXPN.jpg'
          break
        case 2:
          src =
            'https://www.5gexpo.net/wp-content/uploads/2019/12/Convergence.jpg'
          // 'https://lh3.googleusercontent.com/proxy/LII-QvAdKxTMKmUeLYOSDXaqbeY_uJlYEKsvpgmLqDE-ffTVfJPUZG9naUiR8-vBQ8-UYaFCigORLtxUoCce1891IX0XF5yXXXJNRspp3ma-qqYAEK_VUhi9er6hz0VhIWE'
          break
        case 3:
          src =
            'https://techinsight.com.vn/wp-content/uploads/2018/03/Untitled-1-26.gif'
          // 'https://images.squarespace-cdn.com/content/v1/59cac734cf81e0d666427339/1519699440248-4CBSR9QAXYE8N9GHXGZH/ke17ZwdGBToddI8pDm48kKcRVY9umB9R8cjGM3icMg97gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1Uf-wI1g1jgQRccHdfXj0wGS2Kn0KFv_ADIi2jEwiLX0TZ4SODUbdTU85jG6Jwp5K1Q/data-centers.jpg?format=2500w'
          break
        case 4:
          src = ''
          // 'https://images.squarespace-cdn.com/content/v1/59cac734cf81e0d666427339/1519699440248-4CBSR9QAXYE8N9GHXGZH/ke17ZwdGBToddI8pDm48kKcRVY9umB9R8cjGM3icMg97gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1Uf-wI1g1jgQRccHdfXj0wGS2Kn0KFv_ADIi2jEwiLX0TZ4SODUbdTU85jG6Jwp5K1Q/data-centers.jpg?format=2500w'
          break
        default:
          src =
            'https://pmiind.com/wp-content/uploads/2015/07/ThinkstockPhotos-178547455.jpg'
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
    checkVote: debounce(async function() {
      const { t } = await checkUserVote(await this.$auth.getUserID())
      if (t == 'error') {
        this.$message('You already have a vote')
        setTimeout(() => {
          this.$router.replace('/app')
        }, 820)
      }
    }, 1200),
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
          forwardPositionTo += 1
        }
      } else if (btn == 'previous') {
        if (!currentStep <= 5 && currentStep > 0) {
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
