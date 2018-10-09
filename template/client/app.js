import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import App from './components/App'
import router from './router'
import store from './store'
import { Button, Header, Field, Cell } from 'mint-ui'
import '@babel/polyfill'

Vue.component(Button.name, Button)
Vue.component(Header.name, Header)
Vue.component(Field.name, Field)
Vue.component(Cell.name, Cell)

sync(store, router)

const app = new Vue({
  router,
  store,
  ...App
})

export { app, router, store }
