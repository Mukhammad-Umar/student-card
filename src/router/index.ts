import appConfig from "../../app.config.json";
import { projectRoutes } from './projectRoutes';
import { createRouter, createWebHistory } from 'vue-router';
import { token, removeAllTokens } from '@/service/TokenService';

const routes = [...projectRoutes];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
});

router.beforeEach((to, from, next) => {
  const hasToken = !!token.get();
  const isPrivate = to.matched.some((record) => record.meta.private);
  const isAuth = to.matched.some((record) => record.meta.auth);

  if (to.name === 'BaseLogin' && to.redirectedFrom === undefined) {
    removeAllTokens();
    return next({ name: 'BaseAuth' });
  }

  if (!hasToken && isPrivate) {
    removeAllTokens();
    return next({ name: 'BaseAuth' });
  }

  if (hasToken && isAuth) {
    return next({ name: 'Main' });
  }

  document.title = to.meta.title + ' | ' + appConfig.title;

  if(document.getElementsByClassName('tooltip')[0]?.classList){
    document.getElementsByClassName('tooltip')[0].classList?.remove('show')
  }

  next();
});


export default router;
