import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import permission from './utils/permission';
import installer from './as-needed';
import 'ele-admin-plus/es/style/nprogress.scss';
import 'element-plus/theme-chalk/display.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import 'ele-admin-plus/es/style/themes/dark-css-var.scss';
import './styles/index.scss';

const app = createApp(App);

app.use(store);
app.use(router);
app.use(permission);
app.use(installer);

app.mount('#app');
