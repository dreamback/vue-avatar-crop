import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: resolve => require(['@/pages/index.vue'], resolve)
    },
    {
      path: '/demo',
      name: 'demo',
      component: resolve => require(['@/pages/demo.vue'], resolve)
    }
  ]
})
