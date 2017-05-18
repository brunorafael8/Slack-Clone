// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'
import store from './store'

// Initialize Firebase
let config = {
  apiKey: "AIzaSyBf7sUbfgN3jNwi2a0jXPW1vocrvwGKrik",
  authDomain: "slack-clone-c9c18.firebaseapp.com",
  databaseURL: "https://slack-clone-c9c18.firebaseio.com",
  projectId: "slack-clone-c9c18",
  storageBucket: "slack-clone-c9c18.appspot.com",
  messagingSenderId: "643242151043"
};
firebase.initializeApp(config);
window.firebase = firebase

const unsuscribe = firebase.auth().onAuthStateChanged(user => {

  store.dispatch('setUser', user)

  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App },
    store
  })

  unsuscribe()

})

Vue.config.productionTip = false

/* eslint-disable no-new */
