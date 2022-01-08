import axios from '../../axios'

const state = () => ({
  accountId: null,
  institutionName: null,
  processorToken: null,
})

const getters = {}

const actions = {
  async getLinkToken() {
    const res = await axios.get('/plaid/create-link-token')
    // console.log('getLinkToken res', res)
    return res.data.link_token
  },
  async linkAccount(_, payload) {
    // console.log('[plaid/linkAccount] payload', payload)
    const res = await axios.post('/plaid/token-exchange', payload)
    console.log('linkAccount res', res)
  },
}

const mutations = {
  PLAID_LOAD(state, { accountId, institutionName, processorToken }) {
    state.accountId = accountId
    state.institutionName = institutionName
    state.processorToken = processorToken
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
