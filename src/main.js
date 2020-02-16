import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import firebase from 'firebase/app';
import "firebase/firestore";

Vue.config.productionTip = false;

const firebaseConfig = {
  apiKey: "AIzaSyBuWTWc2xuXDZADgdTkeQKpbKRh0fK5LKY",
  authDomain: "pecuchovo-silenstvi.firebaseapp.com",
  databaseURL: "https://pecuchovo-silenstvi.firebaseio.com",
  projectId: "pecuchovo-silenstvi",
  storageBucket: "pecuchovo-silenstvi.appspot.com",
  messagingSenderId: "546553350451",
  appId: "1:546553350451:web:74955725cc0be4f2e95646"
};

firebase.initializeApp(firebaseConfig);
firebase.firestore().enablePersistence({ synchronizeTabs: true })
  .catch(function (err) {
    if (err.code == 'failed-precondition') {
      alert("Multiple tabs open, please have opened only one tab at a time");
    } else if (err.code == 'unimplemented') {
      alert("Uncompatible browser");
    }
  });

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
