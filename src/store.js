import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    user: null,
    referredBy: null,
    redirectAfterLoginRegister: null,
    defaultCurrency: 'USD',
    currencyConversions: null,
    preferredLanguage: 'en'
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    setReferredBy (state, payload) {
      state.referredBy = payload
    },
    setRedirectAfterLoginRegister (state, payload) {
      state.redirectAfterLoginRegister = payload
    },
    setDefaultCurrency (state, payload) {
      state.defaultCurrency = payload
    },
    setCurrencyConversions (state, payload) {
      state.currencyConversions = payload
    },
    setPreferredLanguage (state, payload) {
      state.preferredLanguage = payload
    }
  },
  actions: {
    setUser ({commit}, payload) {
      commit('setUser', payload)
    },
    signUserUp ({commit}, payload) {
      commit('setUser', payload)
    },
    signUserIn ({commit}, payload) {
      commit('setUser', payload)
    },
    signUserOut ({commit}) {
      commit('setUser', null)
    },
    setReferredBy ({commit}, payload) {
      commit('setReferredBy', payload)
    },
    setRedirectAfterLoginRegister ({commit}, payload) {
      commit('setRedirectAfterLoginRegister', payload)
    },
    setDefaultCurrency ({commit}, payload) {
      commit('setDefaultCurrency', payload)
    },
    setCurrencyConversions ({commit}, payload) {
      commit('setCurrencyConversions', payload)
    },
    setPreferredLanguage ({commit}, payload) {
      commit('setPreferredLanguage', payload)
    }
  },
  getters: {
    user (state) {
      return state.user
    },
    userUid (state) {
      return state.user.uid
    },
    referredBy (state) {
      return state.referredBy
    },
    redirectAfterLoginRegister (state) {
      return state.redirectAfterLoginRegister
    },
    defaultCurrency (state) {
      return state.defaultCurrency
    },
    currencyConversions (state) {
      return state.currencyConversions
    },
    preferredLanguage (state) {
      return state.preferredLanguage
    }
  },
  plugins: [createPersistedState()]
})
