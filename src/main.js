import { createApp } from 'vue';
import App from './App.vue';
import * as Vue from 'vue' // in Vue 3
import axios from 'axios'
import VueAxios from 'vue-axios'

import { Quasar } from 'quasar';
import quasarUserOptions from './quasar-user-options';

const app = Vue.createApp(App).use(Quasar, quasarUserOptions).mount('#app');

