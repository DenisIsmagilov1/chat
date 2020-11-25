import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import Buefy from 'buefy'
import TextareaAutosize from 'vue-textarea-autosize'
import { firestorePlugin } from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'buefy/dist/buefy.css'
import './assets/css/style.css'

Vue.use(TextareaAutosize)

Vue.use(Buefy)

Vue.use(firestorePlugin)
firebase.initializeApp({
  apiKey: "AIzaSyAb4IvbAsE-SKMcpkvcpewS1jFXGSePB9M",
  authDomain: "mbot-e62a4.firebaseapp.com",
  databaseURL: "https://mbot-e62a4.firebaseio.com",
  projectId: "mbot-e62a4",
  storageBucket: "mbot-e62a4.appspot.com",
  messagingSenderId: "182530910281",
  appId: "1:182530910281:web:47af12a3847e1464c8b798"
})
export const db = firebase.firestore()

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
