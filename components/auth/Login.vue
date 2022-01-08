<template>
  <div class="container login-wrapper">
    <img :src="blob" alt="" class="blob" />

    <div class="row">
      <div class="col offset-s2">
        <a href="" class="btn-flat waves-effect">
          <i class="left"></i>
          Back to Home
        </a>

        <div class="">
          <h2>Login</h2>
          <p class="grey-text text-darken-1">
            Don't have an account?
            <router-link to="/register" class="link">Register</router-link>
          </p>
        </div>

        <form>
          <div class="input-field row">
            <input v-model="email" type="text" placeholder="Email" />
            <label for="email"></label>
            <span class="red-text"></span>
          </div>

          <div class="input-field row">
            <input v-model="password" type="password" placeholder="Password" />
            <label for=""></label>
            <span class="red-text"></span>
          </div>

          <div class="" style="padding-left: 11.25px">
            <button
              class="btn waves-effect hoverable"
              @click.prevent="handleLogin"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  // components: { email, password },
  data() {
    return {
      email: null,
      password: null,
      loading: false,
      blob: require('../assets/img/blob-login.svg'),
    }
  },
  methods: {
    async handleLogin() {
      console.log('button clicked')

      try {
        const existingUser = {
          email: this.email,
          password: this.password,
        }

        await this.$store.dispatch('user/loginUser', existingUser)

        this.$router.push('/dashboard')
      } catch (e) {
        console.log(e.message)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 100px;

  .blob {
    position: absolute;
    z-index: 0;

    img {
      border-style: none;
    }
  }

  .row {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .col.offset-s2 {
      margin-left: 16.6666666667%;
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

  .input-field {
    label {
      color: #aaa;
      margin: 25px 0 15px;
      font-size: 0.6em;
      letter-spacing: 1px;
      font-weight: bold;
    }
    input {
      position: relative;
      padding: 10px 6px;
      margin-top: 1rem;
      margin-bottom: 1rem;
      padding: 0 0.75rem;
      float: left;
      line-height: 1.5;
      min-height: 2px;
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
