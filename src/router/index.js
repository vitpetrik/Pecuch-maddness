import Vue from 'vue';
import VueRouter from 'vue-router';
import pozde from '../views/pozde.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'pozde',
    component: pozde,
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
