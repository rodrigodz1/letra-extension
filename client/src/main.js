import Vue from 'vue';
import VueAnalytics from 'vue-analytics';
import vWow from 'v-wow';
import LoadScript from 'vue-plugin-load-script';
import VueSnackbar from 'vue-snack';
import 'vue-snack/dist/vue-snack.min.css';
import App from './App';
import store from './store/index';
import router from './router/index';
import './style/app.scss';

Vue.use(vWow);
Vue.use(LoadScript);
Vue.loadScript(process.env.VUE_APP_VOICE_URL);
Vue.use(VueAnalytics, {
  id: process.env.VUE_APP_GOOGLE_ANALYTICS_ID,
  router,
  debug: { enabled: process.env.NODE_ENV === 'development' },
  set: [{ field: 'checkProtocolTask', value: null }],
});

Vue.use(VueSnackbar);

Vue.filter('titleize', str => {
  if (typeof str !== 'string') return '';

  const frags = str.split('-');
  return frags
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
});

Vue.directive('click-outside', {
  bind(el, binding, vnode) {
    const vm = vnode.context;
    const callback = binding.value;

    // eslint-disable-next-line
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        return callback.call(vm, event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unbind(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  },
});

(() =>
  new Vue({
    el: '#app',
    render: h => h(App),
    store,
    router,
  }))();
