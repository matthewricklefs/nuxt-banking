<template>
  <div class="reset-password">
    <Modal
      v-if="modalActive"
      :modal-message="modalMessage"
      @close-modal="closeModal"
    />

    <Loading v-if="loading" />

    <div class="form-wrap">
      <form class="reset">
        <p class="login-register">
          Back to
          <router-link class="router-link" :to="{ name: 'Login' }"
            >Login</router-link
          >
        </p>
        <h2>Reset Password</h2>
        <p>Forgot your password? Enter your email to reset it</p>
        <div class="inputs">
          <div class="input">
            <input
              v-model="email"
              type="text"
              placeholder="Email"
              @change="validateEmail()"
            />
            <email class="icon" />
          </div>
        </div>
        <button @click.prevent="resetPassword">Reset</button>
        <div class="angle"></div>
      </form>
      <div class="background"></div>
    </div>
  </div>
</template>

<script>
// import email from '../assets/icons/envelope-regular.svg'
import Modal from '../components/Modal'
import Loading from '../components/Loading'

export default {
  name: 'ForgotPassword',
  components: { email, Modal, Loading },
  data() {
    return {
      email: null,
      modalActive: false,
      modalMessage: '',
      loading: null,
    }
  },
  methods: {
    async resetPassword() {
      this.loading = true

      try {
        await this.$store.dispatch('resetPassword', {
          email: this.email,
        })

        this.modalMessage = 'If your account exists, you will receive an email'
        this.modalActive = true
        this.loading = false
      } catch (error) {
        this.modalMessage = error.message
        this.loading = false
        this.modalActive = true
      }
      this.loading = false
    },
    closeModal() {
      this.modalActive = !this.modalActive
      this.email = ''
    },
    validateEmail() {
      const email = this.email
      const re =
        // eslint-disable-next-line
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
  },
}
</script>

<style lang="scss" scoped>
.reset-password {
  position: relative;
  .form-wrap {
    .reset {
      h2 {
        margin-bottom: 8px;
      }
      p {
        text-align: center;
        margin-bottom: 32px;
      }
    }
  }
}
</style>
