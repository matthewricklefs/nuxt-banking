<template>
  <div class="container register-wrapper">
    <img :src="blob" alt="" class="blob" />
    <div class="row">
      <div class="col s8 offset-s2">
        <router-link to="/landing" class="btn-flat waves-effect">
          <i class="left"></i> Back to home
        </router-link>

        <div class="col s12">
          <h2>Register</h2>
          <p class="grey-text text-darken-1">
            Already have an account?
            <router-link to="/login" class="link"> Log in </router-link>
          </p>
        </div>

        <form>
          <div class="input-field row s12">
            <input v-model="user.name" type="text" placeholder="Name" />
            <label for="name" class=""></label>
            <span class="red-text"></span>
          </div>

          <div class="input-field row s12">
            <input v-model="user.email" type="email" placeholder="Email" />
            <label for="email" class=""></label>
            <span class="red-text"></span>
          </div>

          <div class="input-field row s12">
            <input
              v-model="user.password"
              type="password"
              placeholder="Password"
            />
            <label for="password" class=""></label>
            <span class="red-text"></span>
          </div>

          <div class="input-field row s12">
            <input
              id="password2"
              v-model="user.confirmPassword"
              type="password"
              placeholder="Confirm Password"
            />
            <label for="password2" class=""></label>
            <span class="red-text"></span>
          </div>

          <div class="row s12">
            <button
              class="btn waves-effect waves-light hoverable accent-3"
              @click.prevent="register"
            >
              Let's Go
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      user: {
        name: null,
        email: null,
        password: null,
      },

      blob: require('../assets/img/blob-register.svg'),
    }
  },
  methods: {
    async register() {
      console.log('button clicked')

      const request = await this.$store.dispatch('user/registerUser', {
        name: this.user.name,
        email: this.user.email,
        password: this.user.password,
      })

      console.log('register() dispatch: ', request)
      this.$router.push('/dashboard')
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 100px;
  display: flex;
  flex-direction: column;

  button {
    max-width: 90px;
    align-items: center;
  }

  .blob {
    position: absolute;
    z-index: 0;
    height: 750px;

    img {
      border-style: none;
    }
  }

  .row {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .col.offset-s2 {
      margin-left: 22.6666666667%;
      width: 100%;
    }
  }

  .btn-flat {
    i {
      font-size: 1.3rem;
      line-height: inherit;
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

  form {
    height: auto !important;
    height: 75% !important;
    width: 66%;
  }

  .input-field {
    position: relative;

    label {
      color: #aaa;
      margin: 25px 0 15px;
      font-size: 0.6em;
      letter-spacing: 1px;
      font-weight: bold;
    }
    input {
      padding: 10px 6px;
      margin-top: 1rem;
      margin-bottom: 1rem;
      padding: 0 0.75rem;
      /* float: left; */
      /* line-height: 1.5; */
      /* min-height: 2px; */
      box-sizing: border-box;
      background-color: transparent;
      border: none;
      border-bottom: 2px solid #ddd;
      &:focus {
        outline: transparent;
      }
    }
  }
}
</style>
