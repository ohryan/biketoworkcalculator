import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import SocialSharing from 'vue-social-sharing'

Vue.config.productionTip = false
Vue.use(SocialSharing)

new Vue({
  render: h => h(App)
}).$mount('#app')
