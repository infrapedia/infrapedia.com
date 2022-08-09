<template>
  <div class="main-wrapper p4 pt20 pb30">
    <div class="inner-wrapper">
      <h1 class="title text-center mb20" :class="{ dark }">
        Infrapedia’s most frequently asked questions
      </h1>

      <ul class="list">
        <li v-for="item in [...generalFAQ, ...dataFAQ, ...buyNowFAQ]" :key="item.marker">
          <a :href="`faq#${item.marker}`" target="_self">{{ item.title }}</a>
        </li>
      </ul>

      <div>
        <div
          v-for="(item, i) in generalFAQ"
          :id="item.marker"
          :key="i"
          :name="i"
        >
          <h2 class="text strong">{{ item.title }}</h2>

          <p v-if="item.html" class="text" v-html="item.content" />
          <p v-else class="text">
            {{ item.content }}
          </p>
        </div>

        <div aria-hidden="true" class="mb10" />

        <h1 class="title text-center mb10">About Data</h1>

        <div v-for="(item, i) in dataFAQ" :id="item.marker" :key="i" :name="i">
          <h2 class="text strong">{{ item.title }}</h2>

          <p v-if="item.html" class="text" v-html="item.content" />
          <p v-else class="text">
            {{ item.content }}
          </p>
        </div>

        <div aria-hidden="true" class="mb10" />

        <h1 class="title text-center mb10">About Buy Now!</h1>

        <div
          v-for="(item, i) in buyNowFAQ"
          :id="item.marker"
          :key="i"
          :name="i"
        >
          <h2 class="text strong">{{ item.title }}</h2>

          <p v-if="item.html" class="text" v-html="item.content" />
          <p v-else class="text">
            {{ item.content }}
          </p>
        </div>

        <div aria-hidden="true" class="mb10" />

        <p class="text">
          Have more questions?
          <a href="https://infrapedia.com/contact"> Write to us!</a> We will
          reach out.
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'faq',
  head: {
    title:
      'What is Infrapedia? find this is and all you need to know | Infrapedia',
    link: [
      {
        rel: 'canonical',
        href: `https://www.infrapedia.com/faq`,
      },
    ],
    meta: [
      {
        name: 'description',
        content:
          ': If you want to know more about Infrapedia this is the place. Learn about what it is, how to use the map, where the data comes from and all you need to know. Click here!',
      },
      {
        name: 'keywords',
        content:
          'internet map, global internet infrastructure, submarine cable map. telecommunications, network pops, world internet structure',
      },
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
                text: "Infrapedia is a crowd-sourced near real-time map of the global Internet infrastructure detailing the world's submarine and terrestrial networks as well as other critical infrastructure assets in real time while giving the ability to network professionals to connect with each other to help improve companies acquire and sell capacity faster , cheaper and easier.",
              },
            },
            {
              '@type': 'Question',
              name: 'Is Infrapedia a not-for-profit company?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Infrapedia is a for profit company incorporated in Delaware. Commercial users may pay a fee or share their operational status data to make Infrapedia a useful place.',
              },
            },
            {
              '@type': 'Question',
              name: 'Can I download KMZs from your platform?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'No, all KMZ information is stored and not available for download from our systems. We would be happy to connect you with the parties who submitted their KMZs.',
              },
            },
            {
              '@type': 'Question',
              name: 'Can I submit you my KMZ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, there are several ways but the simplest way is to go to https://www.infrapedia.com sign up, and simply upload your KMZ. If you run into any issues, simply drop us an email at admin@infrapedia.com',
              },
            },
            {
              '@type': 'Question',
              name: 'Where did you find all this data?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'We are a platform where you can share your network route and availability information. We did not find all this data ourselves. We have simply created a self service platform for anyone who is authorized to share the data and created a validation process to ensure data was ok to share.',
              },
            },
            {
              '@type': 'Question',
              name: 'Do you accept commissions, kick-backs, etc from vendors?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'No, at infrapedia we make it very clear that we are equal distanced from every vendor. We strictly do not take any commission that way you are ensured you are getting best possible cost',
              },
            },
            {
              '@type': 'Question',
              name: 'Do you see the contents of the email when I click buy capacity?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'We do not as long as a vendor has claimed ownership of the asset (fiber or datacenter). If no owner exists, we receive a copy of the email so we can route appropriately.',
              },
            },
            {
              '@type': 'Question',
              name: 'How do you keep your map up to date?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'We are a group of infrastructure enthusiasts who is extremely focused on network availability. We monitor many lists and in addition to that we have various scripts running checking key infrastructure assets around the world. We also monitor email lists such as outages org and social media like twitter, facebook, linkedin. We often get notified by our visitors and receive the outage as a report.',
              },
            },
            {
              '@type': 'Question',
              name: 'Is the data on your website accurate?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'There is no way we can validate all the data in our website. We do perform common checks on our data and make sure only those with appropriate rights can post.',
              },
            },
            {
              '@type': 'Question',
              name: 'Do you take sponsors?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'We do have sponsorship opportunities available. Contact us to learn details  at admin@infrapedia.com',
              },
            },
          ],
        },
      },
    ],
  },
  data: () => ({
    collapse: '',
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    generalFAQ() {
      return [
        {
          title: 'What is Infrapedia?',
          html: true,
          marker: 'whatIsInfrapedia',
          content:
            "Infrapedia is a crowd-sourced near real-time <a href='https://infrapedia.com/app'> map of the global Internet infrastructure </a> detailing the world's submarine cable system infrastructure, fiber optic terrestrial networks and other critical infrastructure assets giving the ability to network professionals to connect with each other to help improve, acquire and sell capacity faster, cheaper and easier.",
        },
        {
          title: 'Do I need anything special to use Infrapedia?',
          marker: 'DoINeedAnything',
          content:
            'All you need to use Infrapedia is an internet connection and desktop computer or a mobile device',
        },
        {
          title: 'Do I need to sign-up in order to use Infrapedia?',
          marker: 'doINeedToSignUp',
          html: true,
          content:
            'No, basic functions are available to every user. A user account is only required to unlock certain features or upload/update data. <a href="https://infrapedia.com/login">Sign up here </a> to unlock the special features.',
        },
        {
          title: 'Is Infrapedia a not-for-profit company?',
          marker: 'isInfrapediaANonForProfit',
          content:
            'No, Infrapedia is a project supported by various industry professionals and organizations. The platform is free to use as-is and commercial users may share their operational status and infrastructure data to make Infrapedia a useful tool and increase their visibility to a growing community.',
        },
        {
          title: 'Can we use a screenshot or embed your application/website?',
          marker: 'canWeUseAScreenshot',
          html: true,
          content:
            'You can use an image/screenshot or embed the website (https://www.infrapedia.com/) into any (interactive) content, as long as our name (Infrapedia) and website/url (https://www.infrapedia.com/) is clearly visible as a reference/source. Do you want to do anything else, please <a href="https://infrapedia.com/contact">contact us</a> first to discuss it in more detail.',
        },
        {
          title: 'How can I help?',
          marker: 'howCanIHelp',
          html: true,
          content:
            'Promoting the website to vendors as well as help increase the visibility of the website or  contribute content/data are just a few ways to help us. You can also share your thoughts and ideas by contacting us directly or share on social media, <a href="https://twitter.com/infrapedia" target="_blank" rel="noreferrer noopener"> Twitter</a>, <a href="https://www.facebook.com/infrapediainc/" target="_blank" rel="noreferrer noopener"> Facebook </a>, <a href="https://www.linkedin.com/in/hubertsouisa/" target="_blank" rel="noreferrer noopener"> Linkedin</a>!',
        },
        {
          title: 'Do you take sponsorships?',
          marker: 'doYouTakeSponsorships',
          html: true,
          content:
            'We are always open for discussion. <a href="https://www.infrapedia.com/contact" rel="noreferrer noopener"> Contact us</a> to arrange a meeting.',
        },
      ]
    },
    dataFAQ() {
      return [
        {
          title: 'How do you keep your map up to date?',
          html: true,
          marker: 'howDoYouKeepYourMap',
          content:
            'We are a group of infrastructure enthusiasts who are extremely focused on network availability. We monitor many lists and in addition to that we have various scripts running checking key infrastructure assets around the world. We often get notified by our users and receive the outage as a report. We also monitor for information and press releases often shared across social media platforms like <a href="https://twitter.com/infrapedia" target="_blank" rel="noreferrer noopener"> Twitter</a>, <a href="https://www.facebook.com/infrapediainc/" target="_blank" rel="noreferrer noopener"> Facebook </a>, <a href="https://www.linkedin.com/in/hubertsouisa/" target="_blank" rel="noreferrer noopener"> Linkedin</a>',
        },
        {
          title: 'Where did you find all this data?',
          marker: 'whereDidYouFind',
          content:
            'We did not find all this data ourselves. We are a platform where vendors and users can share data and availability information. We have simply created a self service platform for anyone who is authorized to share the data and created a validation process to ensure data is allowed to be shared.',
        },
        {
          title: 'Is the data on your website accurate? ',
          marker: 'isTheDataOnYourWebsiteAccurate',
          html: true,
          content:
            'There is no way we can validate all the data on the map. We do perform common checks on our data and look for confirmation from vendors or other sources. If you see any error, please <a href="https://infrapedia.com/contact">reach out to us</a> or use the “Report” button in the sidebar to notify us on a specific object.',
        },
        {
          title: 'What is considered a submarine cable system?',
          marker: 'whatIsConsideredASubmarineCableSystem',
          content:
            'Infrapedia defines a submarine cable system as a fiber optic cable laid on the ocean floor between two or more land-based stations and is owned and/or operated by one or more organizations. Submarine cable systems are also often referred to as subsea cables, undersea cables, Internet cables, underwater cables or submarine communications cables. ',
        },
        {
          title: 'What is considered a terrestrial network? ',
          marker: 'whatIsConsideredATerrestrialNetwork',
          content:
            'Infrapedia defines a terrestrial network as a land-based network of fixed cables (most often fiber optic cable) used to provide connectivity between (land-locked) countries or urban centers within a country. Please note that this definition does not include micro wave networks or mobile communications infrastructures, see “What is considered a facility?',
        },
        {
          title: 'What is considered a facility?',
          marker: 'whatIsConsideredAFacility',
          content:
            'Infrapedia defines a facility as any and all physical structures used to provide space, power, cooling and physical security for servers, storage, network and other digital communications related infrastructure. For example data centers, carrier hotels, Central Offices (CO), mobile communications towers and earth stations.',
        },
        {
          title: 'What is considered an Internet Exchange Point (IXP)?',
          marker: 'whatIsConsideredAnIXP',
          html: true,
          content:
            'Infrapedia defines an Internet Exchange Point, often referred to as IXP, as a physical location or shared infrastructure that allows participant Internet Service Providers, carriers, content providers and other Internet related network owners to exchange data destined for their respective networks. Note that most facilities fall under this definition, but Infrapedia does prefer physical exchange locations to be identified as a facility as well. To simplify, Infrapedia uses peeringdb.com as the main source of truth. Consider adding your IXP in <a href="https://www.peeringdb.com/" rel="noreferrer noopener">peeringdb.com</a> before continuing using <a href="https://www.infrapedia.com/app">www.infrapedia.com.</a>',
        },
        {
          title:
            'Why can’t I see network ABC/subsea cable XYZ/Data Center Y or IXP 123?',
          marker: 'whyCantISeeNetworkABC',
          content:
            'Infrapedia is a crowd-sourced platform and depends on users or vendors to share data. This means that there is a possibility that we do not yet have certain information. We try to contact as many vendors as possible and promote the platform. Help us by doing the same!',
        },
        {
          title: "Can I submit/share my company's submarine cable data?",
          html: true,
          marker: 'canISubmitMyCompanySubmarineCableData',
          content:
            'Providing your organization’s leadership approves, yes please! There are several ways but the simplest way is to go to <a href="https://www.infrapedia.com">www.infrapedia.com</a>, sign up and upload your KMZ data via the <a href="https://www.infrapedia.com/user/section/terrestrial-networks"> User dashboard</a>. If you run into any issues, <a href="https://infrapedia.com/contact"> contact us</a> and we will arrange for an email exchange of the KMZ data and add it for you.',
        },
        {
          title: "Can I submit/share my company's terrestrial network data?",
          marker: 'canISubmitMyCompanyTerrestrialNetworkData',
          html: true,
          content:
            'Providing your organization’s leadership approves, yes please! There are several ways but the simplest way is to go to <a href="https://www.infrapedia.com">www.infrapedia.com</a>, sign up and upload your KMZ data via the <a href="https://www.infrapedia.com/user/section/terrestrial-networks"> User dashboard</a>. If you run into any issues, <a href="https://infrapedia.com/contact"> contact us</a> and we will arrange for an email exchange of the KMZ data and add it for you.',
        },
        {
          title: 'Can I submit/share my data center or IXP data?',
          marker: 'canISubmitMyDataCenterOrIXPData',
          html: true,
          content:
            'Yes you can. Consider adding/updating your information in <a href="https://www.peeringdb.com/" rel="noreferrer noopener">PeeringDB</a> first. This allows us to synchronize the information directly. Otherwise, go to <a href="https://www.infrapedia.com">www.infrapedia.com</a>, sign up and add the information via the User dashboard. If you run into any issues, <a href="https://infrapedia.com/contact"> contact us</a> and we will help you.',
        },
        {
          title: 'I uploaded my network data but it is not on the map? ',
          marker: 'IUploadedMyNetwork',
          content:
            'Sorry. It takes time. The technology behind the Infrapedia platform requires the data to be processed. Basic information of your data (i.e. organization name, network details, CLSs, POPs) is available immediately, but geographical (KMZ) data for subsea cable systems , terrestrial networks and 3D facilities building needs to be processed first.',
        },
        {
          title: 'How often do you refresh your map?',
          marker: 'howOftenDoYouRefreshYourMap',
          html: true,
          content:
            'Depending on the number of changes made we refresh the <a href="https://infrapedia.com/app">map</a> as frequently as possible',
        },
        {
          title:
            'Can I get the KMZ data of terrestrial network XYZ/subsea cable ABC?',
          html: true,
          marker: 'canIGetTheKMZData',
          content:
            'No, KMZ information is not available for download from our platform. We would be happy to connect with you and see if we can be of help in some other way as part of our <a href="https://www.infrapedia.com/services">professional services </a>',
        },
      ]
    },
    buyNowFAQ() {
      return [
        {
          title: 'What is “Buy Now!” and how much does it cost? ',
          marker: 'whatIsBuyNow',
          content:
            'Buy Now! is Infrapedia’s lead funnel for vendors. Infrapedia users can submit their sales requests, RFIs and RFQs for free. No commissions.',
        },
        {
          title: 'I need something. How can I submit a request?',
          marker: 'iNeedSomethingHowCanI',
          html: true,
          content:
            'Make sure you have an account, see <a href="faq#doINeedToSignUp">“Do I need to sign-up in order to use Infrapedia?” </a> . After this, whenever you click on a subsea cable, terrestrial network, data center or IXP the sidebar contains the  button. Simply click, choose the type of infrastructure/service, fill-in the required details and click on “Send”. Infrapedia will take it from here!',
        },
        {
          title: 'Do vendors need to pay to receive “Buy Now!” leads?',
          marker: 'doVendorsNeedToPayToReceiveLeads',
          html: true,
          content:
            'No, at Infrapedia we make it clear that we treat every vendor equally. We strictly do not take any commission. The only things we are asking for in return is to: <ul style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem; list-style: disc; padding-left: 1rem"> <li>Promote the platform to your peers,</li> <li> Consider contributing your network, subsea cable, IXP or data center information to the community.</li> </ul>',
        },
        {
          title: 'I am a vendor. How can I receive Buy Now! leads?',
          marker: 'iAmVendorHowCanIReceiveLeads',
          html: true,
          content:
            '<a href="https://www.infrapedia.com/contact"> Connect with us</a> and we will keep you posted on any relevant leads. However, in order to better identify relevant leads it is helpful to validate and update information about your organization and infrastructures. Request access to the information via the dashboard or <a href="https://www.infrapedia.com/contact"> contact us</a> to exchange the information so we can update it for you.',
        },
        {
          title: 'Do you see the contents of the lead when I click Buy Now!?',
          marker: 'doYouSeeTheContentsOfTheLeadWhen',
          content:
            'We do not as long as it is possible for us to directly forward a lead to a single, verified vendor. In other cases we may need information from the user in order to help identify and connect to the right vendor(s).',
        },
      ]
    },
  },
}
</script>

<style scoped lang="scss">
@import '../assets/scss/pages/attributions-styles.scss';
@import '../assets/scss/helpers/_atomic-classes.scss';
@import '../assets/scss/base/_variables.scss';

.inner-wrapper {
  width: 80vw;
  margin: 0 auto;
  p {
    @extend .text-justify;
  }

  @media screen and (max-width: $break-lg) {
    width: 40vw;
  }
}

.list {
  padding-left: 1rem;
  list-style: disc;
  margin: 2rem 0;
  display: flex;
  flex-flow: column nowrap;
  gap: .8rem;
}
</style>
