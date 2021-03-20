import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import firebase from 'firebase';
import { store } from './store';

import axios from 'axios'
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

Vue.prototype.axios = axios;
      
Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: "AIzaSyAGhbRuU_qIdCBZSfFnAjnopcdzOySAv-c",
  authDomain: "holden-d9487.firebaseapp.com",
  projectId: "holden-d9487",
  storageBucket: "holden-d9487.appspot.com",
  messagingSenderId: "779628493793",
  appId: "1:779628493793:web:21b9f4275e22503800f0a0"
};

firebase.initializeApp(firebaseConfig);
Vue.prototype.$firebase = firebase;


new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
