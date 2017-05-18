import Vue from 'vue'
import Router from 'vue-router'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Schat from '../pages/Schat'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/',
      name: 'schat',
      component: Schat,
      beforeEnter: (to, from, next) => {
        if(!firebase.auth().currentUser){
          next('/login')
        }else{
          next()
        }
      }
    }
  ]
})
