import App from './App'

// #ifndef VUE3
import Vue from 'vue'
App.mpType = 'app'
import request from './util/request.js'
Vue.config.productionTip = false
Vue.prototype.$request = request
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif