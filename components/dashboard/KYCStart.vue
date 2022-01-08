<template>
  <div>
    <div v-if="!shuftiStatus">
      <router-link to="/shufti">Begin KYC/AML Verification</router-link>
    </div>

    <div v-else-if="shuftiStatus === 'sent'">
      <p>KYC Verification sent, awaiting update on identity</p>
    </div>

    <div v-else-if="shuftiStatus === 'passed'">
      <p>KYC Verification passed</p>
    </div>

    <div v-else-if="shuftiStatus === 'rejected'">
      <p>KYC AML rejected.</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      shuftiStatus: 'shufti/verificationStatus',
    }),
  },
}
</script>
