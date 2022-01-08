import App from '../../main'
import axios from '../../axios'

const state = () => ({
  name: null,
  roles: [],
  email: null,
  created: null,
  verified: null,
  onboarding: null,
  bankAccount: null,
  authInterceptorId: null,
})

const getters = {
  name: (state) => (state.name ? state.name : null),
  roles: (state) => (state.roles.length > 0 ? state.roles : null),
  email: (state) => (state.email ? state.email : null),
  created: (state) => (state.created ? state.created : null),
  verified: (state) => (state.verified ? state.verified : null),
  onboarding: (state) => (state.onboarding ? state.onboarding : null),
  bankAccount: (state) => (state.bankAccount ? state.bankAccount : null),
  // isAuthenticated: (localStorage) => localStorage.getItem('token') ? localStorage.getItem('token') : false,
}

const mutations = {
  AUTH_SUCCESS(state, { token, name, email }) {
    const checkToken = !!localStorage.getItem('token')

    if (!checkToken) localStorage.setItem('token', token)
    state.name = name
    state.email = email

    const userAuthInterceptor = axios.interceptors.request.use((config) => {
      config.headers.Authorization = token
      return config
    })
    state.authInterceptorId = userAuthInterceptor
  },
  AUTH_ERROR(state) {
    state.status = 'error'
  },
  USER_LOAD(
    state,
    { name, email, created, verified, roles, bankAccount, onboarding }
  ) {
    state.name = name
    state.email = email
    state.created = created
    state.verified = verified
    state.roles = roles
    state.bankAccount = bankAccount
    state.onboarding = onboarding
  },
  LOG_OUT(state) {
    state.name = null
    state.email = null
    state.created = null
    state.verified = null
    state.roles = null
    state.bankAccount = null
    state.onboarding = null
    localStorage.removeItem('token')

    axios.interceptors.request.eject(state.authInterceptorId)
    state.authInterceptorId = null
  },
}

const actions = {
  async registerUser({ commit }, payload) {
    const response = await axios.post('/register', payload)
    let err

    if (response.status === 201) {
      // console.log("[user.registerUser] response", `${response.data}`);
      const { token, user } = response.data
      const userEmail = user.email
      const userName = user.name

      commit('AUTH_SUCCESS', {
        name: userName,
        email: userEmail,
        token,
      })

      return response.data
    } else if (response.status === 409) {
      commit('AUTH_ERROR', err)
      localStorage.removeItem('token')
      console.log('[user.registerUser]: 409 Conflict', err)

      return err
    } else {
      commit('AUTH_ERROR', err)
      localStorage.removeItem('token')
      console.log('this is registration error: ', err)

      return err
    }
  },

  async loginUser({ commit, dispatch }, payload) {
    const response = await axios.post('/login', payload)
    let err

    if (response.status === 200) {
      // console.log('[user.registerUser] response', response.data);
      const { token, user } = response.data
      const userEmail = user.email
      const userName = user.name
      commit('AUTH_SUCCESS', {
        name: userName,
        email: userEmail,
        token,
      })

      const userData = await axios.get('/loaduser')
      console.log('[user.loginUser] userData request', userData)

      if (userData.status === 200) {
        const {
          name,
          email,
          created,
          verified,
          roles,
          bankAccount,
          onboarding,
        } = userData.data

        commit('USER_LOAD', {
          name,
          email,
          created,
          verified,
          roles,
          bankAccount,
          onboarding,
        })
        // load shufti verification status after user info is loaded
        await dispatch('shufti/loadVerification', {}, { root: true })
      } else {
        console.error('[user.loginUser] userData error')
      }

      return response.data
    } else {
      commit('AUTH_ERROR', err)
      localStorage.removeItem('token')
      console.log('this is login error: ', err)

      return err
    }
  },

  async logoutUser({ commit }) {
    commit('LOG_OUT')
    await App.$router.push({ path: '/' })
  },

  async resetPassword({ commit }, payload) {
    const response = await axios.post('/forgot', payload)

    if (response.status === 201) {
      commit('resetState', response.data)
      // console.log(response.data);
      return response.data
    }
  },
  /** DEPRICATED */
  async loadUser({ commit }) {
    console.log('[user.loadUser] axios', typeof axios)
    console.log('[user.loadUser] axios keys', Object.keys(axios))
    console.log(
      '[user.loadUser] axios request interceptors',
      axios.interceptors.request
    )
    console.log('[user.loadUser] axios request headers', axios.request.headers)
    const res = await axios.get('/loaduser')
    console.log('[user.loadUser] response', res)

    if (res.status === 200) {
      const { name, email, created, verified, roles, bankAccount, onboarding } =
        res.data
      commit('USER_LOAD', {
        name,
        email,
        created,
        verified,
        roles,
        bankAccount,
        onboarding,
      })
      return true
    } else {
      console.error('[user.loadUser] error')
      return false
    }
  },

  async verifyEmail(_, payload) {
    const { email, verificationToken } = payload
    console.log('[user.verifyEmail]', email, verificationToken)

    try {
      const res = await axios.post('/verifyEmail', {
        verificationToken,
        email,
      })
      return res.data.msg
    } catch (error) {
      console.log('[user.verifyEmail]', error.message)
      if (error.message === 'Request failed with status code 404')
        return '404 token is incorrect or has expired'
      else return error
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
