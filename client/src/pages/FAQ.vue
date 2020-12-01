<template>
  <div class="main-wrapper p4 pt20 pb30">
    <div class="inner-wrapper">
      <h1 class="title text-center mb20" :class="{ dark }">
        Frequently Ask Questions
      </h1>
      <el-collapse v-model="collapse" accordion :class="{ dark }">
        <el-collapse-item v-for="(item, i) in faqList" :key="i" :name="i">
          <div slot="title" class="pb4">
            <p class="text strong">{{ item.title }}</p>
          </div>
          <div v-if="item.html">
            <p class="text" v-html="item.content" />
          </div>
          <div v-else>
            <p class="text">
              {{ item.content }}
            </p>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script>
export default {
  name: 'faq',
  head: {
    title: 'Infrapedia | FAQ | Global Internet Infrastructure Map',
    link: [
      {
        rel: 'canonical',
        href: `https://www.infrapedia.com/faq`
      }
    ],
    meta: [
      {
        name: 'description',
        content: 'Infrapedia Frequently Ask Questions.'
      },
      {
        name: 'keywords',
        content:
          'internet map, global internet infrastructure, submarine cable map. telecommunications, network pops, world internet structure'
      }
    ],
    script: [
      {
        type: 'application/ld+json',
        json: {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What is Infrapedia?',
              acceptedAnswer: {
                '@type': 'Answer',
                text:
                  "Infrapedia is a crowd-sourced near real-time map of the global Internet infrastructure detailing the world's submarine and terrestrial networks as well as other critical infrastructure assets in real time while giving the ability to network professionals to connect with each other to help improve companies acquire and sell capacity faster , cheaper and easier."
              }
            },
            {
              '@type': 'Question',
              name: 'Is Infrapedia a not-for-profit company?',
              acceptedAnswer: {
                '@type': 'Answer',
                text:
                  'Infrapedia is a for profit company incorporated in Delaware. Commercial users may pay a fee or share their operational status data to make Infrapedia a useful place.'
              }
            },
            {
              '@type': 'Question',
              name: 'Can I download KMZs from your platform?',
              acceptedAnswer: {
                '@type': 'Answer',
                text:
                  'No, all KMZ information is stored and not available for download from our systems. We would be happy to connect you with the parties who submitted their KMZs.'
              }
            },
            {
              '@type': 'Question',
              name: 'Can I submit you my KMZ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text:
                  'Yes, there are several ways but the simplest way is to go to https://www.infrapedia.com sign up, and simply upload your KMZ. If you run into any issues, simply drop us an email at admin@infrapedia.com'
              }
            },
            {
              '@type': 'Question',
              name: 'Where did you find all this data?',
              acceptedAnswer: {
                '@type': 'Answer',
                text:
                  'We are a platform where you can share your network route and availability information. We did not find all this data ourselves. We have simply created a self service platform for anyone who is authorized to share the data and created a validation process to ensure data was ok to share.'
              }
            },
            {
              '@type': 'Question',
              name: 'Do you accept commissions, kick-backs, etc from vendors?',
              acceptedAnswer: {
                '@type': 'Answer',
                text:
                  'No, at infrapedia we make it very clear that we are equal distanced from every vendor. We strictly do not take any commission that way you are ensured you are getting best possible cost'
              }
            },
            {
              '@type': 'Question',
              name:
                'Do you see the contents of the email when I click buy capacity?',
              acceptedAnswer: {
                '@type': 'Answer',
                text:
                  'We do not as long as a vendor has claimed ownership of the asset (fiber or datacenter). If no owner exists, we receive a copy of the email so we can route appropriately.'
              }
            },
            {
              '@type': 'Question',
              name: 'How do you keep your map up to date?',
              acceptedAnswer: {
                '@type': 'Answer',
                text:
                  'We are a group of infrastructure enthusiasts who is extremely focused on network availability. We monitor many lists and in addition to that we have various scripts running checking key infrastructure assets around the world. We also monitor email lists such as outages org and social media like twitter, facebook, linkedin. We often get notified by our visitors and receive the outage as a report.'
              }
            },
            {
              '@type': 'Question',
              name: 'Is the data on your website accurate?',
              acceptedAnswer: {
                '@type': 'Answer',
                text:
                  'There is no way we can validate all the data in our website. We do perform common checks on our data and make sure only those with appropriate rights can post.'
              }
            },
            {
              '@type': 'Question',
              name: 'Do you take sponsors?',
              acceptedAnswer: {
                '@type': 'Answer',
                text:
                  'We do have sponsorship opportunities available. Contact us to learn details  at admin@infrapedia.com'
              }
            }
          ]
        }
      }
    ]
  },
  data: () => ({
    collapse: ''
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    faqList() {
      return [
        {
          title: 'What is Infrapedia?',
          content:
            "Infrapedia is a crowd-sourced near real-time map of the global Internet infrastructure detailing the world's submarine and terrestrial networks as well as other critical infrastructure assets in real time while giving the ability to network professionals to connect with each other to help improve companies acquire and sell capacity faster , cheaper and easier."
        },
        {
          title: 'Is Infrapedia a not-for-profit company?',
          html: true,
          content:
            'Infrapedia is a for profit company incorporated in Delaware. <br /> Commercial users may pay a fee or share their operational status data to make Infrapedia a useful place.'
        },
        {
          title: 'Can I download KMZs from your platform?',
          content:
            'No, all KMZ information is stored and not available for download from our systems. We would be happy to connect you with the parties who submitted their KMZs.'
        },
        {
          title: 'Can I submit you my KMZ?',
          html: true,
          content:
            'Yes, there are several ways but the simplest way is to go to <a href="https://www.infrapedia.com" target="_blank">https://www.infrapedia.com</a> sign up, and simply upload your KMZ. If you run into any issues, simply drop us an email at <a href="mailto:admin@infrapedia.com" target="_blank">admin@infrapedia.com</a>'
        },
        {
          title: 'Where did you find all this data?',
          content:
            'We are a platform where you can share your network route and availability information. We did not find all this data ourselves. We have simply created a self service platform for anyone who is authorized to share the data and created a validation process to ensure data was ok to share.'
        },
        {
          title: 'Do you accept commissions, kick-backs, etc from vendors?',
          content:
            'No, at infrapedia we make it very clear that we are equal distanced from every vendor. We strictly do not take any commission that way you are ensured you are getting best possible cost'
        },
        {
          title:
            'Do you see the contents of the email when I click buy capacity?',
          content:
            'We do not as long as a vendor has claimed ownership of the asset (fiber or datacenter). If no owner exists, we receive a copy of the email so we can route appropriately.'
        },
        {
          title: 'How do you keep your map up to date?',
          content:
            'We are a group of infrastructure enthusiasts who is extremely focused on network availability. We monitor many lists and in addition to that we have various scripts running checking key infrastructure assets around the world. We also monitor email lists such as outages org and social media like twitter, facebook, linkedin. We often get notified by our visitors and receive the outage as a report.'
        },
        {
          title: 'Is the data on your website accurate?',
          content:
            'There is no way we can validate all the data in our website. We do perform common checks on our data and make sure only those with appropriate rights can post.'
        },
        {
          title: 'Do you take sponsors?',
          html: true,
          content:
            'We do have sponsorship opportunities available. Contact us to learn details <a href="mailto:admin@infrapedia.com" target="_blank">admin@infrapedia.com</a>'
        }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
@import '../assets/scss/pages/attributions-styles.scss';
@import '../assets/scss/helpers/_atomic-classes.scss';
@import '../assets/scss/base/_variables.scss';
.inner-wrapper {
  width: 40vw;
  margin: 0 auto;
  p {
    @extend .text-justify;
  }
  @media screen and (max-width: $break-md) {
    width: 80vw;
  }
}
</style>
