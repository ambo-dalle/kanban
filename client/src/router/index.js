import Vue from 'vue'
import Router from 'vue-router'
import Kanban from '@/components/FormKanban'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'FormKanban',
      component: Kanban
    }
  ]
})
