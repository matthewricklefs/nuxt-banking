<template>
  <div>
    {{ verificationMessage }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      verificationMessage: 'verifying',
    }
  },
  // TODO:
  // How am I going to access route instances with Nuxt?
  async mounted() {
    const { email, verificationToken } = this.$route.query
    const res = await this.$store.dispatch('user/verifyEmail', {
      verificationToken,
      email,
    })
    console.log('VerifyEmail', res)
    this.verificationMessage = res
    setTimeout(() => {
      if (!res.includes('404')) this.$router.push({ path: '/dashboard' })
    }, 3000)
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
// TODO:
// I need to implement appropriate scss preloaders, postcss, tailwindCSS config, etc.
</style>
