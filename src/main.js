import { createApp } from 'vue'
import App from './App.vue'
import store from './store'; // import the Vuex store
import router from './router'; // import the Vuex router



const app = createApp(App);
app.use(store);
app.use(router);
app.mount('#app');
