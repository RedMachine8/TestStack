import Vue from 'vue';
import Router from 'vue-router';
import Organizations from '../components/Organizations';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Organizations',
      component: Organizations,
    },
  ],
  mode: 'history',
});
