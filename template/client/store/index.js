import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  token: '',
  base: 'https://login.k12china.com',
  url: 'https://www.k12china.com',
  username: '',
  sysusername: '',
  userid: -1
}

const mutations = {
  saveToken (state, code) {
    state.token = code
  },
  saveUserName (state, username) {
    state.username = username
  },
  saveUser (state, obj) {
    state.realname = obj.real_name
    state.sysusername = obj.user_name
    state.userid = obj.user_id
  }
}

const actions = {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      //commit('INCREMENT')
    }, 200)
  }
}

const href = window.location.href
// debug
if (href.indexOf('http://127.0.0.1') === 0 || href.indexOf('http://localhost') === 0) {
  console.log('run in 本机调试')
  state.base = 'http://192.168.6.30:32390'
  // state.base = 'http://127.0.0.1:8080'
  state.url = 'http://127.0.0.1:8080'
} else if (href.indexOf('http://192.168.6.30') === 0 || href.indexOf('http://192.168.6.31') === 0) {
  console.log('run in 开发环境')
  state.base = 'http://192.168.6.30:32390'
  state.url = ''
} else if (href.indexOf('http://192.168.6.35') === 0 || href.indexOf('http://192.168.6.36') === 0) {
  console.log('run in 测试环境')
  state.base = 'http://login.k12china-test.com'
  state.url = ''
} else {
  console.log('run in 生产环境')
}

const store = new Vuex.Store({
  state,
  mutations,
  actions
})

export default store
