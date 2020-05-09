<template>
  <div class="main-wrapper">
    <div class="banner-wrapper">
      <el-image
        lazy
        fit="cover"
        src="https://cdn1.infrapedia.com/bgs/b1.jpg"
        class="banner-img"
      />
    </div>
    <div class="section-wrapper">
      <el-card class="card-wrapper">
        <h1 class="title text-center mb8">
          Sponsorships
        </h1>
        <div class="p8">
          <p class="content">
            Our Sponsorship Packages are a unique opportunity for you and your
            brand to be <span class="highlight">highlighted</span> all
            throughout our Infrapedia platforms and points of presence.
          </p>
          <p class="content">
            With multiple online platforms that include our website, our live
            map, our social media channels, our newsletter, and our blog, we’re
            constantly reaching an ever-growing audience of targeted industry
            professionals and companies.
          </p>
          <p class="content">
            Plus, we are a constant presence in the industry’s most important
            events and conferences. Even during challenging times, our digital
            platform is the perfect marketplace for buyers and providers to meet
            and make transactions.
          </p>
          <p class="content">
            With our Sponsorships Packages, you will not only support our effort
            to offer an easy-to-access encyclopedia and map of the world’s
            internet infrastructure, but you will also gain a spotlight for your
            brand wherever Infrapedia is present.
          </p>
          <p class="content">
            Select the plan that is best for you, or
            <router-link to="/contact" class="underline-hover">
              contact us
            </router-link>
            for a customized plan.
          </p>
        </div>
      </el-card>
      <el-divider class="transparent" />
      <el-divider class="transparent" />
      <div class="el-card is-always-shadow inner-wrapper table-wrapper mb20">
        <h2 class="title">Packages</h2>
        <el-table :data="sponsorsFeatures" stripe border class="mt20 mb20">
          <el-table-column label="Features" prop="feature" />
          <el-table-column label="Partner" prop="partner" width="200" />
          <el-table-column label="Premium Partner" prop="premium" width="200" />
          <el-table-column
            label="Exclusive Sponsor - Three Exclusive Spots Available"
            prop="exclusive"
          />
        </el-table>
      </div>
      <el-divider class="transparent" />
      <el-divider class="transparent" />
      <div class="el-card is-always-shadow inner-wrapper table-wrapper mb20">
        <h2 class="title">Pricing</h2>
        <el-table :data="pricing" stripe border class="mt20 mb20">
          <el-table-column label="Recurrence time" prop="recurrence" />
          <el-table-column label="Partner" prop="partner" width="200" />
          <el-table-column label="Premium Partner" prop="premium" width="200" />
          <el-table-column
            label="Exclusive Sponsor - Three Exclusive Spots Available"
          >
            <template slot-scope="scope">
              <router-link to="/contact">
                {{ scope.row.exclusive }}
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-divider class="transparent" />
      <el-divider class="transparent" />
      <div class="el-card is-always-shadow inner-wrapper table-wrapper mb20">
        <h2 class="title">Ads</h2>
        <el-table :data="ads" stripe border class="mt20 mb20">
          <el-table-column label="Ads" prop="ad" />
          <el-table-column label="Max Amount" prop="max" />
          <el-table-column label="Monthly" prop="monthly" />
          <el-table-column label="Yearly" prop="yearly" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SponsorsPage',
  data: () => ({
    sponsorsFeatures: [
      {
        feature: 'Support Development',
        partner: 'Yes',
        premium: 'Yes',
        exclusive: 'Yes'
      },
      {
        feature: 'Receive Buy Capacity Requests',
        partner: 'No',
        premium: 'Yes',
        exclusive: 'Yes'
      },
      {
        feature: 'Highlight facilities on map',
        partner: 'No',
        premium: 'Yes',
        exclusive: 'Yes'
      },
      {
        feature: 'Banner on map',
        partner: 'No',
        premium: 'No',
        exclusive: 'Yes - top banner with logo, brand name and short copy'
      },
      {
        feature: 'Logo on Infrapedia.com',
        partner: 'No',
        premium: 'No',
        exclusive: 'Yes'
      },
      {
        feature:
          'Logo and mention on Social Media (Facebook, Linkedin, Instagram, Twitter)',
        partner: 'Yes - one mention with logo and tag',
        premium: 'Yes - two mentions with logo and tag',
        exclusive: 'Yes - weekly mentions with logo, tag and link'
      },
      {
        feature: 'Logo on "Partners" page on Infrapedia.com',
        partner: 'Yes',
        premium: 'Yes',
        exclusive: 'Yes'
      },
      {
        feature: 'Logo on "Premium Partners" page on live.infrapedia.com',
        partner: 'No',
        premium: 'Yes',
        exclusive: 'Yes, first/top place'
      },
      {
        feature: 'Logo in Newsletters Sponsor Footer Area',
        partner: 'No',
        premium: 'Yes',
        exclusive: 'Yes - on every newsletter'
      },
      {
        feature: 'Logo in Menu Bar of Interactive Map',
        partner: 'No',
        premium: 'No',
        exclusive: 'Yes'
      },
      {
        feature: 'Sponsored Youtube Video',
        partner: 'No',
        premium: 'No',
        exclusive: 'Yes'
      },
      {
        feature: 'Sponsored Blog Post',
        partner: 'No',
        premium: 'No',
        exclusive: 'Yes'
      },
      {
        feature:
          'Logo in our Conference Roadshows, Presentations, and Webinars',
        partner: 'No',
        premium: 'Yes (webinars)',
        exclusive: 'Yes'
      },
      {
        feature: 'Share your data for free',
        partner: 'Yes',
        premium: 'Yes',
        exclusive: 'Yes - include your logo'
      }
    ],
    pricing: [
      {
        recurrence: 'Monthly',
        partner: 'N/A',
        premium: '$750',
        exclusive: 'Contact us for details'
      },
      {
        recurrence: 'Yearly',
        partner: '$2,500',
        premium: '$7,500',
        exclusive: 'Contact us for details'
      },
      {
        recurrence: 'Share your Data Discount (yearly plans only)',
        partner: '$2,500',
        premium: '$2,500',
        exclusive: 'Contact us for details'
      },
      {
        recurrence: 'You pay',
        partner: '$0',
        premium: '$5,500',
        exclusive: 'Contact us for details'
      }
    ],
    ads: [
      {
        ad: 'Top Side Banner Ad Infrapedia.com',
        max: 1,
        monthly: '$500',
        yearly: '$5,000'
      },
      {
        ad: 'Side Banner Ad Infrapedia Blog',
        max: 2,
        monthly: '$350',
        yearly: '$3,500'
      },
      {
        ad: 'Ad on live map',
        max: 2,
        monthly: '$600',
        yearly: '$6,000'
      }
    ]
  }),
  head: {
    title:
      'Infrapedia | Exclusive Sponsorships | Global Internet Infrastructure Map',
    meta: [
      {
        name: 'application-name',
        content:
          'Infrapedia | Exclusive Sponsorships | Global Internet Infrastructure Map'
      },
      {
        name: 'description',
        content:
          'Infrapedia is the world’s largest crowd-sourced Live Map of the Global Internet Infrastructure. Be one of our Exclusive Sponsors and be everywhere we are.'
      },
      {
        name: 'keywords',
        content:
          'custom maps, fiber optics maps, internet infrastructure map, live map, consulting, data center, sponsorship, ads, telecommunications'
      }
    ]
  },
  beforeCreate() {
    this.$emit('layout', 'landing-layout')
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/pages/sponsors-styles.scss';
</style>
