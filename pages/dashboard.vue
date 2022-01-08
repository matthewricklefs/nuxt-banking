<template>
  <div class="container">
    <div class="row dashboard-wrapper">
      <img :src="blob" alt="" class="blob" />

      <div class="col s12 center-align">
        <div class="dashboard-wrapper">
          <h4>
            <b>Welcome</b>
            "{{ userName }}"
          </h4>

          <!-- User has not verified their email -->
          <EmailUnverified v-if="onboarding === 'new' && !emailVerified" />

          <!-- User has verified thier email but not gone through KYC -->
          <KYCStart v-if="onboarding === 'new' && emailVerified" />

          <!-- User kyc has been approved, but not linked thier account -->
          <div v-if="onboarding === 'kyc-started'">
            <p>KYC AML verification started, awaiting result.</p>
          </div>

          <!-- User has linked thier bank account via plaid-->
          <div v-if="onboarding === 'kyc-approved'">
            <p class="flow-text grey-text text-darken-1">
              To get started, link your first bank account below.
            </p>
            <PlaidLink
              v-if="linkTokenLoaded"
              :env="plaidEnv"
              client-name="Blockness Onboarding"
              product="transactions"
              :token="linkToken"
              :on-success="getAccounts"
              >Link Account</PlaidLink
            >
          </div>

          <!-- User has linked account but not paid onboarding fee -->
          <div v-if="onboarding === 'account-linked'">
            <Invest />
          </div>

          <!-- User has been onboarded -->
        </div>
      </div>
    </div>

    <br />
  </div>
</template>

<script>
// TODO:
// successfully install the plaidlink dependency and/or nuxt module.
// Do I have to create a custom module, do I have to create a custom Plugin?
// import PlaidLink from 'vue-plaid-link'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      linkToken: null,
      linkTokenLoaded: false,
      blob: require('../assets/img/blob-login.svg'),
    }
  },
  computed: {
    ...mapGetters({
      userName: 'user/name',
      userEmail: 'user/email',
      emailVerified: 'user/verified',
      onboarding: 'user/onboarding',
    }),
    plaidEnv: {
      get() {
        return process.env.VUE_APP_PLAID_ENV
      },
    },
  },

  async mounted() {
    // if the user is kyc-approved and needs to authenitcate into thier account, let them.
    if (this.onboarding === 'kyc-approved') {
      this.linkToken = await this.getLinkToken()
      this.linkTokenLoaded = true
    }
  },
  methods: {
    async getLinkToken() {
      return await this.$store.dispatch('plaid/getLinkToken')
    },
    async getAccounts(token, accounts) {
      console.log('getAccounts', token, accounts)
      const accountId = accounts.account_id
      const institution = accounts.institution.name

      await this.$store.dispatch('plaid/linkAccount', {
        accountId,
        institution,
        publicToken: token,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 3%;
  border-radius: 30px;
  position: relative;
  z-index: 100;

  .blob {
    position: absolute;
    z-index: 0;

    img {
      border-style: none;
    }
  }

  .row {
    margin-top: 100px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }

  .col {
    margin-top: 100px;
    padding: 50px;
    width: 100%;
    text-align: center;

    button {
      align-self: flex-start;
    }

    h4 {
      b {
        font-weight: bolder;
      }
      font-size: 2.28rem;
      line-height: 110%;
    }
  }

  .waves-effect {
    cursor: pointer;
    position: relative;
    z-index: 1;
    transition: 0.3s ease-out;
  }

  .grey-text.text-darken-1 {
    color: #757575 !important;
  }

  p {
    margin-block-end: 1em;
    margin-inline-start: 0px;
  }
}
</style>
